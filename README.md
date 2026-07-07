# וובינר המיליון — עמוד נחיתה + פאנל ניהול

עמוד נחיתה RTL בעברית להרשמה לוובינר, בנוי כמותג פיננסי פרימיום, כולל פאנל ניהול מוגן סיסמה, שליחת לידים ל-Webhook, עמוד תודה עם ספירה לאחור והוספה ליומן.

## Stack

- **Next.js** (App Router, TypeScript) + **Tailwind CSS 4**
- **Base UI** (`@base-ui/react`) — קומפוננטות headless נגישות (Accordion, Tabs, Field, Form, Switch) בעיצוב Tailwind
- **Upstash Redis** — שמירת הגדרות ולידים (עם fallback לזיכרון בפיתוח)
- פונט **Heebo** דרך `next/font`

## הרצה מקומית

```bash
npm install
cp .env.example .env.local   # ולמלא לפחות ADMIN_PASSWORD
npm run dev
```

- `/` — עמוד הנחיתה
- `/admin` — פאנל ניהול (דורש `ADMIN_PASSWORD`)
- `/thank-you` — עמוד תודה
- `/api/calendar` — קובץ ICS של האירוע

ללא משתני Upstash האתר עובד במצב זיכרון: עריכות בפאנל ולידים נשמרים רק לאורך חיי התהליך. בפרודקשן (Vercel) חובה להגדיר את שני משתני ה-Redis כדי שהגדרות ולידים יישמרו.

## משתני סביבה

| משתנה | חובה | תיאור |
| --- | --- | --- |
| `ADMIN_PASSWORD` | כן (לפאנל) | סיסמת הכניסה ל-`/admin` |
| `SESSION_SECRET` | לא | חתימת עוגיית ההתחברות (ברירת מחדל: נגזר מהסיסמה) |
| `UPSTASH_REDIS_REST_URL` | לפרודקשן | כתובת REST של Upstash Redis |
| `UPSTASH_REDIS_REST_TOKEN` | לפרודקשן | טוקן REST של Upstash Redis |

## פאנל הניהול

טאבים: **כללי** (כותרות, מרצה, תאריך, Zoom, מגבלת נרשמים, טקסטי כפתורים) · **טופס ו-Webhook** (תוויות, כתובת Webhook, כותרות API, כפתור בדיקה עם תצוגת תשובה, Redirect, Double Opt-In) · **מעקב** (Facebook Pixel, GTM, GA4, LinkedIn, TikTok, Clarity, Hotjar — נטען רק כשמולא) · **עמוד תודה** · **עיצוב** (צבעים, לוגו, הצגת אזורים) · **נרשמים** (טבלה, סטטוס Webhook, ייצוא CSV עם BOM לעברית באקסל).

## Webhook

כל הרשמה נשלחת כ-POST JSON הכולל: `full_name`, `phone`, `email`, `webinar_id`, `registration_time`, `page_url`, `referrer`, `landing_page`, `ip`, `user_agent`, כל פרמטרי ה-UTM, `gclid`/`fbclid`/`msclkid`/`ttclid`, `double_opt_in` ו-`webhook_delivered`. כשל בשליחה **לא** מפיל את ההרשמה — הליד נשמר עם סטטוס מסירה ומיוצא ב-CSV.

## פריסה ל-Vercel

1. חיבור הריפו לפרויקט Vercel.
2. הגדרת `ADMIN_PASSWORD`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
3. Deploy. שמירת הגדרות בפאנל מרעננת את העמוד מיידית (`revalidateTag`).
