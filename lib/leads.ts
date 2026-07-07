import { z } from "zod";

export interface Lead {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  webinar_id: string;
  registration_time: string;
  page_url: string;
  referrer: string;
  landing_page: string;
  ip: string;
  user_agent: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  ttclid?: string;
  double_opt_in: boolean;
  webhook_delivered: boolean;
  webhook_status?: number;
}

/** Normalize an Israeli phone number to local 0-prefixed digits. */
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[\s\-().]/g, "");
  if (digits.startsWith("+972")) digits = "0" + digits.slice(4);
  else if (digits.startsWith("972")) digits = "0" + digits.slice(3);
  return digits;
}

/** Israeli mobile (05X-XXXXXXX) or landline (0X-XXXXXXX / 07X-XXXXXXX). */
export function isValidIsraeliPhone(normalized: string): boolean {
  return /^0(?:5\d{8}|7\d{8}|[23489]\d{7})$/.test(normalized);
}

const trackingFields = {
  utm_source: z.string().max(500).optional(),
  utm_medium: z.string().max(500).optional(),
  utm_campaign: z.string().max(500).optional(),
  utm_content: z.string().max(500).optional(),
  utm_term: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
  fbclid: z.string().max(500).optional(),
  msclkid: z.string().max(500).optional(),
  ttclid: z.string().max(500).optional(),
  referrer: z.string().max(2000).optional(),
  landing_page: z.string().max(2000).optional(),
  page_url: z.string().max(2000).optional(),
};

export const registrationSchema = z.object({
  full_name: z
    .string({ required_error: "נא למלא שם מלא" })
    .trim()
    .min(2, "נא למלא שם מלא")
    .max(120, "השם ארוך מדי"),
  phone: z
    .string({ required_error: "נא למלא מספר טלפון" })
    .trim()
    .transform(normalizePhone)
    .refine(isValidIsraeliPhone, "נא למלא מספר טלפון ישראלי תקין"),
  email: z
    .string({ required_error: "נא למלא כתובת אימייל" })
    .trim()
    .toLowerCase()
    .email("נא למלא כתובת אימייל תקינה")
    .max(254, "כתובת האימייל ארוכה מדי"),
  ...trackingFields,
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
