// Extract conservative suggestions. Every result retains its source line.
export const fields = [
  ["monthly", "Monthly fee", "What fixed monthly fee should we budget for?"],
  [
    "term",
    "Minimum term",
    "What is the minimum number of months we must commit to?",
  ],
  [
    "setup",
    "Setup fee",
    "Is there an onboarding or setup fee, and how much is it?",
  ],
  [
    "total",
    "Minimum fee commitment",
    "Please confirm the minimum total fees, including any setup costs.",
  ],
  [
    "content",
    "Content production",
    "How many pieces are included per month, and which formats count?",
  ],
  [
    "interviews",
    "SME interviews",
    "Does the retainer include interviews with our product team?",
  ],
  [
    "publishing",
    "Publishing",
    "Who uploads, formats and publishes approved work in our CMS?",
  ],
  [
    "revisions",
    "Revision rounds",
    "How many revision rounds are included per deliverable?",
  ],
  [
    "reporting",
    "Pipeline reporting",
    "What will you report on qualified opportunities, and what CRM access will you need?",
  ],
];
export const unknown = "Unspecified";
export const samples = [
  {
    name: "Agency A",
    text: "Monthly retainer: £4,000 per month.\nMinimum term: 6 months.\nNo setup fee.\nFour articles per month, including research and editing.\nClient team publishes approved articles in the CMS.\nTwo revision rounds per article.",
  },
  {
    name: "Agency B",
    text: "Monthly retainer: £5,000 per month.\nMinimum term: 3 months.\nSetup fee: £0.\nThree articles per month.\nSME interviews included in the retainer.\nOur team handles CMS publishing.\nMonthly reporting covers SQLs and pipeline.",
  },
];
const moneyPattern =
  /(?:£|\$|€|₦|\bGBP\b|\bUSD\b|\bEUR\b|\bNGN\b)\s*(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?(?:k\b)?/gi;
function money(raw) {
  const m = raw.match(/^(£|\$|€|₦|GBP|USD|EUR|NGN)\s*([\d,]+(?:\.\d+)?)(k?)$/i);
  if (!m) return null;
  const symbol =
    { GBP: "£", USD: "$", EUR: "€", NGN: "₦" }[m[1].toUpperCase()] || m[1];
  return { symbol, n: Number(m[2].replace(/,/g, "")) * (m[3] ? 1000 : 1) };
}
const format = (symbol, n) =>
  symbol + n.toLocaleString("en-GB", { maximumFractionDigits: 2 });
const scope = {
  content:
    /\b(articles?|blog posts?|case studies|landing pages|content production)\b/i,
  interviews: /\b(interviews?|subject.matter experts?)\b/i,
  publishing: /\b(publish\w*|CMS upload\w*)\b/i,
  revisions: /\b(revisions?|rounds? of edits?)\b/i,
  reporting: /\b(reporting|reports?|dashboard|attribution)\b/i,
};
export function suggest(text) {
  const lines = text
    .split(/\n+|(?<=[.!?])\s+(?=[A-Z])/)
    .map((l) => l.trim())
    .filter(Boolean);
  const facts = {};
  for (const [key] of fields) {
    if (key === "total") continue;
    const find =
      key === "monthly"
        ? /\b(monthly|per month)\b|\/mo\b/i
        : key === "term"
          ? /\b(minimum|commitment|initial term)\b/i
          : key === "setup"
            ? /\b(set.?up|onboarding|one.off)\b/i
            : scope[key];
    const candidates = lines.filter(
      (l) =>
        find.test(l) &&
        !(key === "monthly" && !(l.match(moneyPattern) || []).length) &&
        !(key === "term" && !/months?\b/i.test(l)),
    );
    const proof = candidates.join("\n");
    let value = unknown;
    if (candidates.length === 1) {
      const line = candidates[0],
        amounts = line.match(moneyPattern) || [];
      const ambiguous =
        /\b(from|starting|up to|between|discount|thereafter|then|tier|additional|variable)\b|\d\s*[-–]\s*\d/i.test(
          line,
        );
      if (key === "term") {
        const term = line.match(/\b(\d+)\s*[- ]?months?\b/i);
        if (term && !ambiguous) value = term[1];
      } else if (key === "monthly" || key === "setup") {
        if (amounts.length === 1 && !ambiguous) {
          const parsed = money(amounts[0]);
          if (parsed) value = format(parsed.symbol, parsed.n);
        } else if (
          key === "setup" &&
          /\b(no|zero) (?:set.?up|onboarding|one.off) fee\b/i.test(line)
        )
          value = "0";
      } else value = line;
    }
    facts[key] = { value, proof };
  }
  return facts;
}
export function commitment(facts) {
  const fee = money(facts.monthly.value.trim()),
    setup = money(facts.setup.value.trim());
  const term = facts.term.value.trim().match(/^(\d+)(?:\s+months?)?$/i);
  if (
    !fee ||
    !term ||
    +term[1] < 1 ||
    !(facts.setup.value.trim() === "0" || setup?.symbol === fee.symbol)
  )
    return unknown;
  return format(fee.symbol, fee.n * Number(term[1]) + (setup?.n || 0));
}
