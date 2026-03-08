import React from "react";

export const metadata = {
  title: "Privacy Policy | Stackd",
  description:
    "Privacy Policy for Stackd services and Google OAuth integration.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20 font-sans text-neutral-900 selection:bg-neutral-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-16 border-b border-neutral-100 pb-10">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-neutral-950">
            Privacy Policy
          </h1>
          <p className="text-sm text-neutral-500 italic">
            Last updated: March 8, 2026
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              1. Introduction
            </h2>
            <p className="leading-relaxed text-neutral-600">
              At Stackd, we respect your privacy and are committed to protecting
              it. This Privacy Policy explains how we collect, use, and process
              your data when you use our booking services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              2. Information We Collect via Google APIs
            </h2>
            <p className="mb-6 leading-relaxed text-neutral-600">
              When you use our booking system, we access specific information
              from Google APIs to facilitate your appointment:
            </p>
            <div className="space-y-6 border-l border-neutral-100 pl-4">
              <div>
                <h3 className="mb-1 text-sm font-semibold text-neutral-800">
                  Email Address
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-600">
                  We use Google OAuth to verify your email address to ensure the
                  booking belongs to you.
                </p>
              </div>
              <div>
                <h3 className="mb-1 text-sm font-semibold text-neutral-800">
                  Calendar Data
                </h3>
                <p className="text-[15px] leading-relaxed text-neutral-600">
                  Our application uses a dedicated administrative Google
                  Calendar to manage bookings. When you book a slot, we create
                  an event on this calendar and add your email as an attendee so
                  you receive a calendar invitation and a Google Meet link.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              3. How We Use This Data
            </h2>
            <p className="mb-4 leading-relaxed text-neutral-600">
              We use your Google data solely for the following purposes:
            </p>
            <ul className="ml-5 list-outside list-disc space-y-3 text-neutral-600">
              <li>To confirm your identity via Google Sign-In.</li>
              <li>
                To schedule your appointment and send you automated calendar
                invites and reminders.
              </li>
            </ul>
            <p className="mt-6 bg-neutral-50 p-4 text-[13px] leading-relaxed text-neutral-500">
              <strong>Data Sharing Disclosure:</strong> We do not sell, trade,
              or share your Google user data with any third parties. We do not
              use this data for marketing purposes without your explicit
              consent.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              4. Limited Use Disclosure
            </h2>
            <p className="leading-relaxed text-neutral-600">
              Stackd&apos;s use and transfer to any other app of information
              received from Google APIs will adhere to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
              >
                Google API Service User Data Policy
              </a>
              , including the Limited Use requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              5. Your Rights & Revoking Access
            </h2>
            <p className="leading-relaxed text-neutral-600">
              You can revoke our application&apos;s access to your Google
              account at any time through your{" "}
              <a
                href="https://myaccount.google.com/permissions"
                className="text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-colors hover:decoration-neutral-900"
              >
                Google Security Settings
              </a>
              .
            </p>
          </section>

          <section className="border-t border-neutral-100 pt-12">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              6. Contact Information
            </h2>
            <p className="mb-2 text-neutral-600">
              If you have any questions regarding this Privacy Policy or our use
              of Google APIs, please contact our support team:
            </p>
            <p className="font-medium text-neutral-950">
              stackdcommerce@gmail.com
            </p>
          </section>
        </div>

        <footer className="mt-24 border-t border-neutral-100 pt-8 text-center">
          <p className="text-xs font-medium tracking-widest text-neutral-400 uppercase">
            &copy; 2026 Stackd. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
