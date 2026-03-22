"use client";

import { useState } from "react";
import { Mail, Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function TestMailerPage() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Stackd Mailer Test");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setResult(null);

    try {
      const response = await fetch("/api/test/mailer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, subject, message }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setResult({ success: true, message: data.message });
        setMessage(""); // Clear message on success
      } else {
        setResult({ success: false, message: data.message || "Failed to send" });
      }
    } catch (error) {
      setResult({ success: false, message: "An unexpected error occurred" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-soft-white flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-navy p-8 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Mail className="text-brand-blue" size={24} />
            <h1 className="text-2xl font-bold tracking-tight">Mailer Module Test</h1>
          </div>
          <p className="text-white/60 text-sm">
            Verify the Gmail API integration by sending a test message.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-8 space-y-6">
          {result && (
            <div className={`p-4 rounded-xl flex items-start gap-3 ${
              result.success ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"
            }`}>
              {result.success ? <CheckCircle2 size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
              <p className="text-sm font-medium">{result.message}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
              Recipient Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
              placeholder="recipient@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all"
              placeholder="Enter subject..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
              Test Message
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 outline-none transition-all resize-none"
              placeholder="Write your test content here..."
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-navy text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-navy/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:pointer-events-none"
          >
            {isSending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <Send size={20} />
                Send Test Email
              </>
            )}
          </button>
        </form>

        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <p className="text-[10px] text-center text-gray-400 uppercase tracking-widest font-bold">
            Powered by Stackd Gmail Service
          </p>
        </div>
      </div>
    </main>
  );
}
