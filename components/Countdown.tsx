"use client";

import { useEffect, useState } from "react";

function diffParts(target: number) {
  const total = Math.max(0, target - Date.now());
  return {
    total,
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total % 86_400_000) / 3_600_000),
    minutes: Math.floor((total % 3_600_000) / 60_000),
    seconds: Math.floor((total % 60_000) / 1000),
  };
}

export default function Countdown({
  targetIso,
  zoomLink,
}: {
  targetIso: string;
  zoomLink: string;
}) {
  const target = new Date(targetIso).getTime();
  // Render placeholders on the server; fill after mount to avoid hydration mismatch.
  const [parts, setParts] = useState<ReturnType<typeof diffParts> | null>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    setParts(diffParts(target));
    const interval = setInterval(() => setParts(diffParts(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  if (Number.isNaN(target)) return null;

  if (parts && parts.total === 0) {
    return (
      <div className="rounded-2xl border border-brand-accent/40 bg-white p-6 text-center">
        <p className="text-xl font-bold text-brand-primary">הוובינר התחיל!</p>
        {zoomLink ? (
          <a
            href={zoomLink}
            className="mt-4 inline-block rounded-xl bg-brand-accent px-8 py-3 font-bold text-brand-deep hover:brightness-110"
          >
            הצטרפו עכשיו בזום
          </a>
        ) : null}
      </div>
    );
  }

  const units = [
    { value: parts?.days, label: "ימים" },
    { value: parts?.hours, label: "שעות" },
    { value: parts?.minutes, label: "דקות" },
    { value: parts?.seconds, label: "שניות" },
  ];

  return (
    <div className="flex justify-center gap-3" role="timer" aria-label="ספירה לאחור לוובינר">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="w-20 rounded-2xl bg-gradient-to-bl from-brand-secondary to-brand-deep py-4 text-center text-white"
        >
          <p className="text-3xl font-extrabold tabular-nums" dir="ltr">
            {unit.value === undefined ? "--" : String(unit.value).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs font-medium text-brand-accent">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}
