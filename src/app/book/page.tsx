import { CalendarBookingUI } from "@/components/booking/CalendarBookingUI";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function BookingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 pt-16">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl flex-grow px-6 py-16">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Book Your Strategy Call
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Choose a time that works best for you and let’s discuss how we can
            build your next great product together. Our team will automatically
            send a Google Meet calendar invite straight to your inbox.
          </p>
        </div>

        <CalendarBookingUI />
      </main>
      <Footer />
    </div>
  );
}
