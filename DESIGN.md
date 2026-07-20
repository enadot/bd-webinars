# DESIGN.md — וובינר המיליון

מסמך זה מתעד את מערכת העיצוב של עמוד הנחיתה **כפי שהיא מיושמת בקוד כיום**. מקור האמת: `app/globals.css`, `app/layout.tsx` והקומפוננטות תחת `components/landing/`.

## 1. שפה עיצובית

השראה: **Wise** — משטחים בהירים ורגועים, טיפוגרפיה כבדה ככלי ההבעה המרכזי, ואקסנט ליים יחיד ובולט שמוקדש לפעולה (CTA). העמוד RTL מלא בעברית.

עקרונות:
- **אקסנט אחד** — הליים משמש כמעט רק לכפתורי הרשמה, לתגי אייקונים ולהדגשות טקסט (highlighter). לא צובעים בו רקעים שלמים.
- **קונטרסט משטחים במקום צללים** — כרטיסים לבנים (`canvas`) על קנבס ירקרק (`canvas-soft`); צל מופיע רק ב-hover עדין.
- **טיפוגרפיה עושה את העבודה** — כותרת ענק ב-display face, גוף רגוע ב-Heebo.
- **תנועה כתיבול** — אנימציות קצרות וחד-פעמיות, עם כיבוי מלא תחת `prefers-reduced-motion`.

## 2. צבעים

מוגדרים כ-`@theme` tokens ב-`app/globals.css` (Tailwind CSS 4). שלושה מהם נשלטים מפאנל הניהול (טאב "עיצוב") ומוזרקים כ-CSS vars ב-`layout.tsx`:

| Token | ערך ברירת מחדל | נשלט מהאדמין | שימוש |
| --- | --- | --- | --- |
| `canvas` | `#ffffff` | — | כרטיסים, נאב, שדות טופס |
| `canvas-soft` | `#e8ebe6` (sage) | ✔ `secondaryColor` | רקע העמוד |
| `primary` | `#9fe870` (lime) | ✔ `primaryColor` | CTA, תגי אייקונים, highlight |
| `primary-active` | `#cdffad` | — | hover של CTA |
| `primary-neutral` / `primary-pale` | `#c5edab` / `#e2f6d5` | — | רקעים משניים בגוון ליים |
| `ink` | `#0e0f0c` | ✔ `accentColor` | טקסט ראשי, פוטר כהה |
| `ink-deep` | `#163300` | — | טקסט על גבי ליים (ניגודיות) |
| `body` | `#454745` | — | טקסט גוף משני |
| `mute` | `#868685` | — | placeholder, טקסט עמום |
| `positive` / `warning` / `negative` | `#2ead4b` / `#ffd11a` / `#d03238` | — | סמנטיים (ולידציה, סטטוסים) |

**Aliases היסטוריים**: משפחת `brand-*` (למשל `brand-primary`, `brand-paper`, `brand-accent`) ממופה מחדש לטוקנים של Wise, כדי שקומפוננטות ותיקות (פאנל אדמין, עמוד תודה, סקשנים כבויים) יקבלו את הזהות החדשה בלי שכתוב. בקוד חדש — להשתמש בטוקנים הראשיים, לא ב-`brand-*`.

**כלל ניגודיות**: טקסט על ליים הוא תמיד `ink-deep`, לא לבן.

## 3. טיפוגרפיה

שלושה קולות, נטענים ב-`app/layout.tsx`:

| קול | Utility | פונט | שימוש |
| --- | --- | --- | --- |
| Display | `font-display` | **Tel Aviv Brutalist** Bold (לוקאלי, woff2) | כותרת ה-Hero, ה"פאנץ'" בתת-כותרת |
| Heading | `font-heading` | **Tel Aviv Modernist** Bold (לוקאלי, woff2) | כותרות סקשנים, תת-כותרת, תוויות פרטי אירוע |
| Body | `font-sans` (ברירת מחדל על `body`) | **Google Sans** (לטינית) ← **Heebo** (עברית, next/font) | כל טקסט הגוף, טפסים, אדמין |

סקאלת כותרות בפועל:
- Hero H1: `text-[2.6rem]` → `sm:text-7xl` → `lg:text-[7rem]`, `leading-none tracking-tight`
- כותרת סקשן (H2): `text-4xl` → `sm:text-5xl` → `lg:text-6xl` (דרך `SectionHeading`)
- תת-כותרת Hero: `text-2xl` → `sm:text-3xl`, `font-heading`

## 4. צורה ומרווחים

- **רדיוס מותג**: `24px` (`--radius-brand`). כרטיסים, תגיות פרטי אירוע ותמונות משתמשים ב-`rounded-[24px]`; כפתורי CTA הם pill מלא; שדות טופס `rounded-xl`.
- **רוחב תוכן**: `max-w-5xl` לעמוד, `max-w-2xl`–`max-w-3xl` לבלוקים טקסטואליים.
- **Padding אופקי**: `px-5` במובייל, `sm:px-8`.
- **כרטיס מרחף**: מחלקת `.premium-card` — הרמה של 3px- וצל רך ב-hover בלבד.

## 5. תנועה ואנימציה

כולן CSS בלבד, ללא ספריות:

| אפקט | מחלקה | התנהגות |
| --- | --- | --- |
| חשיפת גלילה | `.reveal` / `.is-visible` (דרך `Reveal.tsx`, IntersectionObserver) | fade + עלייה 16px, תמיכה ב-`--reveal-delay` |
| כותרת Hero | `.char-reveal` (`HeroTitle.tsx`) | הופעה אות-אות (blur+rotate), stagger של 55ms, שבירת שורות רק בין מילים; SSR מרנדר טקסט מלא ל-SEO |
| Highlighter | `.subtitle-highlight` | מריחת ליים מאחורי "דירה להשקעה" (RTL: מימין), אחרי 1s |
| Squiggle | `.subtitle-punch .squiggle` | קו גלי שמצייר את עצמו מתחת ל"והבנק מסרב?" אחרי 1.7s |
| פרטי אירוע | `.anim-bob` (לוח שנה), `.anim-tick` (שעון), `.anim-live` (שידור חי — פעימה + גלים) | לולאות אינסופיות עדינות על תגי האייקונים |

**נגישות**: תחת `@media (prefers-reduced-motion: reduce)` כל האנימציות מנוטרלות והתוכן מוצג במצבו הסופי.

הערה: `HeroSubtitle` מזהה את הביטויים המודגשים לפי מחרוזות קבועות בקוד; אם עורכים את הקופי באדמין — האפקטים נופלים אוטומטית לטקסט רגיל.

## 6. מבנה העמוד

`app/page.tsx` — סדר הסקשנים, כל אחד ניתן לכיבוי מהאדמין (`design.sections`):

1. **נאב דביק** — לוגו + כפתור CTA, רקע `canvas/90` עם blur
2. **Hero** (תמיד מוצג) — כותרת + תת-כותרת ממורכזות, שלוש תגיות פרטי אירוע מונפשות, ואז grid: תמונת מרצה מול כרטיס טופס הרשמה
3. `pain` — כרטיסי כאב *(כבוי כברירת מחדל)*
4. `solution` — שיטת החמישייה *(כבוי)*
5. `about` — על המרצה *(כבוי)*
6. `learn` — מה תלמדו ✔
7. `details` — פרטי הוובינר *(כבוי)*
8. `socialProof` — המלצות וסטטיסטיקות ✔
9. `faq` — שאלות נפוצות (accordion של `details`) ✔
10. `finalCta` — קריאה אחרונה ✔
11. **פוטר** — רקע `ink`, טקסט זכויות

ברירת המחדל היא **עמוד ממוקד**: הסקשנים הכבדים כבויים והמסלול הקצר ביותר הוא Hero → טופס.

## 7. קומפוננטות וטפסים

- **Base UI** (`@base-ui/react`) — קומפוננטות headless נגישות: Form, Field (טופס הרשמה), Accordion, Tabs, Switch (אדמין).
- **שדה קלט** (סגנון אחיד ב-`RegistrationForm`): רקע `canvas`, מסגרת `ink/25`, פוקוס עם outline `primary/50`, מצב שגיאה `data-[invalid]` במסגרת `negative`.
- **כפתור CTA**: pill ליים, טקסט `ink-deep` מודגש, hover ל-`primary-active`.
- **אייקונים**: SVG ידניים inline (stroke, `currentColor`) — אין ספריית אייקונים.

## 8. שליטה מהאדמין

טאב "עיצוב" בפאנל (`/admin`) שולט על:
- שלושת צבעי המותג (primary / secondary / accent) — מוזרקים כ-`--brand-primary`, `--brand-canvas-soft`, `--brand-ink`
- כתובת לוגו
- הצגה/הסתרה של כל סקשן

שינויים נשמרים ב-Redis ומתרעננים מיידית (`revalidateTag`).

## 9. עשה ואל תעשה

- ✔ טקסט על ליים = `ink-deep`
- ✔ קוד חדש משתמש בטוקנים הראשיים (`primary`, `ink`, `canvas-soft`), לא ב-`brand-*`
- ✔ כל אנימציה חדשה חייבת כיבוי תחת `prefers-reduced-motion`
- ✔ רדיוס כרטיסים 24px, כפתורים pill
- ✘ לא לצבוע רקעי סקשנים שלמים בליים
- ✘ לא להוסיף צללים קבועים לכרטיסים (רק hover עדין)
- ✘ לא להכניס ספריות אנימציה/אייקונים — הכל CSS ו-SVG ידני
