"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.push("/admin");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(data.error || "שגיאה בהתחברות");
    } catch {
      setError("שגיאת תקשורת. נסו שוב.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-bl from-brand-secondary to-brand-deep px-5">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h1 className="text-2xl font-bold text-brand-primary">פאנל ניהול</h1>
        <p className="mt-1 text-sm text-brand-ink/70">הזינו סיסמה כדי להמשיך</p>
        <label className="mt-6 block">
          <span className="mb-1 block text-sm font-semibold text-brand-primary">סיסמה</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            dir="ltr"
            className="w-full rounded-lg border border-brand-primary/20 px-3 py-2.5 focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/30"
          />
        </label>
        {error ? (
          <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={submitting || !password}
          className="mt-5 w-full rounded-lg bg-brand-primary px-4 py-2.5 font-bold text-white transition hover:brightness-110 disabled:opacity-50"
        >
          {submitting ? "מתחבר..." : "כניסה"}
        </button>
      </form>
    </main>
  );
}
