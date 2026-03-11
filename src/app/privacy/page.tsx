import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | Stackd",
  description:
    "Privacy Policy for Stackd services and Google OAuth integration.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F7F9FC] text-[#1A1A1A]">
        {/* Page Hero */}
        <div className="bg-[#0B1F3B] pt-18">
          <div className="mx-auto max-w-3xl px-6 py-16">
            <span className="mb-4 block text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8]">
              Legal
            </span>
            <h1 className="mb-3 text-4xl font-bold tracking-tight text-white">
              Privacy Policy
            </h1>
            <p className="text-sm text-white/40">Last updated: March 8, 2026</p>
          </div>
        </div>

        {/* Content */}
        <main className="mx-auto max-w-3xl px-6 py-16">
          <div className="space-y-12">
            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  01
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Introduction
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                At Stackd, we respect your privacy and are committed to
                protecting it. This Privacy Policy explains how we collect, use,
                and process your data when you use our booking services.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  02
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Information We Collect via Google APIs
                </h2>
              </div>
              <p className="mb-6 leading-relaxed text-[#1A1A1A]/70">
                When you use our booking system, we access specific information
                from Google APIs to facilitate your appointment:
              </p>
              <div className="space-y-6 border-l-2 border-[#0B1F3B]/10 pl-5">
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[#0B1F3B]">
                    Email Address
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#1A1A1A]/70">
                    We use Google OAuth to verify your email address to ensure
                    the booking belongs to you.
                  </p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-semibold text-[#0B1F3B]">
                    Calendar Data
                  </h3>
                  <p className="text-[15px] leading-relaxed text-[#1A1A1A]/70">
                    Our application uses a dedicated administrative Google
                    Calendar to manage bookings. When you book a slot, we create
                    an event on this calendar and add your email as an attendee
                    so you receive a calendar invitation and a Google Meet link.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  03
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  How We Use This Data
                </h2>
              </div>
              <p className="mb-4 leading-relaxed text-[#1A1A1A]/70">
                We use your Google data solely for the following purposes:
              </p>
              <ul className="ml-5 list-outside list-disc space-y-3 text-[#1A1A1A]/70">
                <li>To confirm your identity via Google Sign-In.</li>
                <li>
                  To schedule your appointment and send you automated calendar
                  invites and reminders.
                </li>
              </ul>
              <div className="mt-6 border-l-2 border-[#2F80ED]/40 bg-[#2F80ED]/5 p-4">
                <p className="text-[13px] leading-relaxed text-[#1A1A1A]/70">
                  <strong className="text-[#0B1F3B]">
                    Data Sharing Disclosure:
                  </strong>{" "}
                  We do not sell, trade, or share your Google user data with any
                  third parties. We do not use this data for marketing purposes
                  without your explicit consent.
                </p>
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  04
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Limited Use Disclosure
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                Stackd&apos;s use and transfer to any other app of information
                received from Google APIs will adhere to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  className="font-medium text-[#2F80ED] underline decoration-[#2F80ED]/30 underline-offset-4 transition-colors hover:decoration-[#2F80ED]"
                >
                  Google API Service User Data Policy
                </a>
                , including the Limited Use requirements.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  05
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Your Rights &amp; Revoking Access
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                You can revoke our application&apos;s access to your Google
                account at any time through your{" "}
                <a
                  href="https://myaccount.google.com/permissions"
                  className="font-medium text-[#2F80ED] underline decoration-[#2F80ED]/30 underline-offset-4 transition-colors hover:decoration-[#2F80ED]"
                >
                  Google Security Settings
                </a>
                .
              </p>
            </section>

            <section className="border-t border-[#0B1F3B]/10 pt-12">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  06
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Contact Information
                </h2>
              </div>
              <p className="mb-3 leading-relaxed text-[#1A1A1A]/70">
                If you have any questions regarding this Privacy Policy or our
                use of Google APIs, please contact our support team:
              </p>
              <a
                href="mailto:stackdcommerce@gmail.com"
                className="font-semibold text-[#2F80ED] transition-colors hover:text-[#2570d4]"
              >
                stackdcommerce@gmail.com
              </a>
            </section>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
