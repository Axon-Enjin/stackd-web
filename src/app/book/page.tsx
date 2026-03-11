import { CalendarBookingUI } from "@/components/booking/CalendarBookingUI";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlurFade } from "@/components/magicui/BlurFade";

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7F9FC] pt-16">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-grow px-6 py-16">
        <div className="mb-12 text-center">
          <BlurFade delay={0.05}>
            <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2FB7A8] mb-4 block">
              Strategy Call
            </span>
          </BlurFade>
          <BlurFade delay={0.12}>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#0B1F3B] md:text-5xl">
              Book Your Strategy Call
            </h1>
          </BlurFade>
          <BlurFade delay={0.2}>
            <p className="mx-auto max-w-2xl text-lg text-[#1A1A1A]/60">
              Choose a time that works for you. We&apos;ll discuss your TikTok
              Shop goals and whether Stackd is the right operations partner for
              your brand. A Google Meet invite will be sent straight to your
              inbox.
            </p>
          </BlurFade>
        </div>

        <BlurFade delay={0.28}>
          <CalendarBookingUI />
        </BlurFade>
      </main>
      <Footer />
    </div>
  );
}
