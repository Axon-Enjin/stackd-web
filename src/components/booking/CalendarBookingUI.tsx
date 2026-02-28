"use client";

import React, { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isBefore, startOfDay } from "date-fns";
import { Loader2, CheckCircle2, ChevronLeft, AlertCircle, Globe, ChevronDown, Search, Check } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function CalendarBookingUI() {
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
      : "UTC"
  );
  const [showTzPicker, setShowTzPicker] = useState(false);
  const [tzSearch, setTzSearch] = useState("");
  const tzDropdownRef = useRef<HTMLDivElement>(null);

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Close timezone picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tzDropdownRef.current && !tzDropdownRef.current.contains(e.target as Node)) {
        setShowTzPicker(false);
        setTzSearch("");
      }
    }
    if (showTzPicker) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTzPicker]);

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
      (event, session) => {
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

  if (isInitialLoad) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-indigo-600" />
        <p className="text-lg font-medium text-gray-600">
          Preparing your booking...
        </p>
      </div>
    );
  }

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

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <CheckCircle2 size={64} className="mb-6 text-green-500" />
        <h2 className="mb-2 text-3xl font-bold text-gray-900">
          Booking Confirmed!
        </h2>
        <p className="mb-6 text-gray-600">
          Thank you, {name}! Your strategy call is scheduled for{" "}
          <span className="font-semibold text-gray-900">
            {selectedSlot && format(selectedSlot, "MMMM d, yyyy 'at' h:mm a")}
          </span>
          .
        </p>
        <p className="text-sm text-gray-500">
          We've sent a Google Meet invitation to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:grid-cols-2">
      {/* LEFT COL: Date Picker */}
      <div className="flex flex-col items-center border-r border-gray-100 md:pr-8">
        <h3 className="mb-4 self-start text-lg font-bold text-gray-900">
          Select a Date
        </h3>

        {/* Timezone selector */}
        <div className="relative mb-4 w-full" ref={tzDropdownRef}>
          {/* Trigger pill */}
          <button
            type="button"
            onClick={() => {
              setShowTzPicker((v) => !v);
              setTzSearch("");
            }}
            className="group flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          >
            <Globe size={13} className="shrink-0 text-indigo-400 group-hover:text-indigo-600" />
            <span className="flex-1 truncate">{timezone}</span>
            <span className="shrink-0 text-indigo-500 group-hover:text-indigo-600">
              Verify your timezone
            </span>
            <ChevronDown
              size={13}
              className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                showTzPicker ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating dropdown */}
          {showTzPicker && (
            <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
              {/* Search header */}
              <div className="border-b border-gray-100 p-3">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-indigo-500">
                  <Search size={13} className="shrink-0 text-gray-400" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search timezones…"
                    value={tzSearch}
                    onChange={(e) => setTzSearch(e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                  />
                </div>
              </div>

              {/* Scrollable list */}
              <ul className="max-h-52 overflow-y-auto py-1 text-sm">
                {(() => {
                  const filtered = Intl.supportedValuesOf("timeZone").filter((tz) =>
                    tz.toLowerCase().includes(tzSearch.toLowerCase())
                  );
                  if (filtered.length === 0) {
                    return (
                      <li className="px-4 py-6 text-center text-sm text-gray-400">
                        No timezones match &ldquo;{tzSearch}&rdquo;
                      </li>
                    );
                  }
                  return filtered.map((tz) => (
                    <li key={tz}>
                      <button
                        type="button"
                        onClick={() => {
                          setTimezone(tz);
                          setShowTzPicker(false);
                          setTzSearch("");
                          setSelectedDate(undefined);
                          setSelectedSlot(null);
                          setAvailableSlots([]);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left transition-colors ${
                          tz === timezone
                            ? "bg-indigo-50 font-semibold text-indigo-700"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {tz === timezone ? (
                          <Check size={13} className="shrink-0 text-indigo-500" />
                        ) : (
                          <span className="w-[13px] shrink-0" />
                        )}
                        <span>{tz}</span>
                      </button>
                    </li>
                  ));
                })()}
              </ul>
            </div>
          )}
        </div>

        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          disabled={[{ before: startOfDay(new Date()) }, { dayOfWeek: [0, 6] }]}
          className="rounded-xl bg-gray-50 p-4"
          formatters={{
            formatCaption: (month) => format(month, "MMMM yyyy"),
          }}
          classNames={{
            day_selected:
              "bg-indigo-600 text-white font-bold hover:bg-indigo-700",
            day_today: "font-bold text-indigo-600",
            button:
              "w-10 h-10 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center",
            head_cell: "w-10 text-gray-400 font-medium text-sm pb-2",
            nav_button_previous:
              "absolute left-2 p-1 hover:bg-gray-200 rounded-full",
            nav_button_next:
              "absolute right-2 p-1 hover:bg-gray-200 rounded-full",
            caption: "relative flex justify-between pt-1 pb-4 items-center px-2",
            caption_label: "font-semibold text-gray-900 text-base",
          }}
        />
      </div>

      {/* RIGHT COL: Time Slots & Form */}
      <div>
        {/* Step 2: Time Slots */}
        {!selectedSlot && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d")
                : "Available Times"}
            </h3>

            {!selectedDate ? (
              <div className="mt-8 text-sm text-gray-400 italic">
                Please select a date from the calendar first.
              </div>
            ) : loadingSlots ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="mt-8 text-sm text-gray-500">
                No time slots available for this date.
              </div>
            ) : (
              <div className="custom-scrollbar grid max-h-[300px] grid-cols-2 gap-3 overflow-y-auto pr-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className="rounded-lg border border-indigo-100 px-4 py-3 text-center text-sm font-medium text-indigo-700 transition-all hover:border-indigo-300 hover:bg-indigo-50"
                  >
                    {format(slot, "h:mm a")}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Intake Form */}
        {selectedSlot && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div
              className="mb-6 flex cursor-pointer items-center gap-2 text-gray-500 transition-colors hover:text-indigo-600"
              onClick={() => setSelectedSlot(null)}
            >
              <ChevronLeft size={16} />
              <span className="text-sm font-medium">Back to time slots</span>
            </div>

            <div className="mb-6 flex flex-col rounded-lg bg-indigo-50 p-4 pt-3 pb-3 text-indigo-800">
              <span className="mb-1 text-xs font-bold tracking-wider uppercase opacity-70">
                Selected Time
              </span>
              <span className="font-semibold">
                {format(selectedSlot, "EEEE, MMMM d")}
              </span>
              <span className="text-lg">{format(selectedSlot, "h:mm a")}</span>
            </div>

            {authError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <p>{authError}</p>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 transition-all outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Loader overlay over the whole right side during redirect processing */}
              {submitting && !authError && (
                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-50 py-3.5 font-semibold text-indigo-600">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying Google Account...</span>
                </div>
              )}

              {(!submitting || authError) && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 py-3.5 font-semibold text-white shadow-md shadow-indigo-600/20 transition-colors hover:bg-indigo-700 disabled:opacity-70"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="h-4 w-4 rounded-full bg-white p-0.5"
                  />
                  Verify Google Account & Book
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
