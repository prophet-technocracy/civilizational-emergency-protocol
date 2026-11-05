import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildPrinciples } from "../../apps/api/src/data/principles.mjs";

const p = buildPrinciples();
const fa = (row) => row.title.fa;
const covered = p.principles.filter((row) => row.coverage === "covered");
const gaps = p.principles.filter((row) => row.coverage === "gap");

const chapterTable = [
  "| فصل | اصول | پوشش کامل | پوشش جزئی | جای خالی | بیرون از دامنه |",
  "|---|---|---|---|---|---|",
  ...p.chapters.map((c) =>
    `| ${c.title.fa} | ${c.principles.length} | ${c.counts.covered} | ${c.counts.partial} | ${c.counts.gap} | ${c.counts.outside} |`
  ),
  `| **جمع** | **${p.summary.total}** | **${p.summary.counts.covered}** | **${p.summary.counts.partial}** | **${p.summary.counts.gap}** | **${p.summary.counts.outside}** |`
].join("\n");

const coveredList = covered
  .map((row) => `- **اصل ${row.label.fa} — ${fa(row)}** → \`#/${row.surface?.route ?? ""}\` · ${row.note.fa}`)
  .join("\n");

const gapList = gaps
  .map((row) => `- **اصل ${row.label.fa} — ${fa(row)}** → پیشنهاد: ${row.surface ? "`#/" + row.surface.route + "`" : "بدون سطح"} · ${row.note.fa}`)
  .join("\n");

const doc = `# پوشش اصول سند مادر در نمونهٔ CEP

این سند پاسخ یک پرسش است: **از اصول پیش‌نویس «فن‌سالاری اصلاح‌شده» (${p.motherFile.pages} صفحه، ${p.motherFile.chapters} فصل، ${p.motherFile.principles} اصل)، این نمونهٔ نرم‌افزاری چه چیزی را نشان می‌دهد و چه چیزی را هرگز نمی‌تواند نشان دهد؟**

نسخهٔ زنده و قابل صافی همین جدول روی مسیر \`#/principles\` است و دادهٔ آن از یک جا می‌آید: \`apps/api/src/data/principles.mjs\` (سرویس \`GET /api/v1/principles\`). هیچ عددی در این سند دستی نوشته نشده؛ همه از همان داده تولید می‌شود و تست‌ها جمع‌ها را بررسی می‌کنند.

## ۱. این سند چه چیزی را نمی‌سنجد

سند مادر یک **پیش‌نویس میثاق ملی** است: هیچ رأی، نصاب یا تصویبی برای آن ثبت نشده. این جدول «انطباق حقوقی» نمی‌سنجد و نمی‌گوید نمونه اصل را اجرا می‌کند. آنچه سنجیده می‌شود پوشش یک نمونهٔ نرم‌افزاری با دادهٔ ساختگی است. شماره‌گذاری اصول همان شماره‌گذاری سند است (اصل ۰٫۱ تا ۰٫۱۳ و اصل ۱ تا ۱۰۰).

## ۲. معیار چهار وضعیت

${p.statuses.map((s) => `- **${s.label.fa}** — ${s.note.fa}`).join("\n")}

قاعدهٔ سخت: هیچ اصلی بدون یک سطح کارکننده یا یک ردیف دادهٔ موجود «پوشش کامل» نمی‌گیرد، و هر اصلِ «بیرون از دامنه» باید بگوید چرا. تست‌های API همین دو قاعده را بررسی می‌کنند.

## ۳. جمع‌بندی

${chapterTable}

از ${p.summary.total} اصل سند مادر: **${p.summary.counts.covered}** اصل با یک سطح کارکننده، **${p.summary.counts.partial}** اصل در داده یا طراحی، **${p.summary.counts.gap}** اصل که نرم‌افزار می‌تواند و هنوز نمی‌کند، و **${p.summary.counts.outside}** اصل که اجرایشان به قانون، دادگاه، نیرو یا بودجه نیاز دارد.

## ۴. آنچه واقعاً کار می‌کند (${p.summary.counts.covered} اصل)

${coveredList}

## ۵. جای خالی‌ها: کار بعدی (${p.summary.counts.gap} اصل)

این‌ها ادعا نیستند؛ فهرست کارند. هر ردیف می‌گوید کدام سطح می‌تواند آن را بگیرد.

${gapList}

## ۶. آنچه هیچ رابطی نمی‌تواند انجام دهد (${p.summary.counts.beyondSoftware} اصل)

دادگاه، پلیس، نیروهای مسلح، دیپلماسی، بیمه، درمان، کشاورزی، پسماند، پایش هوا و زیرساخت شهری بیرون از دامنهٔ یک رابط‌اند. نمونه در این موارد تنها می‌تواند ارجاع دهد و بگوید که ارجاع است — نه اینکه کاری انجام شده. این محدودیت در خود صفحه، در کارت «این صفحه انطباق حقوقی نمی‌سنجد»، به خواننده گفته می‌شود.

## ۷. چند نکته که از این جدول بیرون می‌آید

- **قوی‌ترین پوشش، در همان جایی است که نمونه یک سازوکار دارد، نه یک متن:** سطوح شهروندی (اصل ۲)، تضمین دسترسی و حریم خصوصی (اصل ۹ و ۱۹)، بایگانی و حافظهٔ جمعی (اصل ۰٫۱۳ و ۴۳)، میراث دیجیتال (اصل ۲۰)، و بانک HMMT (اصل ۳۱، ۳۲ و ۰٫۸).
- **بیشترین فاصله در فصل هفتم و هشتم است:** سلامت، رفاه، بیمه، بازنشستگی، آب، پسماند و هوا. اینها فصل‌هایی هستند که بدون بودجه و نهاد واقعی، هر نمایشی ادعا می‌شود.
- **اصل‌های «حق خروج» و «دسترسی» در طراحی جدی گرفته شده‌اند:** بازخرید بدون سقف سطح (اصل ۹۶)، دسترسی‌پذیری اندازه‌گیری‌شده (اصل ۶۵)، و امتناع از رتبه‌بندی انسان (اصل ۴۸ و منشور P-02).
- **سه اصل بدون هیچ سطح نرم‌افزاری می‌مانند و باید بمانند** تا زمانی که نهادی واقعی پشتشان باشد: نیروی صیانت (۲۷)، پلیس هوشمند (۸۶) و دادرسی کیفری (۸۴).

## ۸. بازتولید

\`\`\`sh
npm test                                    # تست‌های پوشش، جمع‌ها و سطح‌های موجود
curl -s localhost:3003/api/v1/principles | jq '.data.summary'
\`\`\`

مسیر خواندن: \`docs/economics/HMMT-DESIGN.md\` برای اصل ۳۱، \`docs/localization/PERSIAN-GLOSSARY.md\` برای اصل ۴، و \`README.md\` برای فهرست سطح‌ها.
`;

// Persian numerals in prose, Latin ones inside code so commands stay copyable.
const FA = ["۰","۱","۲","۳","۴","۵","۶","۷","۸","۹"];
function toPersianOutsideCode(text) {
  let out = "";
  let fenced = false;
  for (const line of text.split("\n")) {
    if (line.trim().startsWith("```")) {
      fenced = !fenced;
      out += line + "\n";
      continue;
    }
    if (fenced) {
      out += line + "\n";
      continue;
    }
    out += line.replace(/(`[^`]*`)|([0-9]+)/g, (match, code, digits) =>
      code ? code : digits.replace(/[0-9]/g, (d) => FA[Number(d)])
    ) + "\n";
  }
  return out.replace(/\n$/, "");
}

writeFileSync(resolve(import.meta.dirname, "../../docs/principles/PRINCIPLES-COVERAGE.md"), toPersianOutsideCode(doc));
console.log("wrote", doc.length, "chars");
