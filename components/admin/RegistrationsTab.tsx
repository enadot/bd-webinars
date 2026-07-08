"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/leads";

interface RegistrationsData {
  leads: Lead[];
  count: number;
  limit: number;
}

export default function RegistrationsTab() {
  const [data, setData] = useState<RegistrationsData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then(setData)
      .catch(() => setError("שגיאה בטעינת הנרשמים"));
  }, []);

  if (error) {
    return <p className="rounded-xl bg-red-50 px-4 py-3 font-medium text-red-700">{error}</p>;
  }
  if (!data) {
    return <p className="text-brand-ink/60">טוען נרשמים...</p>;
  }

  const failedWebhooks = data.leads.filter((l) => !l.webhook_delivered).length;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6">
          <p>
            <span className="text-2xl font-extrabold text-brand-primary">{data.count}</span>{" "}
            <span className="text-sm text-brand-ink/70">
              נרשמים{data.limit > 0 ? ` מתוך ${data.limit}` : ""}
            </span>
          </p>
          {failedWebhooks > 0 ? (
            <p className="self-center rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
              {failedWebhooks} לא נמסרו ל-Webhook
            </p>
          ) : null}
        </div>
        <a
          href="/api/admin/registrations?format=csv"
          className="rounded-lg bg-brand-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110"
        >
          ייצוא CSV
        </a>
      </div>

      {data.leads.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-primary/20 px-5 py-10 text-center text-brand-ink/60">
          עדיין אין נרשמים
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-brand-primary/10 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-brand-primary/10 bg-brand-paper text-start">
                <th className="px-4 py-3 text-start font-bold text-brand-primary">שם</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">טלפון</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">אימייל</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">מועד</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">מקור</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">מייל</th>
                <th className="px-4 py-3 text-start font-bold text-brand-primary">Webhook</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <tr key={lead.id} className="border-b border-brand-primary/5 last:border-0">
                  <td className="px-4 py-2.5 font-semibold">{lead.full_name}</td>
                  <td className="px-4 py-2.5" dir="ltr">{lead.phone}</td>
                  <td className="px-4 py-2.5" dir="ltr">{lead.email}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap" dir="ltr">
                    {new Date(lead.registration_time).toLocaleString("he-IL", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </td>
                  <td className="px-4 py-2.5">{lead.utm_source || "—"}</td>
                  <td className="px-4 py-2.5">
                    {lead.email_sent ? (
                      <span className="font-semibold text-emerald-700">נשלח</span>
                    ) : (
                      <span className="text-brand-ink/50">—</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {lead.webhook_delivered ? (
                      <span className="font-semibold text-emerald-700">נמסר</span>
                    ) : (
                      <span className="font-semibold text-amber-700">לא נמסר</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
