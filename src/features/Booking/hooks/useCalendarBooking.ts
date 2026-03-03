import { useState, useEffect } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";

export function useCalendarBooking() {
  const supabase = createSupabaseBrowserClient();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [timezone, setTimezone] = useState<string>(() =>
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC",
  );

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    const checkPendingBooking = async () => {
      const pendingEmail = localStorage.getItem("stackd_pending_booking_email");
      if (!pendingEmail) {
        setIsInitialLoad(false);
        return;
      }

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIsInitialLoad(false);
        return;
      }

      const pendingName = localStorage.getItem("stackd_pending_booking_name");
      const pendingTime = localStorage.getItem("stackd_pending_booking_time");

      setSubmitting(true);
      setAuthError(null);

      // Verification Step
      if (session.user.email?.toLowerCase() !== pendingEmail.toLowerCase()) {
        setAuthError(
          `The Google account selected (${session.user.email}) does not match the email requested (${pendingEmail}).`,
        );

        // Delete mismatched user silently
        await fetch("/api/auth/delete-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: session.user.id }),
        }).catch(console.error);

        await supabase.auth.signOut();

        localStorage.removeItem("stackd_pending_booking_email");
        localStorage.removeItem("stackd_pending_booking_name");
        localStorage.removeItem("stackd_pending_booking_time");
        setSubmitting(false);
        setIsInitialLoad(false);
        return;
      }

      // Success path
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: pendingName,
            startTime: pendingTime,
          }),
        });

        if (res.ok) {
          setName(pendingName || "");
          if (pendingTime) setSelectedSlot(new Date(pendingTime));
          setIsSuccess(true);
        } else {
          const err = await res.json();
          setAuthError(`Failed to book: ${err.error}`);
        }
      } catch (error) {
        console.error(error);
        setAuthError("Network error while booking.");
      } finally {
        localStorage.removeItem("stackd_pending_booking_email");
        localStorage.removeItem("stackd_pending_booking_name");
        localStorage.removeItem("stackd_pending_booking_time");
        setSubmitting(false);
        setIsInitialLoad(false);
      }
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        if (event === "SIGNED_IN" && session) {
          checkPendingBooking();
        }
      },
    );

    checkPendingBooking();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleDateSelect = async (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedSlot(null);
    setAvailableSlots([]);
    setAuthError(null);

    if (!date) return;

    setLoadingSlots(true);
    try {
      const res = await fetch(
        `/api/booking/available?date=${date.toISOString()}&timezone=${encodeURIComponent(timezone)}`,
      );
      if (res.ok) {
        const data = await res.json();
        setAvailableSlots(data.slots.map((s: string) => new Date(s)));
      } else {
        console.error("Failed to fetch slots");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !name || !email) return;

    setSubmitting(true);
    setAuthError(null);

    localStorage.setItem("stackd_pending_booking_name", name);
    localStorage.setItem("stackd_pending_booking_email", email);
    localStorage.setItem("stackd_pending_booking_timezone", timezone);
    localStorage.setItem(
      "stackd_pending_booking_time",
      selectedSlot.toISOString(),
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback?next=/cta`,
      },
    });

    if (error) {
      setAuthError(`Failed to authenticate with Google: ${error.message}`);
      setSubmitting(false);
    }
  };

  return {
    selectedDate,
    setSelectedDate,
    availableSlots,
    setAvailableSlots,
    loadingSlots,
    selectedSlot,
    setSelectedSlot,
    name,
    setName,
    email,
    setEmail,
    submitting,
    isSuccess,
    authError,
    timezone,
    setTimezone,
    isInitialLoad,
    handleDateSelect,
    handleBookingSubmit,
  };
}
