"use client";

import React, { useState, useEffect, useRef } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, isBefore, startOfDay } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import {
  Loader2,
  CheckCircle2,
  ChevronLeft,
  AlertCircle,
  Globe,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";
import { useCalendarBooking } from "@/features/Booking/hooks/useCalendarBooking";

export function CalendarBookingUI() {
  const {
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
    isInitialLoad,
    handleDateSelect,
    handleBookingSubmit,
  } = useCalendarBooking();

  const [showTzPicker, setShowTzPicker] = useState(false);
  const [tzSearch, setTzSearch] = useState("");
  const tzDropdownRef = useRef<HTMLDivElement>(null);

  const getGMTOffset = (tz: string) => {
    try {
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: tz,
        timeZoneName: "shortOffset",
      });
      const parts = formatter.formatToParts(new Date());
      const offsetPart = parts.find((p) => p.type === "timeZoneName");
      return offsetPart ? offsetPart.value : "";
    } catch (e) {
      return "";
    }
  };

  // Close timezone picker on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        tzDropdownRef.current &&
        !tzDropdownRef.current.contains(e.target as Node)
      ) {
        setShowTzPicker(false);
        setTzSearch("");
      }
    }
    if (showTzPicker)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTzPicker]);

  if (isInitialLoad) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#2F80ED]" />
        <p className="text-lg font-medium text-[#1A1A1A]/60">
          Preparing your booking...
        </p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
        <CheckCircle2 size={64} className="mb-6 text-green-500" />
        <h2 className="mb-2 text-3xl font-bold text-[#0B1F3B]">
          Booking Confirmed!
        </h2>
        <p className="mb-6 text-[#1A1A1A]/60">
          Thank you, {name}! Your strategy call is scheduled for{" "}
          <span className="font-semibold text-[#0B1F3B]">
            {selectedSlot &&
              formatInTimeZone(
                selectedSlot,
                timezone,
                "MMMM d, yyyy 'at' h:mm a",
              )}{" "}
            ({getGMTOffset(timezone)})
          </span>
          .
        </p>
        <p className="text-sm text-[#1A1A1A]/45">
          We&apos;ve sent a Google Meet invitation to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-gray-100 bg-white p-8 shadow-sm md:grid-cols-2">
      {/* LEFT COL: Date Picker */}
      <div className="flex flex-col items-center border-r border-gray-100 md:pr-8">
        <h3 className="mb-4 self-start text-lg font-bold text-[#0B1F3B]">
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
            className="group flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-left text-xs font-medium text-gray-600 shadow-sm transition-all hover:border-[#2F80ED]/40 hover:bg-[#2F80ED]/5 hover:text-[#2F80ED]"
          >
            <Globe
              size={13}
              className="shrink-0 text-[#2F80ED]/60 group-hover:text-[#2F80ED]"
            />
            <span className="flex-1 truncate">
              {timezone} ({getGMTOffset(timezone)})
            </span>
            <span className="shrink-0 text-[#2F80ED]/70 group-hover:text-[#2F80ED]">
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
            <div className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5">
              {/* Search header */}
              <div className="border-b border-gray-100 p-3">
                <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#2F80ED]">
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
                  const filtered = Intl.supportedValuesOf("timeZone").filter(
                    (tz) => tz.toLowerCase().includes(tzSearch.toLowerCase()),
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
                            ? "bg-[#2F80ED]/5 font-semibold text-[#0B1F3B]"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {tz === timezone ? (
                          <Check
                            size={13}
                            className="shrink-0 text-[#2F80ED]"
                          />
                        ) : (
                          <span className="w-[13px] shrink-0" />
                        )}
                        <span className="flex-1 truncate">{tz}</span>
                        <span className="shrink-0 text-[10px] opacity-50">
                          {getGMTOffset(tz)}
                        </span>
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
          className="rounded-xl bg-[#F7F9FC] p-4"
          formatters={{
            formatCaption: (month) => format(month, "MMMM yyyy"),
          }}
          classNames={{
            day_selected:
              "bg-[#0B1F3B] text-white font-bold hover:bg-[#0f2a4d]",
            day_today: "font-bold text-[#2F80ED]",
            button:
              "w-10 h-10 hover:bg-gray-200 rounded-full transition-colors flex items-center justify-center",
            head_cell: "w-10 text-gray-400 font-medium text-sm pb-2",
            nav_button_previous:
              "absolute left-2 p-1 hover:bg-gray-200 rounded-full",
            nav_button_next:
              "absolute right-2 p-1 hover:bg-gray-200 rounded-full",
            caption:
              "relative flex justify-between pt-1 pb-4 items-center px-2",
            caption_label: "font-semibold text-[#0B1F3B] text-base",
          }}
        />
      </div>

      {/* RIGHT COL: Time Slots & Form */}
      <div>
        {/* Step 2: Time Slots */}
        {!selectedSlot && (
          <div>
            <h3 className="mb-4 text-lg font-bold text-[#0B1F3B]">
              {selectedDate
                ? format(selectedDate, "EEEE, MMMM d")
                : "Available Times"}
            </h3>

            <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#2F80ED]/10 bg-[#2F80ED]/5 p-3">
              <AlertCircle size={14} className="shrink-0 text-[#2F80ED]" />
              <div className="text-[10px] leading-tight text-[#1A1A1A]/60">
                <span className="mb-0.5 block font-semibold text-[#0B1F3B]">
                  Timezone Context
                </span>
                All slots reflect your selected timezone:{" "}
                <span className="font-medium">
                  {timezone} ({getGMTOffset(timezone)})
                </span>
                . Business hours are set to 9:00 AM – 5:00 PM US Eastern Time.
              </div>
            </div>

            {!selectedDate ? (
              <div className="mt-8 text-sm text-[#1A1A1A]/40 italic">
                Please select a date from the calendar first.
              </div>
            ) : loadingSlots ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="animate-spin text-[#2F80ED]" size={32} />
              </div>
            ) : availableSlots.length === 0 ? (
              <div className="mt-8 text-sm text-[#1A1A1A]/50">
                No time slots available for this date.
              </div>
            ) : (
              <div className="custom-scrollbar grid max-h-[300px] grid-cols-2 gap-3 overflow-y-auto pr-2">
                {availableSlots.map((slot, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSlot(slot)}
                    className="rounded-lg border border-[#2F80ED]/15 px-4 py-3 text-center text-sm font-medium text-[#0B1F3B] transition-all hover:border-[#2F80ED]/50 hover:bg-[#2F80ED]/5"
                  >
                    {formatInTimeZone(slot, timezone, "h:mm a")}
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
              className="mb-6 flex cursor-pointer items-center gap-2 text-[#1A1A1A]/50 transition-colors hover:text-[#2F80ED]"
              onClick={() => setSelectedSlot(null)}
            >
              <ChevronLeft size={16} />
              <span className="text-sm font-medium">Back to time slots</span>
            </div>

            <div className="mb-6 flex flex-col rounded-lg bg-[#0B1F3B]/5 p-4 pt-3 pb-3 text-[#0B1F3B]">
              <span className="mb-1 text-xs font-bold tracking-wider uppercase opacity-70">
                Selected Time
              </span>
              <span className="font-semibold">
                {formatInTimeZone(selectedSlot, timezone, "EEEE, MMMM d")}
              </span>
              <span className="text-lg">
                {formatInTimeZone(selectedSlot, timezone, "h:mm a")} (
                {getGMTOffset(timezone)})
              </span>
            </div>

            {authError && (
              <div className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <p>{authError}</p>
              </div>
            )}

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1A1A1A]/70">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 transition-all outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-[#1A1A1A]/70">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-lg border border-gray-300 p-3 transition-all outline-none focus:border-[#2F80ED] focus:ring-2 focus:ring-[#2F80ED]/20"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Loader overlay over the whole right side during redirect processing */}
              {submitting && !authError && (
                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#2F80ED]/5 py-3.5 font-semibold text-[#2F80ED]">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Verifying Google Account...</span>
                </div>
              )}

              {(!submitting || authError) && (
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0B1F3B] py-3.5 font-semibold text-white shadow-md shadow-[#0B1F3B]/20 transition-colors hover:bg-[#0f2a4d] disabled:opacity-70"
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
