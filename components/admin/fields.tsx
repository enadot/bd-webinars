"use client";

import { Switch } from "@base-ui/react/switch";

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  dir,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-primary">{label}</span>
      <input
        type={type}
        value={value}
        dir={dir}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/30"
      />
      {hint ? <span className="mt-1 block text-xs text-brand-ink/60">{hint}</span> : null}
    </label>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-primary">{label}</span>
      <input
        type="number"
        value={value}
        min={0}
        dir="ltr"
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/30"
      />
      {hint ? <span className="mt-1 block text-xs text-brand-ink/60">{hint}</span> : null}
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-primary">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/30"
      />
    </label>
  );
}

export function SwitchField({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-lg border border-brand-primary/10 bg-white px-3 py-2.5">
      <span>
        <span className="block text-sm font-semibold text-brand-primary">{label}</span>
        {hint ? <span className="block text-xs text-brand-ink/60">{hint}</span> : null}
      </span>
      <Switch.Root
        checked={checked}
        onCheckedChange={onChange}
        className="flex h-6 w-11 shrink-0 rounded-full bg-brand-ink/25 p-0.5 transition-colors data-[checked]:bg-brand-accent"
      >
        {/* RTL: thumb starts at the inline-start (right); checked slides it 20px left */}
        <Switch.Thumb className="h-5 w-5 rounded-full bg-white shadow transition-transform data-[checked]:-translate-x-5" />
      </Switch.Root>
    </label>
  );
}

export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold text-brand-primary">{label}</span>
      <span className="flex items-center gap-2">
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-brand-primary/20 bg-white p-0.5"
          aria-label={`בחירת צבע — ${label}`}
        />
        <input
          type="text"
          value={value}
          dir="ltr"
          onChange={(e) => onChange(e.target.value)}
          className="w-28 rounded-lg border border-brand-primary/20 bg-white px-3 py-2 text-sm focus:border-brand-accent focus:outline focus:outline-2 focus:outline-brand-accent/30"
        />
      </span>
    </label>
  );
}
