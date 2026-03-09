import React from "react";

export const metadata = {
  title: "Terms of Service | Stackd",
  description: "Terms of Service for Stackd booking platform.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-white px-6 py-20 font-sans text-neutral-900 selection:bg-neutral-100">
      <div className="mx-auto max-w-2xl">
        <header className="mb-16 border-b border-neutral-100 pb-10">
          <h1 className="mb-3 text-4xl font-semibold tracking-tight text-neutral-950">
            Terms of Service
          </h1>
          <p className="text-sm text-neutral-500 italic">
            Last updated: March 8, 2026
          </p>
        </header>

        <div className="space-y-12">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed text-neutral-600">
              By accessing or using the Stackd booking service, you agree to be
              bound by these Terms of Service. If you do not agree to these
              terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              2. Description of Service
            </h2>
            <p className="leading-relaxed text-neutral-600">
              Stackd provides an automated booking and appointment scheduling
              platform. Our service integrates with Google APIs to manage
              appointments on our administrative calendar and send you relevant
              invitations and notifications.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              3. User Responsibilities
            </h2>
            <p className="mb-6 leading-relaxed text-neutral-600">
              When using Stackd, you agree to:
            </p>
            <ul className="ml-5 list-outside list-disc space-y-3 text-neutral-600">
              <li>
                Provide accurate information (name and email) for bookings.
              </li>
              <li>
                Use the service in accordance with applicable laws and
                regulations.
              </li>
              <li>
                Not attempt to disrupt or interfere with the security or
                operation of the service.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              4. Google API Integration
            </h2>
            <p className="leading-relaxed text-neutral-600">
              Our service relies on Google OAuth for identity verification. By
              using this feature, you also agree to Google&apos;s Terms of
              Service and Privacy Policy. We are not responsible for any issues
              arising from Google&apos;s own infrastructure or data handling
              outside of our application.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              5. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-neutral-600">
              Stackd is provided &quot;as is&quot; without any warranties. We
              shall not be liable for any indirect, incidental, or consequential
              damages resulting from the use or inability to use our services.
            </p>
          </section>

          <section className="border-t border-neutral-100 pt-12">
            <h2 className="mb-4 text-lg font-semibold text-neutral-950">
              6. Contact Information
            </h2>
            <p className="mb-2 text-neutral-600">
              For any questions regarding these Terms, please reach out to us
              at:
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
