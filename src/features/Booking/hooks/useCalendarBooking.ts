import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";

export function useCalendarBooking() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  const [timezone, setTimezone] = useState<string>(() =>
    typeof window !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC",
  );

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch("/api/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
          body: JSON.stringify({
            name,
            email,
            startTime: selectedSlot?.toISOString(),
            timezone,
          }),
        });

        if (res.ok) {
          const { booking } = await res.json();
          setConfirmedBooking(booking);
          setIsSuccess(true);
        } else {
          const err = await res.json();
          setAuthError(`Failed to book: ${err.error}`);
        }
      } catch (error) {
        console.error(error);
        setAuthError("Network error while booking.");
      } finally {
        setSubmitting(false);
      }
    },
    onError: (error) => {
      setAuthError(
        `Failed to authenticate with Google: ${error.error_description || "Unknown error"}`,
      );
      setSubmitting(false);
    },
  });

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

    // Call the googleLogin function to trigger the popup
    googleLogin();
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
    confirmedBooking,
    authError,
    timezone,
    setTimezone,
    isInitialLoad: false, // Set to false since we don't do initial loading checks anymore
    handleDateSelect,
    handleBookingSubmit,
  };
}
