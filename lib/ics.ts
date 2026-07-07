import { WEBINAR_ID, type WebinarConfig } from "./config";

// Format a Date as ICS local time in a fixed IANA zone (YYYYMMDDTHHMMSS).
function formatLocal(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  const hour = get("hour") === "24" ? "00" : get("hour");
  return `${get("year")}${get("month")}${get("day")}T${hour}${get("minute")}${get("second")}`;
}

function formatUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// RFC 5545: fold content lines longer than 75 octets.
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  for (const char of line) {
    const prefix = out.length === 0 ? 0 : 1; // continuation lines start with a space
    if (encoder.encode(current + char).length + prefix > 75) {
      out.push(out.length === 0 ? current : " " + current);
      current = char;
    } else {
      current += char;
    }
  }
  if (current) out.push(out.length === 0 ? current : " " + current);
  return out.join("\r\n");
}

const TZ = "Asia/Jerusalem";

export function buildIcs(config: WebinarConfig): string {
  const start = new Date(config.general.eventDateIso);
  const description = [
    config.general.subtitle,
    config.general.zoomLink ? `קישור לזום: ${config.general.zoomLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//bd-webinars//million-webinar//HE",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${WEBINAR_ID}@bd-webinars`,
    `DTSTAMP:${formatUtc(new Date())}`,
    `DTSTART;TZID=${TZ}:${formatLocal(start, TZ)}`,
    `DURATION:PT${config.general.durationMinutes}M`,
    `SUMMARY:${escapeText(config.general.title)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(config.general.zoomLink || config.general.location)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(foldLine).join("\r\n") + "\r\n";
}

export function buildGoogleCalendarUrl(config: WebinarConfig): string {
  const start = new Date(config.general.eventDateIso);
  const end = new Date(start.getTime() + config.general.durationMinutes * 60_000);
  const details = [
    config.general.subtitle,
    config.general.zoomLink ? `קישור לזום: ${config.general.zoomLink}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: config.general.title,
    dates: `${formatUtc(start)}/${formatUtc(end)}`,
    details,
    location: config.general.zoomLink || config.general.location,
    ctz: TZ,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
