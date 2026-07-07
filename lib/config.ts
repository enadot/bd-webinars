import { z } from "zod";

export const SECTION_KEYS = [
  "pain",
  "solution",
  "about",
  "learn",
  "details",
  "socialProof",
  "faq",
  "finalCta",
] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];

const headerSchema = z.object({ key: z.string(), value: z.string() });

export const webinarConfigSchema = z.object({
  general: z.object({
    title: z.string().min(1),
    subtitle: z.string(),
    speakerName: z.string(),
    speakerTitle: z.string(),
    speakerBio: z.string(),
    heroImageUrl: z.string(),
    eventDateHebrew: z.string(),
    eventDateIso: z.string(),
    eventTimeDisplay: z.string(),
    durationMinutes: z.number().int().positive(),
    durationDisplay: z.string(),
    location: z.string(),
    zoomLink: z.string(),
    registrationLimit: z.number().int().min(0),
    ctaPrimary: z.string(),
    ctaForm: z.string(),
    ctaFinal: z.string(),
  }),
  form: z.object({
    labels: z.object({
      fullName: z.string(),
      phone: z.string(),
      email: z.string(),
    }),
    webhookUrl: z.string(),
    webhookHeaders: z.array(headerSchema),
    successRedirect: z.string(),
    errorRedirect: z.string(),
    doubleOptIn: z.boolean(),
    microcopy: z.array(z.string()),
  }),
  tracking: z.object({
    facebookPixelId: z.string(),
    gtmId: z.string(),
    ga4Id: z.string(),
    linkedinPartnerId: z.string(),
    tiktokPixelId: z.string(),
    clarityId: z.string(),
    hotjarId: z.string(),
  }),
  thankYou: z.object({
    headline: z.string(),
    body: z.string(),
    showCountdown: z.boolean(),
    whatsappGroupUrl: z.string(),
    showCalendarButtons: z.boolean(),
  }),
  design: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    accentColor: z.string(),
    logoUrl: z.string(),
    sections: z.object({
      pain: z.boolean(),
      solution: z.boolean(),
      about: z.boolean(),
      learn: z.boolean(),
      details: z.boolean(),
      socialProof: z.boolean(),
      faq: z.boolean(),
      finalCta: z.boolean(),
    }),
  }),
  content: z.object({
    painTitle: z.string(),
    painCards: z.array(z.object({ title: z.string(), text: z.string() })),
    solutionTitle: z.string(),
    solutionIntro: z.string(),
    solutionSteps: z.array(z.string()),
    aboutTitle: z.string(),
    trustIndicators: z.array(z.string()),
    learnTitle: z.string(),
    learnItems: z.array(z.string()),
    detailsTitle: z.string(),
    socialProofTitle: z.string(),
    testimonials: z.array(z.object({ name: z.string(), text: z.string() })),
    stats: z.array(z.object({ value: z.string(), label: z.string() })),
    faqTitle: z.string(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })),
    finalCtaHeadline: z.string(),
  }),
});

export type WebinarConfig = z.infer<typeof webinarConfigSchema>;

export const WEBINAR_ID = "million-webinar";

export const DEFAULT_CONFIG: WebinarConfig = {
  general: {
    title: "וובינר המיליון",
    subtitle: "חולמים על דירה להשקעה לנישואי הילדים והבנק מסרב?",
    speakerName: "משה אדרי",
    speakerTitle: "מומחה למימון ואשראי",
    speakerBio:
      "משה אדרי מלווה משפחות ובעלי עסקים בישראל בדרך לאישור מימון — גם אחרי סירובים חוזרים מהבנקים. בשיטה סדורה של שיפור פרופיל האשראי, בניית אסטרטגיית מימון ועבודה נכונה מול הגופים הפיננסיים, מאות לקוחות הגיעו מדחייה אחר דחייה ועד לדירה להשקעה.",
    heroImageUrl: "/speaker-placeholder.svg",
    eventDateHebrew: 'שלישי, כ"ט בתמוז · 14.7.26',
    eventDateIso: "2026-07-14T21:00:00+03:00",
    eventTimeDisplay: "21:00",
    durationMinutes: 90,
    durationDisplay: "כשעה וחצי",
    location: "Live בזום",
    zoomLink: "",
    registrationLimit: 0,
    ctaPrimary: "הרשמה ללא עלות",
    ctaForm: "שריינו מקום עכשיו",
    ctaFinal: "אני רוצה להירשם",
  },
  form: {
    labels: {
      fullName: "שם מלא",
      phone: "טלפון נייד",
      email: "אימייל",
    },
    webhookUrl: "",
    webhookHeaders: [],
    successRedirect: "/thank-you",
    errorRedirect: "",
    doubleOptIn: false,
    microcopy: [
      "ההשתתפות ללא עלות",
      "מספר המקומות מוגבל",
      "הקישור יישלח מיד לאחר ההרשמה",
    ],
  },
  tracking: {
    facebookPixelId: "",
    gtmId: "",
    ga4Id: "",
    linkedinPartnerId: "",
    tiktokPixelId: "",
    clarityId: "",
    hotjarId: "",
  },
  thankYou: {
    headline: "נרשמתם בהצלחה!",
    body: "פרטי ההתחברות לוובינר נשלחו אליכם למייל. מומלץ להוסיף את האירוע ליומן כדי לא לפספס.",
    showCountdown: true,
    whatsappGroupUrl: "",
    showCalendarButtons: true,
  },
  design: {
    primaryColor: "#0B3B66",
    secondaryColor: "#123C69",
    accentColor: "#D4AF37",
    logoUrl: "",
    sections: {
      pain: true,
      solution: true,
      about: true,
      learn: true,
      details: true,
      socialProof: true,
      faq: true,
      finalCta: true,
    },
  },
  content: {
    painTitle: "מכירים את זה?",
    painCards: [
      {
        title: "הבנק סירב למשכנתא?",
        text: "הגשתם בקשה, חיכיתם — וקיבלתם עוד סירוב בלי הסבר אמיתי.",
      },
      {
        title: 'דו"ח אשראי אדום?',
        text: "דירוג אשראי נמוך סוגר דלתות עוד לפני שמתחילים לדבר.",
      },
      {
        title: "חברות המימון מסרבות?",
        text: "גם הגופים החוץ-בנקאיים אומרים לא — ואתם לא מבינים למה.",
      },
      {
        title: "רוצים דירה לילדים ולא יודעים איך?",
        text: "החלום קיים, הכסף לא מספיק, והדרך נראית חסומה.",
      },
    ],
    solutionTitle: "שיטת החמישייה",
    solutionIntro:
      "מסלול סדור בחמישה שלבים שהופך סירוב לתוכנית פעולה — עד דירה להשקעה.",
    solutionSteps: [
      "סירוב מהבנק",
      "שיפור פרופיל האשראי",
      "אסטרטגיית מימון",
      "אישור בנקאי",
      "דירה להשקעה",
    ],
    aboutTitle: "מי מעביר את הוובינר?",
    trustIndicators: [
      "ניסיון של שנים בליווי מול בנקים וגופי מימון",
      "מאות משפחות ובעלי עסקים בליווי אישי",
      "שיטה סדורה ומוכחת — לא הבטחות באוויר",
    ],
    learnTitle: "מה תלמדו בוובינר?",
    learnItems: [
      "איך הבנקים באמת חושבים כשהם בוחנים בקשה",
      "למה מקבלים סירוב — הסיבות האמיתיות שלא מספרים לכם",
      "איך מגדילים משמעותית את סיכויי האישור",
      "עבודה נכונה מול גופי מימון חוץ-בנקאיים",
      "בניית מסלול מעשי לדירה להשקעה",
    ],
    detailsTitle: "פרטי הוובינר",
    socialProofTitle: "מה אומרים משתתפים",
    testimonials: [
      {
        name: "ישראל י.",
        text: "אחרי שלושה סירובים מהבנק הייתי בטוח שאין סיכוי. תוך חצי שנה קיבלנו אישור למשכנתא.",
      },
      {
        name: "מיכל ל.",
        text: "הגישה המקצועית והליווי הצמוד עשו את ההבדל. סוף סוף מישהו שמדבר בגובה העיניים.",
      },
      {
        name: "דוד כ.",
        text: "כבעל עסק, כל הדלתות היו סגורות. היום יש לנו מימון ותוכנית ברורה קדימה.",
      },
    ],
    stats: [
      { value: "+500", label: "משפחות בליווי" },
      { value: "+15", label: "שנות ניסיון" },
      { value: "92%", label: "שיפור בדירוג האשראי" },
    ],
    faqTitle: "שאלות נפוצות",
    faq: [
      {
        q: "האם ההשתתפות בחינם?",
        a: "כן. ההשתתפות בוובינר ללא עלות וללא התחייבות. כל מה שצריך זה להירשם ולהתחבר בזמן.",
      },
      {
        q: "האם תהיה הקלטה?",
        a: "הוובינר משודר בשידור חי. הקלטה תישלח לנרשמים בהתאם להחלטת המארגנים — לכן מומלץ להגיע בזמן אמת.",
      },
      {
        q: "כמה זמן נמשך הוובינר?",
        a: "כשעה וחצי, כולל מענה על שאלות בשידור חי.",
      },
      {
        q: "למי הוובינר מתאים?",
        a: "לכל מי שקיבל סירוב ממשכנתא או הלוואה, למי שדירוג האשראי שלו נפגע, למשפחות שחולמות על דירה להשקעה ולבעלי עסקים שמחפשים מימון.",
      },
    ],
    finalCtaHeadline: "אל תתנו לעוד סירוב לעצור אתכם.",
  },
};

/** Deep-merge stored (possibly partial/stale) config over defaults. */
export function mergeConfig(stored: unknown): WebinarConfig {
  if (!stored || typeof stored !== "object") return DEFAULT_CONFIG;
  const merged = deepMerge(
    DEFAULT_CONFIG as unknown as Record<string, unknown>,
    stored as Record<string, unknown>
  );
  const parsed = webinarConfigSchema.safeParse(merged);
  return parsed.success ? parsed.data : DEFAULT_CONFIG;
}

function deepMerge(
  base: Record<string, unknown>,
  override: Record<string, unknown>
): Record<string, unknown> {
  const out: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = out[key];
    if (
      value &&
      baseValue &&
      typeof value === "object" &&
      typeof baseValue === "object" &&
      !Array.isArray(value) &&
      !Array.isArray(baseValue)
    ) {
      out[key] = deepMerge(
        baseValue as Record<string, unknown>,
        value as Record<string, unknown>
      );
    } else if (value !== undefined) {
      out[key] = value;
    }
  }
  return out;
}
