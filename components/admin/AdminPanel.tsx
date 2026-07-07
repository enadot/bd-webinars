"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "@base-ui/react/tabs";
import type { WebinarConfig } from "@/lib/config";
import GeneralTab from "./GeneralTab";
import FormTab from "./FormTab";
import TrackingTab from "./TrackingTab";
import ThankYouTab from "./ThankYouTab";
import DesignTab from "./DesignTab";
import RegistrationsTab from "./RegistrationsTab";

const TABS = [
  { value: "general", label: "כללי" },
  { value: "form", label: "טופס ו-Webhook" },
  { value: "tracking", label: "מעקב ופיקסלים" },
  { value: "thankYou", label: "עמוד תודה" },
  { value: "design", label: "עיצוב" },
  { value: "registrations", label: "נרשמים" },
] as const;

export type UpdateConfig = (
  updater: (config: WebinarConfig) => WebinarConfig
) => void;

export default function AdminPanel() {
  const router = useRouter();
  const [config, setConfig] = useState<WebinarConfig | null>(null);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/config")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      })
      .then(setConfig)
      .catch(() => setLoadError("שגיאה בטעינת ההגדרות. רעננו את העמוד."));
  }, []);

  const update = useCallback<UpdateConfig>((updater) => {
    setConfig((prev) => (prev ? updater(prev) : prev));
    setDirty(true);
    setSaveMessage(null);
  }, []);

  async function save() {
    if (!config) return;
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (res.ok) {
        setDirty(false);
        setSaveMessage({ ok: true, text: "ההגדרות נשמרו — עמוד הנחיתה עודכן" });
      } else {
        const data = await res.json().catch(() => ({}));
        setSaveMessage({ ok: false, text: data.error || "שגיאה בשמירה" });
      }
    } catch {
      setSaveMessage({ ok: false, text: "שגיאת תקשורת בשמירה" });
    } finally {
      setSaving(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-paper px-5">
        <p className="rounded-xl bg-red-50 px-5 py-4 font-medium text-red-700">{loadError}</p>
      </main>
    );
  }

  if (!config) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-brand-paper">
        <p className="text-brand-ink/60">טוען הגדרות...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brand-paper pb-24">
      <header className="sticky top-0 z-10 border-b border-brand-primary/10 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
          <div>
            <h1 className="text-lg font-bold text-brand-primary">פאנל ניהול הוובינר</h1>
            <p className="text-xs text-brand-ink/60">{config.general.title}</p>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="rounded-lg border border-brand-primary/20 px-3 py-2 text-sm font-semibold text-brand-primary hover:bg-brand-paper"
            >
              צפייה בעמוד
            </a>
            <button
              onClick={logout}
              className="rounded-lg border border-brand-primary/20 px-3 py-2 text-sm font-semibold text-brand-ink/70 hover:bg-brand-paper"
            >
              התנתקות
            </button>
            <button
              onClick={save}
              disabled={saving || !dirty}
              className="rounded-lg bg-brand-primary px-5 py-2 text-sm font-bold text-white transition hover:brightness-110 disabled:opacity-40"
            >
              {saving ? "שומר..." : "שמירה"}
            </button>
          </div>
        </div>
        {saveMessage ? (
          <p
            role="status"
            className={`mx-auto max-w-5xl px-5 pb-2 text-sm font-medium ${saveMessage.ok ? "text-emerald-700" : "text-red-700"}`}
          >
            {saveMessage.text}
          </p>
        ) : null}
      </header>

      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Tabs.Root defaultValue="general">
          <Tabs.List className="flex flex-wrap gap-1 rounded-xl bg-brand-primary/5 p-1">
            {TABS.map((tab) => (
              <Tabs.Tab
                key={tab.value}
                value={tab.value}
                className="rounded-lg px-4 py-2 text-sm font-semibold text-brand-ink/70 transition data-[selected]:bg-white data-[selected]:text-brand-primary data-[selected]:shadow-sm"
              >
                {tab.label}
              </Tabs.Tab>
            ))}
          </Tabs.List>

          <Tabs.Panel value="general" className="pt-6">
            <GeneralTab config={config} update={update} />
          </Tabs.Panel>
          <Tabs.Panel value="form" className="pt-6">
            <FormTab config={config} update={update} />
          </Tabs.Panel>
          <Tabs.Panel value="tracking" className="pt-6">
            <TrackingTab config={config} update={update} />
          </Tabs.Panel>
          <Tabs.Panel value="thankYou" className="pt-6">
            <ThankYouTab config={config} update={update} />
          </Tabs.Panel>
          <Tabs.Panel value="design" className="pt-6">
            <DesignTab config={config} update={update} />
          </Tabs.Panel>
          <Tabs.Panel value="registrations" className="pt-6">
            <RegistrationsTab />
          </Tabs.Panel>
        </Tabs.Root>
      </div>
    </main>
  );
}
