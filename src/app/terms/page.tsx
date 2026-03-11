import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | Stackd",
  description: "Terms of Service for Stackd booking platform.",
};

export default function TermsOfServicePage() {
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
              Terms of Service
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
                  Acceptance of Terms
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                By accessing or using the Stackd booking service, you agree to
                be bound by these Terms of Service. If you do not agree to these
                terms, please do not use our services.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  02
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Description of Service
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                Stackd provides an automated booking and appointment scheduling
                platform. Our service integrates with Google APIs to manage
                appointments on our administrative calendar and send you
                relevant invitations and notifications.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  03
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  User Responsibilities
                </h2>
              </div>
              <p className="mb-6 leading-relaxed text-[#1A1A1A]/70">
                When using Stackd, you agree to:
              </p>
              <ul className="ml-5 list-outside list-disc space-y-3 text-[#1A1A1A]/70">
                <li>Provide accurate information (name and email) for bookings.</li>
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
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  04
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Google API Integration
                </h2>
              </div>
              <p className="leading-relaxed text-[#1A1A1A]/70">
                Our service relies on Google OAuth for identity verification. By
                using this feature, you also agree to Google&apos;s Terms of
                Service and Privacy Policy. We are not responsible for any
                issues arising from Google&apos;s own infrastructure or data
                handling outside of our application.
              </p>
            </section>

            <section>
              <div className="mb-4 flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-widest text-[#2FB7A8] uppercase">
                  05
                </span>
                <h2 className="text-lg font-semibold text-[#0B1F3B]">
                  Limitation of Liability
                </h2>
              </div>
              <div className="border-l-2 border-[#0B1F3B]/10 pl-5">
                <p className="leading-relaxed text-[#1A1A1A]/70">
                  Stackd is provided &quot;as is&quot; without any warranties.
                  We shall not be liable for any indirect, incidental, or
                  consequential damages resulting from the use or inability to
                  use our services.
                </p>
              </div>
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
                For any questions regarding these Terms, please reach out to us
                at:
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
