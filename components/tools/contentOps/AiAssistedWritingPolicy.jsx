"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * GrowUp — AI-Assisted Writing Policy Builder
 * Completely rebuilt UI based on the approved three-column mockup.
 * Drop-in Next.js client component. No UI libraries or extra packages needed.
 * Example details and permissions are fictional; this does not grant tool access.
 */

const STORAGE = "growup-ai-writing-policy-concept-v1";

const COLORS = {
  teal: "#167273",
  deep: "#063e3d",
  ink: "#011522",
};

const STEPS = [
  {
    title: "Scope",
    sub: "Teams, owner, and tools",
  },
  {
    title: "Approved Uses",
    sub: "What's allowed and when",
  },
  {
    title: "Sensitive Data",
    sub: "What to keep out of AI",
  },
  {
    title: "Review & Export",
    sub: "Finalise and share policy",
  },
];

const AI_TOOLS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    hint: "Company workspace",
    favicon:
      "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
  },
  {
    id: "claude",
    name: "Claude",
    hint: "Company workspace",
    favicon:
      "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    hint: "Company workspace",
    favicon:
      "https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    hint: "Company workspace",
    favicon:
      "https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128",
  },
];

const USES = [
  {
    id: "ideas",
    label: "Brainstorming content ideas and angles",
    group: "Planning",
  },
  {
    id: "outlines",
    label: "Outlining and structuring content",
    group: "Planning",
  },
  {
    id: "research",
    label: "Research assistance and topic clustering",
    group: "Planning",
  },
  {
    id: "interview",
    label: "Preparing SME interview questions",
    group: "Planning",
  },
  {
    id: "summarise",
    label: "Summarising approved research or notes",
    group: "Production",
  },
  {
    id: "drafts",
    label: "Writing first drafts of articles and pages",
    group: "Production",
  },
  {
    id: "editing",
    label: "Editing and rewriting approved copy",
    group: "Production",
  },
  {
    id: "seo",
    label: "SEO titles, descriptions and FAQs",
    group: "Production",
  },
  {
    id: "comparison",
    label: "Competitor comparisons and product claims",
    group: "Sensitive",
  },
  {
    id: "quotes",
    label: "Customer quotes, results and case studies",
    group: "Sensitive",
  },
  {
    id: "publish",
    label: "Final approval and publishing",
    group: "Release",
  },
];

const DATA = [
  {
    id: "pii",
    label: "Customer personal information",
    hint: "Names, emails, contact details or identifiers",
  },
  {
    id: "roadmap",
    label: "Unreleased products and roadmaps",
    hint: "Features, launch plans or unpublished specifications",
  },
  {
    id: "contracts",
    label: "Contracts and legal agreements",
    hint: "Unpublished terms or negotiated commitments",
  },
  {
    id: "financial",
    label: "Confidential company finances",
    hint: "Private revenue, margins or pipeline records",
  },
  {
    id: "credentials",
    label: "Passwords, credentials and access tokens",
    hint: "Secrets, API keys and authentication data",
  },
  {
    id: "internal",
    label: "Internal briefs and unpublished drafts",
    hint: "Only in specifically approved environments",
  },
  {
    id: "public",
    label: "Public, approved marketing content",
    hint: "Published pages and approved product facts",
  },
];

const DEFAULT_RULES = Object.fromEntries(
  USES.map((x) => [
    x.id,
    x.id === "publish"
      ? "prohibited"
      : ["drafts", "comparison", "quotes"].includes(x.id)
        ? "approval"
        : "allowed",
  ]),
);

const DEFAULT_DATA = Object.fromEntries(
  DATA.map((x) => [
    x.id,
    x.id === "public"
      ? "allowed"
      : x.id === "internal"
        ? "approval"
        : "prohibited",
  ]),
);

const REVIEWS = [
  {
    id: "accuracy",
    title: "Check facts, figures and citations",
    detail: "Open original sources; remove any unsupported claims.",
  },
  {
    id: "product",
    title: "Verify product, pricing and security claims",
    detail: "Ask the product owner to confirm current capabilities and limits.",
  },
  {
    id: "customer",
    title: "Confirm permission for customer stories",
    detail: "Check quotes, case studies and usage rights before publishing.",
  },
  {
    id: "originality",
    title: "Review originality, voice and usefulness",
    detail: "Edit drafts for accuracy, substance and brand fit.",
  },
  {
    id: "record",
    title: "Record AI usage and approvals",
    detail: "Document the tool, task, reviewer and decision.",
  },
];

const empty = () => ({
  company: "",
  team: ["Content", "Marketing"],
  extraTeam: "",
  owner: "",
  approver: "",
  effective: "",
  review: "",
  contact: "",
  tools: [],
  extraTools: [],
  customUses: [],
  rules: {
    ...DEFAULT_RULES,
  },
  data: {
    ...DEFAULT_DATA,
  },
  reviewChecks: Object.fromEntries(
    REVIEWS.map((x) => [x.id, true]),
  ),
  drafting:
    "AI output is working material. The assigned writer must edit the draft, verify its claims and obtain editorial approval before publication.",
  verification:
    "Every statistic, quotation and product claim must be checked against an original source. Product and pricing details require review by the appropriate owner.",
  disclosure:
    "Writers must record which AI tool was used, for what purpose, and which content was reused or substantially edited.",
  incidents:
    "Stop using the affected tool and notify the policy owner and IT or Security through the approved incident process.",
  exceptions:
    "Request written approval from the named approver before using a restricted workflow. Record the rationale, safeguards and expiry.",
  policySummary:
    "Writers may use approved AI tools for permitted editorial tasks. Restricted information must not be shared without authorisation, and any work requiring additional approval must be reviewed before use. All AI-assisted content must be fact-checked, edited and approved by a human before publication.",
  notes: "",
});

const example = () => ({
  ...empty(),
  company: "RelayLedger",
  team: ["Marketing", "Content", "Brand"],
  owner: "Tory Gray, Head of Content",
  approver: "Tory Gray + IT / Security",
  effective: "2026-11-23",
  review: "2027-05-23",
  contact: "#content-operations (internal)",
  tools: ["chatgpt", "claude", "gemini"],
  extraTools: [],
  customData: [],
  rules: {
    ...DEFAULT_RULES,
    drafts: "approval",
    comparison: "approval",
    quotes: "approval",
  },
  drafting:
    "AI may help create working drafts in approved company workspaces. Writers must independently verify every claim, add first-hand product context and rewrite anything that is generic, inaccurate or unsupported.",
  verification:
    "Verify all statistics, quotations and factual claims against original sources. Product owners must confirm features, pricing and integrations. Customer stories require supporting evidence and permission before publication.",
  disclosure:
    "Every AI-assisted draft must include the tool used, tasks completed, information shared and reviewer responsible. Record any required approvals before publication and follow applicable disclosure requirements.",
  incidents:
    "If restricted information is entered into an AI tool, stop using it immediately and notify the Head of Content and IT / Security. Preserve relevant details and follow the organisation's incident response procedure.",
  exceptions:
    "Request written approval from the policy owner before using AI for any restricted activity. Exceptions involving confidential or sensitive information also require IT / Security approval before any data is shared.",
});

const text = (v) => String(v ?? "").trim();

const normaliseExtraTool = (tool) => {
  if (typeof tool === "string") {
    return {
      name: tool,
      url: "",
      saved: false,
      enabled: true,
    };
  }

  return {
    name: tool?.name ?? "",
    url: tool?.url ?? "",
    saved: tool?.saved ?? Boolean(tool?.name && tool?.url),
    enabled: tool?.enabled ?? true,
  };
};

const getToolFavicon = (website) => {
  try {
    const value = text(website);
    if (!value) return "";

    const fullUrl = /^https?:\/\//i.test(value)
      ? value
      : `https://${value}`;

    const hostname = new URL(fullUrl).hostname;

    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      hostname
    )}&sz=128`;
  } catch {
    return "";
  }
};

const completedExtraTools = (tools) =>
  tools
    .map(normaliseExtraTool)
    .filter(
      (tool) =>
        tool.saved &&
        tool.enabled &&
        text(tool.name) &&
        getToolFavicon(tool.url)
    );

const display = (v, fallback = "Not set") => text(v) || fallback;

const prettyDate = (v) =>
  v
    ? new Date(`${v}T12:00:00`).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not set";

const slug = (v) =>
  text(v)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "company";

const ruleName = (s) =>
  s === "allowed"
    ? "Allowed"
    : s === "approval"
      ? "Needs approval"
      : "Not permitted";

const download = (content, name, mime) => {
  const url = URL.createObjectURL(
    new Blob([content], { type: mime }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

function ToolLogo({ id }) {
  if (id === "chatgpt") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="#122b2c"
          strokeWidth="1.75"
          strokeLinejoin="round"
        >
          <path d="M15.8 5.3c-3.8-2.9-9.3-.1-9.3 4.5-4.3 2.1-4.4 8.3-.3 10.7-.3 4.9 5 7.8 9.1 5.5 4.1 2.5 9.5-.4 9.1-5.3 4.2-2.4 4-8.7-.2-10.9C29 9.6 23.4 6.7 19.6 9" />
          <path d="M10 11.7 16 8l6 3.6v7.1l-6 3.5-6-3.5z" />
          <path d="m16 8 3.4 5.8-3.4 6-6-3.5m12-4.7-6.3 3.2-5.6-3.1" />
        </g>
      </svg>
    );
  }
  if (id === "claude") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <g
          stroke="#d46b47"
          strokeWidth="2.5"
          strokeLinecap="round"
        >
          <path d="M16 2v28M2 16h28M6 6l20 20M26 6 6 26M10 2l12 28M22 2 10 30M2 10l28 12M2 22l28-12" />
        </g>
      </svg>
    );
  }
  if (id === "gemini") {
    return (
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="gai-gm"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop stopColor="#3186ed" />
            <stop offset=".45" stopColor="#8d5ae6" />
            <stop offset="1" stopColor="#e85580" />
          </linearGradient>
        </defs>
        <path
          d="M16 1C18.5 10.5 21.5 13.5 31 16c-9.5 2.5-12.5 5.5-15 15C13.5 21.5 10.5 18.5 1 16 10.5 13.5 13.5 10.5 16 1Z"
          fill="url(#gai-gm)"
        />
      </svg>
    );
  }
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path fill="#ef4d39" d="M15 2c-7 0-13 6-13 13h13z" />
      <path fill="#35a7f2" d="M17 2v13h13C30 8 24 2 17 2" />
      <path fill="#f8c53a" d="M2 17c0 7 6 13 13 13V17Z" />
      <path fill="#40b78b" d="M17 17v13c7 0 13-6 13-13Z" />
    </svg>
  );
}

function Icon({ name, size = 18 }) {
  const P = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  const shapes = {
    users: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2M17 5a3 3 0 0 1 0 6m0 4a5 5 0 0 1 4 5v1" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4zM21 2v5M18.5 4.5h5" />
      </>
    ),
    shield: (
      <>
        <path d="m12 2 9 4v5c0 5.6-3.8 9.2-9 11-5.2-1.8-9-5.4-9-11V6z" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="12" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
    file: (
      <>
        <path d="M6 2h8l5 5v15H6zM14 2v6h5M9 13h7M9 17h7" />
      </>
    ),
    check: <path d="m5 12 5 5L20 7" />,
    x: <path d="M6 6 18 18M18 6 6 18" />,
    plus: <path d="M12 5v14M5 12h14" />,
    arrow: (
      <>
        <path d="M4 12h15m-6-6 6 6-6 6" />
      </>
    ),
    back: (
      <>
        <path d="M20 12H5m6-6-6 6 6 6" />
      </>
    ),
    book: (
      <>
        <path d="M12 6C9 3 5 3 2 4v15c3-1 7-1 10 2 3-3 7-3 10-2V4c-3-1-7-1-10 2zM12 6v15" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v13m-5-5 5 5 5-5M4 19v3h16v-3" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="13" height="13" rx="2" />
        <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
      </>
    ),
    alert: (
      <>
        <path d="m12 2 10 19H2zM12 9v5m0 4v.1" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="17" rx="2" />
        <path d="M7 2v6M17 2v6M3 11h18" />
      </>
    ),
    trash: (
      <>
        <path d="M4 7h16M10 7V4h4v3M7 7l1 14h8l1-14M11 11v6M14 11v6" />
      </>
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      {...P}
    >
      {shapes[name] || shapes.file}
    </svg>
  );
}

function LabelledInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  span = false,
  multiline = false,
  rows = 3,
}) {
  return (
    <label
      className={`gai-field ${span ? "gai-span" : ""}`}
    >
      <span>{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          value={value ?? ""}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function CardHeading({ icon, title, sub }) {
  return (
    <div className="gai-card-heading">
      <span className="gai-card-icon">
        <Icon name={icon} size={20} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{sub}</p>
      </div>
    </div>
  );
}

function Status({ value }) {
  return (
    <span className={`gai-status gai-status-${value}`}>
      {ruleName(value)}
    </span>
  );
}

function buildMarkdown(v) {
  const lines = [
    `# ${display(v.company, "[Organisation]")}: AI-Assisted Writing Policy`,
    "",
    "## Policy summary",
    "",
    v.policySummary ?? empty().policySummary,
    "",
    "## Scope and ownership",
    "",
    `- Applies to: ${v.team
      .concat(v.extraTeam ? [v.extraTeam] : [])
      .join(", ")}`,
    `- Policy owner: ${display(v.owner)}`,
    `- Exceptions approver: ${display(v.approver)}`,
    `- Effective date: ${prettyDate(v.effective)}`,
    `- Review date: ${prettyDate(v.review)}`,
    `- Questions: ${display(v.contact)}`,
    "",
    "## Approved AI tools",
    "",


...(
  v.tools.length || completedExtraTools(v.extraTools).length
    ? [
        ...v.tools.map(
          (id) => AI_TOOLS.find((t) => t.id === id)?.name || id
        ),
        ...completedExtraTools(v.extraTools).map(
          (tool) => `${tool.name} — ${tool.url}`
        ),
      ].map(
        (name) =>
          `- ${name}: company approval must be independently confirmed`
      )
    : [
        ": No approved tools are recorded. Do not assume a tool is authorised.",
      ]
),
"",


    "## Editorial use permissions",
    "",
    ...["allowed", "approval", "prohibited"].flatMap((rule) => [
      `### ${ruleName(rule)}`,
      "",
      ...USES.filter((x) => v.rules[x.id] === rule).map(
        (x) => `- ${x.label}`,
      ),
      ...(v.customUses || [])
        .filter(
          (x) =>
            text(x.label) &&
            x.permission === rule
        )
        .map((x) => `- ${text(x.label)}`),
      "",
    ]),
    `Drafting standard: ${v.drafting}`,
    "",
    "## Information handling",
    "",
    ...["allowed", "approval", "prohibited"].flatMap((rule) => [
      `### ${ruleName(rule)}`,
      "",
      ...DATA.filter((x) => v.data[x.id] === rule).map(
        (x) => `- ${x.label}`,
      ),
      ...(v.customData || [])
        .filter(
          (item) =>
            text(item.label) &&
            item.permission === rule
        )
        .map((item) => `- ${text(item.label)}`),
      "",
    ]),
    "## Review and verification",
    "",
    v.verification,
    "",
    ...REVIEWS.filter((x) => v.reviewChecks[x.id]).map(
      (x) => `- ${x.title}: ${x.detail}`,
    ),
    "",
    `AI use record: ${v.disclosure}`,
    "",
    "## Exceptions and incidents",
    "",
    `Exceptions: ${v.exceptions}`,
    "",
    `Incident response: ${v.incidents}`,
    "",
    v.notes ? `Additional notes: ${v.notes}` : "",
    "---",
    "Draft template for internal approval. Tool authorisation and legal or security compliance must be reviewed by the organisation.",
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

const xml = (v) =>
  String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function downloadExcel(v) {
  // Dependency-free Excel 2003 XML workbook (.xls), editable in Excel and LibreOffice.
  const sections = [
    {
      name: "Scope",
      rows: [
        ["Field", "Value"],
        ["Organisation", v.company],
        [
          "Covered teams",
          [...v.team, v.extraTeam].filter(Boolean).join(", "),
        ],
        ["Policy owner", v.owner],
        ["Policy summary", v.policySummary ?? empty().policySummary],
        ["Exceptions approver", v.approver],
        ["Effective", v.effective],
        ["Next review", v.review],
        ["Questions", v.contact],
      ],
    },
    {
      name: "Approved tools",
      rows: [
        ["Tool", "Status"],
        ...AI_TOOLS.map((t) => [
          t.name,
          v.tools.includes(t.id)
            ? "Listed: approval must be verified"
            : "Not listed",
        ]),

...completedExtraTools(v.extraTools).map(
  (tool) => [
    `${tool.name}: ${tool.url}`,
    "Listed: approval must be verified",
  ]
),



      ],
    },
    {
      name: "Editorial permissions",
      rows: [
        ["Task", "Permission"],
        ...USES.map((t) => [t.label, ruleName(v.rules[t.id])]),
        ...(v.customUses || [])
          .filter((t) => text(t.label))
          .map((t) => [
            text(t.label),
            ruleName(t.permission),
          ]),
      ],
    },
    {
      name: "Information rules",
      rows: [
        ["Category", "Permission"],
        ...DATA.map((t) => [t.label, ruleName(v.data[t.id])]),
        ...(v.customData || [])
          .filter((item) => text(item.label))
          .map((item) => [
            text(item.label),
            ruleName(item.permission),
          ]),
      ],
    },
    {
      name: "Review requirements",
      rows: [
        ["Requirement", "Included"],
        ...REVIEWS.map((x) => [
          x.title,
          v.reviewChecks[x.id] ? "Yes" : "No",
        ]),
        ["Verification", v.verification],
        ["AI-use disclosure", v.disclosure],
        ["Exceptions", v.exceptions],
        ["Incidents", v.incidents],
      ],
    },
  ];
  const workbook = `<?xml version="1.0" encoding="UTF-8"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="hdr"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#073B3B" ss:Pattern="Solid"/></Style><Style ss:ID="normal"><Alignment ss:Vertical="Top" ss:WrapText="1"/></Style></Styles>${sections
    .map(
      (s) =>
        `<Worksheet ss:Name="${xml(s.name)}"><Table><Column ss:Width="240"/><Column ss:Width="440"/>${s.rows
          .map(
            (r, i) =>
              `<Row>${r
                .map(
                  (c) =>
                    `<Cell ss:StyleID="${i === 0 ? "hdr" : "normal"}"><Data ss:Type="String">${xml(c)}</Data></Cell>`,
                )
                .join("")}</Row>`,
          )
          .join("")}</Table></Worksheet>`,
    )
    .join("")}</Workbook>`;
  download(
    workbook,
    `${slug(v.company)}-ai-writing-policy.xls`,
    "application/vnd.ms-excel;charset=utf-8",
  );
}

const CSS = String.raw`
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;750;800;900&display=swap");
/* Self-contained GrowUp tool styles; deliberate divs avoid site-wide header styling. */
.gai-root {
  --ink: #011522;
  --deep: #073b3b;
  --teal: #167273;
  --line: #dce9e6;
  --pale: #eef4f3;
  --sub: #587474;




  color: var(--ink) !important;
  font-family: "Montserrat", Arial, sans-serif !important;
  font-size: 13px;
  line-height: 1.5;
  background: #fff;

  width: min(1200px, calc(100vw - 32px));
  max-width: none;

  position: relative;
  left: 50%;
  transform: translateX(-50%);

  margin: 0;
  padding: 14px 0 28px;
}


.gai-editorial-heading {
  margin-bottom: 14px;
}

.gai-editorial-heading h3 {
  margin: 0 0 5px;
  color: #073b3b;
  font-size: 13px;
  font-weight: 800;
}

.gai-editorial-heading p {
  margin: 0;
  color: #68817b;
  font-size: 11px;
  line-height: 1.6;
}


.gai-root *{box-sizing:border-box;font-family:Montserrat,Arial,sans-serif}
.gai-root button,.gai-root input,.gai-root textarea,.gai-root select{font-family:Montserrat,Arial,sans-serif!important;font-size:inherit}
.gai-root button{cursor:pointer}
.gai-root button:focus-visible,.gai-root input:focus-visible,.gai-root textarea:focus-visible,.gai-root select:focus-visible{outline:2px solid #167273;outline-offset:2px}
.gai-top{display:flex;justify-content:space-between;align-items:center;gap:18px;margin:0 0 20px}
.gai-title-block h2{margin:0!important;color:var(--ink)!important;font-size:clamp(22px,2.05vw,30px)!important;line-height:1.19!important;font-weight:800!important;letter-spacing:-.045em!important}
.gai-title-block p{color:#556d6c;font-size:12px;line-height:1.6;margin:5px 0 0!important;max-width:730px!important}
.gai-top-actions{display:flex;gap:9px;flex:none}
.gai-btn{display:inline-flex;gap:8px;align-items:center;justify-content:center;padding:10px 14px;border-radius:9px;background:#fff;border:1px solid #d6e5e1;color:#073b3b;font-size:11px!important;font-weight:750;min-height:39px;white-space:nowrap;transition:background .15s}
.gai-btn:hover{background:#f1f7f5}
.gai-btn-dark{background:#073b3b;border-color:#073b3b;color:white}
.gai-btn-dark:hover{background:#0e5250;color:white}
.gai-layout {
  display: grid;
  grid-template-columns: 155px minmax(0, 1.2fr) minmax(300px, 1fr);
  gap: 14px;
  align-items: start;
}
.gai-sidebar{border-right:1px solid #e6eeeb;padding-right:13px;min-height:725px;position:sticky;top:18px}
.gai-nav-kicker{font-size:10px;letter-spacing:.12em;font-weight:800;margin:5px 0 18px;color:#27363c}
.gai-nav{display:grid;gap:8px;position:relative}
.gai-step{display:flex;align-items:flex-start;gap:11px;border:0;background:transparent;border-radius:12px;padding:12px 10px;width:100%;text-align:left;color:#203e40;position:relative;min-height:67px}
.gai-step:hover{background:#f2f7f5}
.gai-step.active{background:#e0f2ed}
.gai-step-number{display:grid;place-items:center;width:27px;height:27px;border:1px solid #cee2dc;border-radius:50%;background:#fff;color:#1a4a46;flex:none;font-size:12px;font-weight:800;z-index:1}
.gai-step.active .gai-step-number{background:#073b3b;color:#fff;border-color:#073b3b}
.gai-step-text{display:grid;gap:2px}.gai-step-text strong{font-size:12px;line-height:1.3}.gai-step-text small{font-size:10px;color:#597470;line-height:1.45;font-weight:500}
.gai-step:not(:last-child):after{content:"";position:absolute;left:23px;top:43px;height:30px;width:1px;background:#bdd8d0}
.gai-sidebar-note{margin-top:45px;border:1px solid #dce9e5;border-radius:13px;padding:16px;background:linear-gradient(160deg,#fff 60%,#e3f2ee);min-height:194px}
.gai-sidebar-note svg{color:var(--teal)}.gai-sidebar-note strong{display:block;font-size:13px;line-height:1.3;margin:8px 0}.gai-sidebar-note p{margin:0;font-size:10px;color:#5b7773;line-height:1.65}
.gai-workspace {
  display: grid;
  gap: 12px;
  min-width: 0;
}

/* Hide all editor sections by default */
.gai-workspace > * {
  display: none;
}

/* STEP 1: Scope: team and approved tools */
.gai-workspace[data-active-step="0"] > :nth-child(1),
.gai-workspace[data-active-step="0"] > :nth-child(2) {
  display: block;
}

/* STEP 2: Approved uses */
.gai-workspace[data-active-step="1"] > :nth-child(3) {
  display: grid;
}

.gai-workspace[data-active-step="1"] > :nth-child(4) {
  display: block;
}

/* STEP 3: Sensitive data */
.gai-workspace[data-active-step="2"] > :nth-child(5) {
  display: block;
}

/* STEP 4: Review and export */
.gai-workspace[data-active-step="3"] > :nth-child(6),
.gai-workspace[data-active-step="3"] > :nth-child(7) {
  display: block;
}
.gai-section{border:1px solid #dbe7e4;border-radius:13px;background:#fff;padding:17px 18px;box-shadow:0 4px 18px rgba(2,40,40,.02);scroll-margin-top:30px}
.gai-section.highlight{border-color:#a4d4c7}
.gai-card-heading{display:flex;align-items:flex-start;gap:12px;margin-bottom:14px}
.gai-card-icon{width:37px;height:37px;background:#eaf6f2;border-radius:11px;display:grid;place-items:center;color:#117673;flex:none}
.gai-card-heading h3{font-size:14px!important;line-height:1.4!important;margin:0!important;letter-spacing:-.02em!important;font-weight:800!important;color:#092f32!important}
.gai-card-heading p{margin:2px 0 0!important;color:#69817b;font-size:10.5px;line-height:1.55;max-width:none}
.gai-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:11px 13px}
.gai-field{min-width:0;display:flex;flex-direction:column;gap:5px}.gai-field>span,.gai-mini-label{font-size:10px;font-weight:800;color:#244447}.gai-field input,.gai-field textarea,.gai-field select{width:100%;background:#fff;border:1px solid #d4e3df;padding:10px 11px;border-radius:8px;color:#143535;min-height:37px;outline:0;font-size:11px!important;resize:vertical}.gai-field input::placeholder,.gai-field textarea::placeholder{color:#9aaea9}.gai-field input:focus,.gai-field textarea:focus{border-color:#167273}.gai-span{grid-column:1/-1}
.gai-chips{display:flex;flex-wrap:wrap;align-items:center;gap:5px;min-height:37px;border:1px solid #d4e3df;padding:5px;border-radius:8px}
.gai-chip{border:0;background:#e5f3ef;border-radius:6px;color:#214b49;padding:5px 8px;font-size:10px!important;font-weight:750}.gai-chip.active{background:#cde9e2;color:#073b3b}.gai-chip:not(.active){background:#f2f6f4;color:#718985}
.gai-tool-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
.gai-tool{display:flex;align-items:center;gap:9px;border:1px solid #d9e7e3;border-radius:9px;padding:10px;background:#fff;min-width:0;text-align:left;min-height:57px}
.gai-tool:hover,.gai-tool.selected{background:#f4faf8;border-color:#9acdc0}
.gai-tool-symbol {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 34px;
  background: transparent;
  border-radius: 0;
}

.gai-tool-symbol img {
  width: 26px;
  height: 26px;
  object-fit: contain;
  display: block;
  background: transparent;
  mix-blend-mode: multiply;
}



/* Saved custom AI tools */
.gai-saved-tool {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  min-height: 57px;
  padding: 7px 8px;
  background: #fff;
  border: 1px solid #d9e7e3;
  border-radius: 9px;
}

.gai-saved-tool.selected {
  background: #f4faf8;
  border-color: #9acdc0;
}

.gai-saved-tool-main {
  display: flex;
  align-items: center;
  gap: 7px;
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.gai-saved-tool-checkbox {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
  accent-color: #09615c;
  cursor: pointer;
}

.gai-saved-tool-edit {
  flex: 0 0 auto;
  border: none;
  background: transparent;
  color: #167273;
  font-size: 9px !important;
  font-weight: 750;
  padding: 4px 2px;
}

.gai-saved-tool-edit:hover {
  text-decoration: underline;
}

/* Custom tool form footer */
.gai-custom-tool-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 14px;
}

.gai-custom-tool-footer span {
  color: #68817b;
  font-size: 10px;
}

.gai-custom-tool-footer .gai-btn {
  min-height: 34px;
  padding: 7px 12px;
}

.gai-custom-tool-footer .gai-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}




.gai-tool-label{min-width:0;flex:1}.gai-tool-label strong{font-size:10.5px;font-weight:800;display:block;overflow-wrap:anywhere}.gai-tool-label small{font-size:9px;display:block;color:#78908a}
.gai-tick{display:grid;place-items:center;width:16px;height:16px;border:1px solid #c3d8d1;border-radius:4px;color:#fff;flex:none}.gai-tool.selected .gai-tick{background:#09615c;border-color:#09615c}
.gai-tool-add{display:flex;align-items:center;justify-content:center;gap:6px;font-weight:750;color:#176a68;font-size:11px!important;border:1px dashed #b9d7ce;border-radius:9px;background:#fff;min-height:57px}
.gai-tool-add:hover{background:#f2f9f6}.gai-extra-tools{display:grid;gap:8px;margin-top:10px}.gai-extra-row{display:flex;gap:7px}.gai-extra-row input{flex:1;min-width:0;border:1px solid #d4e3df;padding:9px;border-radius:8px;font-size:11px!important}.gai-extra-row button{border:1px solid #d4e3df;background:white;border-radius:7px;padding:8px}
.gai-help {
  margin: 11px 0 0 !important;
  font-size: 10px;
  color: #6a817b;
  line-height: 1.65;
  max-width: none;
}

.gai-extra-tools {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.gai-custom-tool {
  border: 1px solid #d6e5e1;
  background: #fbfdfc;
  border-radius: 11px;
  padding: 14px;
}

.gai-custom-tool-top {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.gai-custom-tool-icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  color: #167273;
}

.gai-custom-tool-icon img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.gai-custom-tool-title {
  flex: 1;
  min-width: 0;
}

.gai-custom-tool-title strong {
  display: block;
  font-size: 12px;
  font-weight: 800;
}

.gai-custom-tool-title small {
  display: block;
  margin-top: 2px;
  font-size: 10px;
  color: #68817b;
}

.gai-custom-tool-remove {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d6e5e1;
  border-radius: 8px;
  background: white;
  color: #667d78;
}

.gai-custom-tool-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.gai-custom-tool-note {
  font-size: 10px;
  color: #68817b;
  margin: 10px 0 0 !important;
}

@media (max-width: 600px) {
  .gai-custom-tool-fields {
    grid-template-columns: 1fr;
  }
}
/* Hide editorial sections on every step by default */
.gai-workspace > .gai-split {
  display: none;
  grid-template-columns: 1fr;
  gap: 12px;
  width: 100%;
}

/* Show editorial sections only on Step 2 — Approved Uses */
.gai-workspace[data-active-step="1"] > .gai-split {
  display: grid;
}


/* Custom editorial tasks */

.gai-custom-uses-heading {
  padding-top: 15px;
  margin-top: 7px;
  border-top: 1px solid #dce9e6;
}

.gai-custom-uses-heading strong {
  display: block;
  font-size: 11px;
  font-weight: 800;
  color: #073b3b;
}

.gai-custom-uses-heading p {
  margin: 4px 0 10px !important;
  color: #68817b;
  font-size: 10px;
  line-height: 1.6;
}

.gai-custom-use-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 142px 32px;
  gap: 8px;
  align-items: center;
}

.gai-custom-use-row input,
.gai-custom-use-row select {
  min-width: 0;
  width: 100%;
  min-height: 36px;
  padding: 8px 10px;
  background: #fff;
  border: 1px solid #d4e4de;
  border-radius: 7px;
  color: #17383a;
  font-size: 10px !important;
}

.gai-custom-use-remove {
  width: 32px;
  height: 36px;
  display: grid;
  place-items: center;
  background: #fff;
  color: #748782;
  border: 1px solid #d4e4de;
  border-radius: 7px;
}

.gai-custom-use-remove:hover {
  color: #b63c3c;
  background: #fff5f4;
}

.gai-add-custom-use {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  width: 100%;
  padding: 11px;
  border: 1px dashed #b8d7cd;
  border-radius: 8px;
  background: #f8fcfa;
  color: #167273;
  font-size: 11px !important;
  font-weight: 800;
}

.gai-add-custom-use:hover {
  background: #eef7f3;
}

@media (max-width: 600px) {
  .gai-custom-use-row {
    grid-template-columns: minmax(0, 1fr) 32px;
  }

  .gai-custom-use-row select {
    grid-column: 1;
    grid-row: 2;
  }

  .gai-custom-use-remove {
    grid-column: 2;
    grid-row: 1;
  }
}



.gai-check-list{display:grid;gap:10px}.gai-check-row{display:flex;align-items:flex-start;gap:9px;font-size:10.5px;line-height:1.45;color:#17383a;cursor:pointer}.gai-check-row input{accent-color:#0a716b;width:15px;height:15px;margin:0;flex:none}
.gai-panel-compact{padding:16px}.gai-panel-compact .gai-card-heading{margin-bottom:11px}.gai-panel-compact .gai-card-heading h3{font-size:12px!important}
.gai-rule-list{display:grid;gap:8px}.gai-rule-list label{font-size:10px;color:#294a49;display:flex;align-items:flex-start;gap:6px;cursor:pointer}.gai-rule-list select{margin-left:auto;max-width:99px;border:1px solid #dce8e4;border-radius:6px;padding:4px 3px;font-size:9px!important;background:#f8fbfa;color:#244f4c;flex:none}
.gai-rule-list span{flex:1;min-width:0}
.gai-data-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 15px}
.gai-rule-select{border:1px solid #d5e5e0;border-radius:7px;background:#fff;color:#23534f;font-size:10px!important;padding:5px;width:100%;margin-top:5px}
.gai-data-entry{min-width:0}.gai-data-entry strong{display:block;font-size:10.5px;line-height:1.45}.gai-data-entry small{display:block;color:#73908b;font-size:9px;line-height:1.35;margin-top:2px}
.gai-review-row{display:flex;align-items:flex-start;gap:8px;padding:9px 0;border-bottom:1px solid #edf3f0;cursor:pointer}.gai-review-row:last-child{border:0}.gai-review-row input{accent-color:#167273;margin-top:2px}.gai-review-row strong{display:block;font-size:10.5px}.gai-review-row small{display:block;color:#708783;font-size:9.5px}
.gai-outstanding{background:#fff9ef;border:1px solid #eed5b0;border-radius:12px;padding:15px;display:flex;gap:12px;align-items:flex-start}.gai-outstanding svg{color:#b87827;flex:none}.gai-outstanding strong{font-size:12px;display:block}.gai-outstanding p{margin:3px 0 7px!important;color:#826540;font-size:10px}.gai-outstanding ul{margin:0;padding-left:17px;font-size:10px;color:#725936;line-height:1.7}
.gai-preview-col{position:sticky;top:18px;min-width:0}
.gai-preview{border:1px solid #dbe8e4;background:#fff;border-radius:13px;overflow:hidden;box-shadow:0 12px 24px rgba(1,21,34,.035)}
.gai-preview-top{padding:12px 15px;border-bottom:1px solid #e0eae7;display:flex;align-items:center;justify-content:space-between;gap:7px}
.gai-preview-top strong{font-size:10px;letter-spacing:.13em;font-weight:850}.gai-readiness{font-size:9px;font-weight:750;background:#fff2df;color:#875c1d;padding:6px 8px;border-radius:8px;white-space:nowrap}.gai-readiness.ready{background:#e8f5ef;color:#16705f}
.gai-document{padding:20px 22px;max-height:72vh;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#cadbd5 transparent}
.gai-doc-head{display:flex;align-items:center;justify-content:space-between;gap:8px;padding-bottom:14px;border-bottom:1px solid #e0eae6}
.gai-doc-brand{color:#073b3b;font-size:19px;font-weight:900;letter-spacing:-.06em}.gai-doc-brand span{color:#167273}.gai-doc-version{text-align:right;font-size:9px;line-height:1.5;color:#667e78}.gai-doc-version strong{color:#163b38;display:block}
.gai-document h2 {
  font-size: 20px !important;
  line-height: 1.2 !important;
  color: #011522 !important;
  letter-spacing: -.05em !important;
  margin: 0 0 7px !important;
  font-weight: 850 !important;
}.gai-doc-subtitle{font-size:10.5px;color:#5b7470;margin:0 0 14px!important;line-height:1.55}
.gai-doc-meta{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));background:#eaf6f2;border-radius:9px;padding:10px 6px;gap:0;margin:0 0 17px}
.gai-doc-meta div{padding:3px 6px;border-right:1px solid #cde3dd;min-width:0}.gai-doc-meta div:last-child{border:0}.gai-doc-meta small{display:block;font-size:8px;color:#607d76}.gai-doc-meta strong{font-size:9px;display:block;overflow-wrap:anywhere;color:#123d3a;line-height:1.45}
.gai-document h3{font-size:12px!important;font-weight:850!important;letter-spacing:-.02em!important;margin:16px 0 5px!important;color:#102f31!important}
.gai-doc-text{font-size:10px;color:#3a5652;line-height:1.6;margin:0 0 9px!important}

.gai-review-policy-detail {
  margin-top: 13px;
}

.gai-review-policy-detail > strong {
  display: block;
  margin-bottom: 5px;
  color: #073b3b;
  font-size: 10px;
  font-weight: 800;
}

.gai-review-policy-detail > .gai-doc-text {
  margin: 0 !important;
  white-space: pre-wrap;
}
.gai-doc-section{padding:0 0 13px;border-bottom:1px solid #e5efeb}
.gai-doc-section:last-child{border:0}
.gai-doc-band{display:grid;grid-template-columns:112px minmax(0,1fr);gap:8px;align-items:start;padding:10px 0;border-top:1px solid #eef2f0}
.gai-doc-band-label{padding:9px;border-radius:8px;background:#e7f6ed;color:#17614d;font-size:10px;font-weight:800;line-height:1.4}
.gai-doc-band-label.approval{background:#fff2e0;color:#985f1c}.gai-doc-band-label.prohibited{background:#fceceb;color:#a13f3d}
.gai-doc-band ul{padding-left:14px;margin:0;color:#24413f;font-size:9.5px;line-height:1.65}.gai-doc-band li{margin-bottom:3px}
.gai-doc-minor{padding-left:15px;margin:5px 0!important;font-size:9.5px;color:#355652;line-height:1.6}
.gai-doc-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin-top:11px}
.gai-doc-actions .gai-btn{font-size:10px!important;padding:10px 6px;min-width:0;white-space:normal}.gai-doc-actions .gai-btn-dark{background:#073b3b}
.gai-footer-note{font-size:9px;color:#718a84;margin-top:9px;line-height:1.5}
.gai-toast{color:#167273;font-size:11px;font-weight:750;margin-top:6px}
.gai-print{display:none}

.gai-advanced{border:1px solid #dbe7e4;border-radius:12px;background:#fbfdfc;padding:0 16px}.gai-advanced summary{list-style:none;cursor:pointer;padding:13px 0;color:#0e6964;font-size:11px;font-weight:800}.gai-advanced summary::-webkit-details-marker{display:none}.gai-advanced summary:before{content:"+";margin-right:7px;font-size:15px}.gai-advanced[open] summary:before{content:"−"}.gai-advanced summary span{float:right;font-weight:500;font-size:9px;color:#748c87}.gai-advanced-body{border-top:1px solid #dfebe7;padding:10px 0 13px;display:grid;gap:8px}.gai-advanced-rule{display:flex;align-items:center;justify-content:space-between;gap:12px;font-size:10px;line-height:1.4}.gai-advanced-rule span{flex:1}.gai-advanced-rule select{width:142px;max-width:46%;border:1px solid #d4e4de;border-radius:7px;background:white;padding:7px;font-size:10px!important}.gai-advanced-inner{margin-top:14px}.gai-data-hint{display:block;color:#718a83;font-size:9px;margin-top:3px;font-weight:500}
@media(max-width:1220px){.gai-layout{grid-template-columns:155px minmax(0,1fr) minmax(330px,.86fr);gap:13px}.gai-sidebar{padding-right:7px}.gai-section{padding:14px}.gai-split{grid-template-columns:1fr}.gai-tool-grid{grid-template-columns:1fr 1fr}}
@media(max-width:950px){.gai-layout{grid-template-columns:145px minmax(0,1fr)}.gai-preview-col{grid-column:2;position:static}.gai-preview{max-width:none}.gai-document{max-height:540px}.gai-sidebar{grid-row:1 / span 2}}
@media(max-width:680px){.gai-root{width:calc(100vw - 26px)}.gai-top{align-items:flex-start;flex-direction:column}.gai-layout{display:block}.gai-sidebar{position:static;border:0;min-height:0;margin-bottom:13px;padding:0}.gai-nav-kicker{margin:0 0 9px}.gai-nav{grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}.gai-step{display:flex;flex-direction:column;min-height:76px;gap:5px;padding:8px 5px}.gai-step:not(:last-child):after,.gai-sidebar-note{display:none}.gai-step-text strong{font-size:9px}.gai-step-text small{display:none}.gai-workspace{margin-bottom:14px}.gai-preview-col{position:static}.gai-fields{grid-template-columns:1fr}.gai-tool-grid{grid-template-columns:1fr 1fr}.gai-data-list{grid-template-columns:1fr}.gai-split{grid-template-columns:1fr}.gai-doc-actions{grid-template-columns:1fr 1fr 1fr}.gai-document{padding:16px}.gai-doc-band{grid-template-columns:100px minmax(0,1fr)}}
@media print{
  @page {
    size: A4;
    margin: 13mm;
  }

  body * {
    visibility: hidden !important;
  }

  .gai-root {
    position: static !important;
    left: auto !important;
    transform: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .gai-print,
  .gai-print * {
    visibility: visible !important;
  }
  .gai-print {
  display: block !important;
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  transform: none !important;
  width: 100% !important;
  padding: 0 !important;
  margin: 0 !important;
  color: #193a38;
  font: 9pt/1.48 Montserrat, Arial, sans-serif !important;
  background: white !important;
}
  .gai-print-cover{background:#073b3b!important;color:white!important;padding:13mm 12mm!important;border-radius:3mm;margin-bottom:9mm;break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  .gai-print-cover h1{font-size:19pt!important;color:white!important;line-height:1.2!important;margin:8mm 0 3mm!important}.gai-print-cover p{color:#d5e7e1;margin:0!important;font-size:9pt}.gai-print-cover small{font-size:8pt;letter-spacing:.1em;color:#b8d7cd}.gai-print h2{font-size:12pt!important;color:#073b3b!important;border-bottom:1px solid #dce9e5;padding:0 0 2mm;margin:5mm 0 3mm!important;break-after:avoid}.gai-print h3{font-size:9.5pt!important;margin:3mm 0 1mm!important}.gai-print p{margin:2mm 0!important;font-size:8.5pt}.gai-print ul{padding-left:6mm;margin:2mm 0}.gai-print li{margin:1mm 0;font-size:8.5pt}.gai-print table{border-collapse:collapse;width:100%;font-size:8pt;margin:3mm 0}.gai-print td,.gai-print th{border-bottom:1px solid #dce9e5;padding:2mm 2mm;text-align:left}.gai-print th{background:#eef4f3!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}.gai-print tr{break-inside:avoid}.gai-print section{break-inside:auto}.gai-print .gai-print-note{margin-top:7mm!important;color:#637c75;border-top:1px solid #dbe8e4;padding-top:3mm;font-size:7pt}
}
`;



export const faqs = [
  {
    question: "What is an AI-assisted writing policy, and why does my company need one?",
    answer:
      "An AI-assisted writing policy sets rules for how employees, freelancers and agencies use AI during content production. It identifies approved tools, permitted tasks, restricted information and required human reviews. Your company needs one to reduce accidental data exposure, prevent unsupported claims and establish clear responsibility for everything published.",
  },
  {
    question: "Can I customise the policy to match my company’s existing guidelines?",
    answer:
      "Yes. You can select approved AI tools, change editorial permissions, add custom writing tasks and define which information can enter AI systems. You can also edit the policy summary, drafting standards, review requirements and incident procedures. Export the result and obtain internal approval before distributing it as company policy.",
  },
  {
    question: "Who should own and approve our company’s AI writing policy?",
    answer:
      "The content or marketing lead should usually own the AI writing policy and coordinate updates. Editorial managers should approve content quality requirements, while IT, security, privacy and legal stakeholders review tool authorisation and data handling. Assign a named owner and clear approvers so exceptions, incidents and revisions have accountable decision-makers.",
  },
  {
    question: "How often should we review and update our AI writing policy?",
    answer:
      "Review your AI writing policy every six months to make sure the rules are still relevant. Update it sooner if your company starts using new AI tools, changes its content processes or introduces new security requirements. Any major changes should be reviewed and approved by the appropriate team members.",
  },
  {
    question: "What information should writers never share with AI tools?",
    answer:
      "Writers should not enter passwords, API keys, access tokens, confidential financial records, unreleased product plans or customer personal information into AI tools unless an appropriately authorised policy explicitly permits the specific use. Public marketing content may be treated differently. Always check the exact workspace’s approval and data-handling rules before sharing anything.",
  },
  {
    question: "Who is responsible for fact-checking and approving AI-assisted content?",
    answer:
      "The writer should check that everything in the draft is accurate before sending it for review. If the content mentions product features, pricing or integrations, someone from the product team should confirm those details. An editor then reviews the finished piece, checks any customer claims and approves it for publication.",
  },
  {
    question: "Can we use AI-generated content without rewriting or editing it?",
    answer:
      "Not without checking it first. AI can produce a decent first draft, but it can also get facts wrong, invent sources or misunderstand your product. Before publishing, someone needs to check the information, fix anything inaccurate and make sure the content is genuinely useful to readers.",
  },
];




export default function AiAssistedWritingPolicy() {
  const [v, setV] = useState(empty);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const sectionRefs = useRef([]);

  useEffect(() => {
    if (!toast) return;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 5000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE);
      if (raw) {
        const old = JSON.parse(raw);
        if (old && old.policy && typeof old.policy === "object") {
          const x = old.policy;
          setV({
            ...empty(),
            ...x,
            team: Array.isArray(x.team) ? x.team : [],

            tools: Array.isArray(x.tools) ? x.tools : [],


         extraTools: Array.isArray(x.extraTools)
  ? x.extraTools.map(normaliseExtraTool)
  : [],

            customUses: Array.isArray(x.customUses)
              ? x.customUses
              : [],
            rules: {
              ...DEFAULT_RULES,
              ...x.rules,
            },
            data: {
              ...DEFAULT_DATA,
              ...x.data,
            },
            customData: Array.isArray(x.customData)
              ? x.customData
              : [],
            reviewChecks: {
              ...empty().reviewChecks,
              ...x.reviewChecks,
            },
          });
          setActive(
            Math.max(0, Math.min(3, Number(old.active) || 0)),
          );
        }
      }
    } catch (e) {
      console.error("Could not load AI policy draft", e);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(
        STORAGE,
        JSON.stringify({
          policy: v,
          active,
          savedAt: new Date().toISOString(),
        }),
      );
    } catch (e) {
      console.error("Could not save AI policy", e);
    }
  }, [v, active, loaded]);

  const set = (k, x) =>
    setV((old) => ({
      ...old,
      [k]: x,
    }));

  const setRule = (kind, id, value) =>
    setV((old) => ({
      ...old,
      [kind]: {
        ...old[kind],
        [id]: value,
      },
    }));

  const toggleTool = (id) =>
    setV((old) => ({
      ...old,
      tools: old.tools.includes(id)
        ? old.tools.filter((t) => t !== id)
        : [...old.tools, id],
    }));

  const toggleTeam = (team) =>
    setV((old) => ({
      ...old,
      team: old.team.includes(team)
        ? old.team.filter((x) => x !== team)
        : [...old.team, team],
    }));

  const go = (step) => {
    setActive(step);
  };

  const issues = useMemo(() => {
    const a = [];
    if (!text(v.company)) {
      a.push("Add your organisation or brand name");
    }
    if (!text(v.owner)) {
      a.push("Assign a policy owner");
    }
    if (!text(v.approver)) {
      a.push("Name who approves exceptions");
    }


    if (!v.tools.length && !completedExtraTools(v.extraTools).length) {
      a.push("List approved AI tools or confirm that none are permitted");
    }

    if (
      v.extraTools.some((tool) => {
        const item = normaliseExtraTool(tool);

        return (
          (text(item.name) || text(item.url)) &&
          !(text(item.name) && getToolFavicon(item.url))
        );
      })
    ) {
      a.push("Complete the name and website URL for each custom AI tool");
    }

    if (!v.effective || !v.review) {
      a.push("Set effective and review dates");
    }
    if (
      v.data.pii !== "prohibited" ||
      v.data.credentials !== "prohibited"
    ) {
      a.push(
        "Get security and privacy review for sensitive inputs",
      );
    }
    return a;
  }, [v]);

  const usesBy = (kind) => [
    ...USES.filter((x) => v.rules[x.id] === kind),
    ...(v.customUses || [])
      .filter(
        (x) =>
          text(x.label) &&
          x.permission === kind
      )
      .map((x) => ({
        id: x.id,
        label: x.label,
      })),
  ];

  const dataBy = (kind) => [
    ...DATA.filter((x) => v.data[x.id] === kind),
    ...(v.customData || [])
      .filter(
        (item) =>
          text(item.label) &&
          item.permission === kind
      )
      .map((item) => ({
        id: item.id,
        label: text(item.label),
      })),
  ];

const approvedToolNames = [
  ...v.tools.map(
    (id) => AI_TOOLS.find((x) => x.id === id)?.name || id
  ),
  ...completedExtraTools(v.extraTools).map(
    (tool) => tool.name
  ),
];

  const showExample = () => {
    if (
      !window.confirm(
        "Load the fictional RelayLedger example? This replaces the current draft.",
      )
    ) {
      return;
    }


setV(example());
setActive(0);
setToast("");
window.scrollTo({
  top: 0,
  behavior: "smooth",
});


  };

  const fresh = () => {
    if (
      !window.confirm(
        "Start a fresh policy? Your saved draft in this browser will be replaced.",
      )
    ) {
      return;
    }
    setV(empty());
    setActive(0);
    setToast("New policy started.");
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(buildMarkdown(v));
      setToast("Policy copied.");
    } catch {
      setToast(
        "Clipboard unavailable. Use Excel or Save as PDF.",
      );
    }
  };

  const downloadWorkbook = () => {
    downloadExcel(v);
    setToast("Excel-compatible workbook downloaded.");
  };

  const print = () => window.print();

  return (
    <div className="gai-root">
      <style>{CSS}</style>

      <div className="gai-top">


<div className="gai-title-block">
  <h2>Build Your Company’s AI Writing Policy</h2>
  <p style={{ fontSize: "13px", lineHeight: "1.6", paddingTop: "5px", paddingBottom: "5px" }}>
    Set clear rules for approved AI tools, editorial tasks and data protection.
  </p>
</div>


        <div className="gai-top-actions">
          <button
            type="button"
            className="gai-btn"
            onClick={showExample}
          >
            <Icon name="sparkles" size={15} />
            Use example
          </button>
          <button
            type="button"
            className="gai-btn gai-btn-dark"
            onClick={fresh}
          >
            <Icon name="plus" size={16} />
            Start fresh
          </button>
        </div>
      </div>

      <div className="gai-layout">
        <aside className="gai-sidebar">
          <div className="gai-nav-kicker">AI POLICY</div>
          <nav className="gai-nav" aria-label="Policy sections">
            {STEPS.map((s, i) => (
              <button
                type="button"
                key={s.title}
                className={`gai-step ${active === i ? "active" : ""}`}
                onClick={() => go(i)}
                aria-current={active === i ? "step" : undefined}
              >
                <span className="gai-step-number">{i + 1}</span>
                <span className="gai-step-text">
                  <strong>{s.title}</strong>
                  <small>{s.sub}</small>
                </span>
              </button>
            ))}
          </nav>
          <div className="gai-sidebar-note">
            <Icon name="book" size={27} />
            <strong>
              A policy your team can actually use
            </strong>
            <p>
              Document what writers can do with AI, what needs approval and which information must stay private.
            </p>
          </div>
        </aside>

        <main className="gai-workspace" data-active-step={active}>
          <section
            className="gai-section"
            ref={(el) => (sectionRefs.current[0] = el)}
          >
            <CardHeading
              icon="users"
              title="Team & ownership"
              sub="Define who this policy applies to and who maintains it."
            />
            <div className="gai-fields">
              <div className="gai-field">
                <span>Team covered</span>
                <div className="gai-chips">
                  {[
                    "Marketing",
                    "Content",
                    "Brand",
                    "Sales",
                    "Freelancers",
                    "Agencies",
                  ].map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`gai-chip ${v.team.includes(t) ? "active" : ""}`}
                      onClick={() => toggleTeam(t)}
                      aria-pressed={v.team.includes(t)}
                    >
                      {v.team.includes(t) ? "✓ " : "+ "}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <LabelledInput
                label="Policy owner"
                value={v.owner}
                onChange={(x) => set("owner", x)}
                placeholder="e.g. Head of Content"
              />
              <LabelledInput
                label="Company or brand"
                value={v.company}
                onChange={(x) => set("company", x)}
                placeholder="e.g. RelayLedger"
              />
              <LabelledInput
                label="Exceptions approver"
                value={v.approver}
                onChange={(x) => set("approver", x)}
                placeholder="e.g. Content Lead + IT"
              />
              <LabelledInput
                label="Effective from"
                type="date"
                value={v.effective}
                onChange={(x) => set("effective", x)}
              />
              <LabelledInput
                label="Review again on"
                type="date"
                value={v.review}
                onChange={(x) => set("review", x)}
              />
              <LabelledInput
                span
                label="Where should people ask questions?"
                value={v.contact}
                onChange={(x) => set("contact", x)}
                placeholder="e.g. Editorial lead in #content-ops"
              />
            </div>
          </section>

          <section className="gai-section">
            <CardHeading
              icon="sparkles"
              title="Approved AI tools"
              sub="Select the exact company workspaces that have been authorised for content work."
            />






<div className="gai-tool-grid">
  {AI_TOOLS.map((t) => (
    <button
      type="button"
      key={t.id}
      className={`gai-tool ${v.tools.includes(t.id) ? "selected" : ""}`}
      onClick={() => toggleTool(t.id)}
      aria-pressed={v.tools.includes(t.id)}
    >
      <span className="gai-tool-symbol">
        <img src={t.favicon} alt="" width="26" height="26" />
      </span>

      <span className="gai-tool-label">
        <strong>{t.name}</strong>
        <small>{t.hint}</small>
      </span>

      <span className="gai-tick">
        {v.tools.includes(t.id) && <Icon name="check" size={12} />}
      </span>
    </button>
  ))}







{v.extraTools.map((rawTool, i) => {
  const tool = normaliseExtraTool(rawTool);

  if (!tool.saved) return null;

  const favicon = getToolFavicon(tool.url);

  const toggleCustomTool = () => {
    setV((old) => ({
      ...old,
      extraTools: old.extraTools.map((item, index) =>
        index === i
          ? {
              ...normaliseExtraTool(item),
              enabled: !normaliseExtraTool(item).enabled,
            }
          : normaliseExtraTool(item)
      ),
    }));
  };

  return (
    <button
      type="button"
      key={`saved-${i}`}
      className={`gai-tool ${tool.enabled ? "selected" : ""}`}
      onClick={toggleCustomTool}
      aria-pressed={tool.enabled}
      aria-label={`${tool.enabled ? "Remove" : "Include"} ${tool.name} ${
        tool.enabled ? "from" : "in"
      } the policy`}
    >
      <span className="gai-tool-symbol">
        {favicon ? (
          <img
            src={favicon}
            alt=""
            width="26"
            height="26"
            loading="lazy"
          />
        ) : (
          <Icon name="sparkles" size={20} />
        )}
      </span>

      <span className="gai-tool-label">
        <strong>{tool.name}</strong>
        <small>Company workspace</small>
      </span>

      <span className="gai-tick">
        {tool.enabled ? <Icon name="check" size={12} /> : null}
      </span>
    </button>
  );
})}




  <button
    type="button"
    className="gai-tool-add"
    onClick={() =>
      setV((old) => ({
        ...old,
        extraTools: [
          ...old.extraTools.map(normaliseExtraTool),
          {
            name: "",
            url: "",
            saved: false,
            enabled: true,
          },
        ],
      }))
    }
  >
    <Icon name="plus" size={16} />
    Add tool
  </button>
</div>

{v.extraTools.some((t) => !normaliseExtraTool(t).saved) && (
  <div className="gai-extra-tools">
    {v.extraTools.map((rawTool, i) => {
      const tool = normaliseExtraTool(rawTool);

      if (tool.saved) return null;

      const favicon = getToolFavicon(tool.url);
      const complete = Boolean(text(tool.name) && favicon);

      const update = (changes) => {
        setV((old) => ({
          ...old,
          extraTools: old.extraTools.map((item, index) =>
            index === i
              ? { ...normaliseExtraTool(item), ...changes }
              : normaliseExtraTool(item)
          ),
        }));
      };

      return (
        <div className="gai-custom-tool" key={`draft-${i}`}>
          <div className="gai-custom-tool-top">
            <div className="gai-custom-tool-icon">
              {favicon ? (
                <img src={favicon} alt="" width={26} height={26} />
              ) : (
                <Icon name="sparkles" size={20} />
              )}
            </div>

            <div className="gai-custom-tool-title">
              <strong>
                {text(tool.name) || `Custom AI tool ${i + 1}`}
              </strong>
              <small>Enter the tool name and website</small>
            </div>

            <button
              type="button"
              className="gai-custom-tool-remove"
              aria-label="Remove custom AI tool"
              onClick={() =>
                setV((old) => ({
                  ...old,
                  extraTools: old.extraTools.filter(
                    (_, index) => index !== i
                  ),
                }))
              }
            >
              <Icon name="trash" size={16} />
            </button>
          </div>

          <div className="gai-custom-tool-fields">
            <label className="gai-field">
              <span>Tool name</span>
              <input
                type="text"
                value={tool.name}
                placeholder="e.g. Your AI tool name"
                onChange={(e) =>
                  update({ name: e.target.value })
                }
              />
            </label>

            <label className="gai-field">
              <span>Website URL</span>
              <input
                type="text"
                value={tool.url}
                placeholder="https://example.com"
                onChange={(e) =>
                  update({ url: e.target.value })
                }
              />
            </label>
          </div>

          <div className="gai-custom-tool-footer">
            <span>
              {complete
                ? "Ready to add to your approved tools."
                : "Enter a tool name and valid website URL."}
            </span>

            <button
              type="button"
              className="gai-btn gai-btn-dark"
              disabled={!complete}
              onClick={() =>
                update({
                  name: text(tool.name),
                  url: text(tool.url),
                  saved: true,
                })
              }
            >
              <Icon name="check" size={14} />
              Save tool
            </button>
          </div>
        </div>
      );
    })}
  </div>
)}






            <p className="gai-help">
              Only select tools approved by your organisation. Selecting one here does not verify its security, subscription or data-processing settings.
            </p>
          </section>

          <div
            className="gai-split"
            ref={(el) => (sectionRefs.current[1] = el)}
          >
            <section className="gai-section gai-panel-compact">
              <CardHeading
                icon="file"
                title="Editorial use cases (allowed)"
                sub="What your team can use AI for without extra approval."
              />


<div className="gai-check-list">
  {["ideas", "outlines", "research", "interview", "editing", "seo"].map(
    (id) => {
      const x = USES.find((t) => t.id === id);

      return (
        <label key={id} className="gai-check-row">
          <input
            type="checkbox"
            checked={v.rules[id] === "allowed"}
            onChange={(e) =>
              setRule(
                "rules",
                id,
                e.target.checked ? "allowed" : "prohibited"
              )
            }
          />
          <span>{x.label}</span>
        </label>
      );
    }
  )}

  {(v.customUses || [])
    .filter((task) => text(task.label) && task.permission === "allowed")
    .map((task) => (
      <label key={task.id} className="gai-check-row">
        <input
          type="checkbox"
          checked
          onChange={() =>
            setV((old) => ({
              ...old,
              customUses: (old.customUses || []).map((item) =>
                item.id === task.id
                  ? { ...item, permission: "prohibited" }
                  : item
              ),
            }))
          }
        />
        <span>{task.label}</span>
      </label>
    ))}
</div>


            </section>
            <section className="gai-section gai-panel-compact">
              <CardHeading
                icon="shield"
                title="Human approval rules"
                sub="Content and tasks that require additional review."
              />



           <div className="gai-check-list">
  {["drafts", "comparison", "quotes", "publish"].map((id) => {
    const x = USES.find((t) => t.id === id);

    return (
      <label key={id} className="gai-check-row">
        <input
          type="checkbox"
          checked={v.rules[id] === "approval" || id === "publish"}
          disabled={id === "publish"}
          onChange={(e) =>
            setRule(
              "rules",
              id,
              e.target.checked ? "approval" : "prohibited"
            )
          }
        />
        <span>
          {id === "publish"
            ? "Final publication by an authorised human"
            : x.label}
        </span>
      </label>
    );
  })}

  {(v.customUses || [])
    .filter((task) => text(task.label) && task.permission === "approval")
    .map((task) => (
      <label key={task.id} className="gai-check-row">
        <input
          type="checkbox"
          checked
          onChange={() =>
            setV((old) => ({
              ...old,
              customUses: (old.customUses || []).map((item) =>
                item.id === task.id
                  ? { ...item, permission: "prohibited" }
                  : item
              ),
            }))
          }
        />
        <span>{task.label}</span>
      </label>
    ))}
</div>



              <p className="gai-help">
                Publication always requires human sign-off, even when an AI task is otherwise allowed.
              </p>
            </section>
          </div>


          <details className="gai-advanced">
            <summary>
              Customise all editorial permissions
              <span>
                Allowed / approval required / prohibited
              </span>
            </summary>

            <div className="gai-advanced-body">
              {USES.filter((x) => x.id !== "publish").map((x) => (
                <label className="gai-advanced-rule" key={x.id}>
                  <span>{x.label}</span>
                  <select
                    value={v.rules[x.id]}
                    onChange={(e) =>
                      setRule("rules", x.id, e.target.value)
                    }
                  >
                    <option value="allowed">Allowed</option>
                    <option value="approval">Approval required</option>
                    <option value="prohibited">Prohibited</option>
                  </select>
                </label>
              ))}

              <div className="gai-custom-uses-heading">
                <strong>Your custom editorial tasks</strong>
                <p>
                  Add tasks specific to your organisation and decide
                  how AI can be used for each one.
                </p>
              </div>

              {(v.customUses || []).map((task) => (
                <div className="gai-custom-use-row" key={task.id}>
                  <input
                    type="text"
                    value={task.label}
                    placeholder="e.g. Translating support articles"
                    aria-label="Custom editorial task"
                    onChange={(e) =>
                      setV((old) => ({
                        ...old,
                        customUses: (old.customUses || []).map((item) =>
                          item.id === task.id
                            ? { ...item, label: e.target.value }
                            : item
                        ),
                      }))
                    }
                  />

                  <select
                    value={task.permission}
                    aria-label="Custom task permission"
                    onChange={(e) =>
                      setV((old) => ({
                        ...old,
                        customUses: (old.customUses || []).map((item) =>
                          item.id === task.id
                            ? { ...item, permission: e.target.value }
                            : item
                        ),
                      }))
                    }
                  >
                    <option value="allowed">Allowed</option>
                    <option value="approval">Approval required</option>
                    <option value="prohibited">Prohibited</option>
                  </select>

                  <button
                    type="button"
                    className="gai-custom-use-remove"
                    aria-label="Remove custom editorial task"
                    onClick={() =>
                      setV((old) => ({
                        ...old,
                        customUses: (old.customUses || []).filter(
                          (item) => item.id !== task.id
                        ),
                      }))
                    }
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="gai-add-custom-use"
                onClick={() =>
                  setV((old) => ({
                    ...old,
                    customUses: [
                      ...(old.customUses || []),
                      {
                        id: `custom-${Date.now()}-${Math.random()
                          .toString(36)
                          .slice(2, 8)}`,
                        label: "",
                        permission: "approval",
                      },
                    ],
                  }))
                }
              >
                <Icon name="plus" size={15} />
                Add custom task
              </button>
            </div>
          </details>


          <section
            className="gai-section"
            ref={(el) => (sectionRefs.current[2] = el)}
          >
            <CardHeading
              icon="lock"
              title="Restricted data & permitted inputs"
              sub="Set what your writers can and cannot enter into an AI tool."
            />
            <div className="gai-data-list">
              {DATA.map((x) => (
                <label className="gai-check-row" key={x.id}>
                  <input
                    type="checkbox"
                    checked={v.data[x.id] === "prohibited"}
                    onChange={(e) =>
                      setRule(
                        "data",
                        x.id,
                        e.target.checked ? "prohibited" : "approval"
                      )
                    }
                  />
                  <span>
                    <strong>{x.label}</strong>
                    <small className="gai-data-hint">{x.hint}</small>
                  </span>
                </label>
              ))}

              {(v.customData || [])
                .filter((item) => text(item.label))
                .map((item) => (
                  <label className="gai-check-row" key={item.id}>
                    <input
                      type="checkbox"
                      checked={item.permission === "prohibited"}
                      onChange={(e) =>
                        setV((old) => ({
                          ...old,
                          customData: (old.customData || []).map((x) =>
                            x.id === item.id
                              ? {
                                  ...x,
                                  permission: e.target.checked
                                    ? "prohibited"
                                    : "approval",
                                }
                              : x
                          ),
                        }))
                      }
                    />
                    <span>
                      <strong>{item.label}</strong>
                      <small className="gai-data-hint">
                        {item.permission === "prohibited"
                          ? "Never share with AI tools"
                          : item.permission === "approval"
                            ? "Requires approval before use"
                            : "Allowed in approved AI tools"}
                      </small>
                    </span>
                  </label>
                ))}
            </div>
            <details className="gai-advanced gai-advanced-inner">
              <summary>
                Set detailed data permissions
                <span>Restricted / approval / allowed</span>
              </summary>

              <div className="gai-advanced-body">
                {DATA.map((x) => (
                  <label className="gai-advanced-rule" key={x.id}>
                    <span>{x.label}</span>
                    <select
                      value={v.data[x.id]}
                      onChange={(e) =>
                        setRule("data", x.id, e.target.value)
                      }
                    >
                      <option value="prohibited">Never share</option>
                      <option value="approval">Approval required</option>
                      <option value="allowed">
                        Allowed in approved tools
                      </option>
                    </select>
                  </label>
                ))}

                <div className="gai-custom-uses-heading">
                  <strong>Your custom information categories</strong>
                  <p>
Add information specific to your organisation and define what AI tools can access
                  </p>
                </div>

                {(v.customData || []).map((item) => (
                  <div className="gai-custom-use-row" key={item.id}>
                    <input
                      type="text"
                      value={item.label}
                      placeholder="e.g. Unpublished acquisition plans"
                      aria-label="Custom information category"
                      onChange={(e) =>
                        setV((old) => ({
                          ...old,
                          customData: (old.customData || []).map((x) =>
                            x.id === item.id
                              ? { ...x, label: e.target.value }
                              : x
                          ),
                        }))
                      }
                    />

                    <select
                      value={item.permission}
                      aria-label="Custom information permission"
                      onChange={(e) =>
                        setV((old) => ({
                          ...old,
                          customData: (old.customData || []).map((x) =>
                            x.id === item.id
                              ? { ...x, permission: e.target.value }
                              : x
                          ),
                        }))
                      }
                    >
                      <option value="prohibited">Never share</option>
                      <option value="approval">Approval required</option>
                      <option value="allowed">
                        Allowed in approved tools
                      </option>
                    </select>

                    <button
                      type="button"
                      className="gai-custom-use-remove"
                      aria-label={`Remove ${item.label || "custom category"}`}
                      onClick={() =>
                        setV((old) => ({
                          ...old,
                          customData: (old.customData || []).filter(
                            (x) => x.id !== item.id
                          ),
                        }))
                      }
                    >
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="gai-add-custom-use"
                  onClick={() =>
                    setV((old) => ({
                      ...old,
                      customData: [
                        ...(old.customData || []),
                        {
                          id: `data-${Date.now()}-${Math.random()
                            .toString(36)
                            .slice(2, 8)}`,
                          label: "",
                          permission: "prohibited",
                        },
                      ],
                    }))
                  }
                >
                  <Icon name="plus" size={15} />
                  Add custom category
                </button>
              </div>

            </details>
            <p className="gai-help">
              Data permission applies only after a workspace has been authorised. Review sensitive data decisions with IT, Security and Privacy.
            </p>
          </section>

          <section
            className="gai-section"
            ref={(el) => (sectionRefs.current[3] = el)}
          >
            <CardHeading
              icon="shield"
              title="Review & publishing standards"
              sub="Make the handoff specific enough that a writer knows what must be checked."
            />

            <div style={{ marginBottom: 18 }}>
              <LabelledInput
                label="Policy summary"
                multiline
                rows={4}
                value={v.policySummary ?? empty().policySummary}
                onChange={(value) => set("policySummary", value)}
                placeholder="Summarise your organisation's rules for using AI in content production."
              />
            </div>

            <div className="gai-editorial-heading">
  <h3>Editorial review &amp; accountability</h3>
  <p>
    Complete these checks before approving AI-assisted content
    for publication.
  </p>
</div>

<div className="gai-check-list">
              {REVIEWS.map((x) => (
                <label className="gai-review-row" key={x.id}>
                  <input
                    type="checkbox"
                    checked={!!v.reviewChecks[x.id]}
                    onChange={(e) =>
                      setRule(
                        "reviewChecks",
                        x.id,
                        e.target.checked,
                      )
                    }
                  />
                  <span>
                    <strong>{x.title}</strong>
                    <small>{x.detail}</small>
                  </span>
                </label>
              ))}
            </div>
            <div
              className="gai-fields"
              style={{ marginTop: 14 }}
            >
              <LabelledInput
                span
                multiline
                label="AI drafting standard"
                value={v.drafting}
                onChange={(x) => set("drafting", x)}
              />
              <LabelledInput
                span
                multiline
                label="Fact-checking and source verification"
                value={v.verification}
                onChange={(x) => set("verification", x)}
              />
              <LabelledInput
                span
                multiline
                label="AI-use documentation"
                value={v.disclosure}
                onChange={(x) => set("disclosure", x)}
              />
              <LabelledInput
                span
                multiline
                label="Exceptions and approvals"
                value={v.exceptions}
                onChange={(x) => set("exceptions", x)}
              />
              <LabelledInput
                span
                multiline
                label="If restricted data is accidentally shared"
                value={v.incidents}
                onChange={(x) => set("incidents", x)}
              />
              <LabelledInput
                span
                multiline
                rows={2}
                label="Other policy requirements (optional)"
                value={v.notes}
                onChange={(x) => set("notes", x)}
                placeholder="Relevant contracts, policies or approval links"
              />
            </div>
          </section>

        </main>

        <aside
          className="gai-preview-col"
          aria-label="Live policy preview"
        >
          <div className="gai-preview">
            <div className="gai-preview-top">
              <strong>POLICY PREVIEW (LIVE)</strong>
              <span
                className={`gai-readiness ${issues.length === 0 ? "ready" : ""}`}
              >
                {issues.length
                  ? `Draft · ${issues.length} to review`
                  : "Core fields complete"}
              </span>
            </div>
            <div className="gai-document">
  



              <h2>AI-Assisted Writing Policy</h2>
              <p className="gai-doc-subtitle">
                Clear rules for how{" "}
                {display(v.company, "your organisation")} uses AI
                to plan, write, review and publish content.
              </p>
              <div className="gai-doc-meta">
                <div>
                  <small>Applies to</small>
                  <strong>
                    {[...v.team, v.extraTeam]
                      .filter(Boolean)
                      .join(", ") || "Not set"}
                  </strong>
                </div>
                <div>
                  <small>Policy owner</small>
                  <strong>
                    {display(v.owner, "Not assigned")}
                  </strong>
                </div>
                <div>
                  <small>Next review</small>
                  <strong>{prettyDate(v.review)}</strong>
                </div>
              </div>

              <div className="gai-doc-section">
                <h3>Policy summary</h3>
                <p
                  className="gai-doc-text"
                  style={{ whiteSpace: "pre-wrap" }}
                >
                  {v.policySummary ?? empty().policySummary}
                </p>
              </div>

              <div className="gai-doc-section">
                <h3>Approved AI tools</h3>
                {approvedToolNames.length ? (
                  <ul className="gai-doc-minor">
                    {approvedToolNames.map((s, i) => (
                      <li key={s + i}>
                        {s}: verify approved company account and
                        permitted inputs
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="gai-doc-text">
                    <em>
                      No AI workspaces have been listed. Do not
                      assume a tool is authorised.
                    </em>
                  </p>
                )}
              </div>

              <div className="gai-doc-section">
                <h3>Editorial use permissions</h3>
                {[
                  ["allowed", "Allowed AI uses"],
                  ["approval", "Requires approval"],
                  ["prohibited", "Not permitted"],
                ].map(([kind, label]) => (
                  <div className="gai-doc-band" key={kind}>
                    <div
                      className={`gai-doc-band-label ${kind}`}
                    >
                      {label}
                    </div>
                    <ul>
                      {usesBy(kind).length ? (
                        usesBy(kind).map((x) => (
                          <li key={x.id}>{x.label}</li>
                        ))
                      ) : (
                        <li>None selected</li>
                      )}
                    </ul>
                  </div>
                ))}
                <p
                  className="gai-doc-text"
                  style={{ marginTop: 8 }}
                >
                  A permitted task still requires an authorised
                  workspace and permitted source material.
                </p>
              </div>

              <div className="gai-doc-section">
                <h3>
                  Information that must stay out of AI tools
                </h3>
                <ul className="gai-doc-minor">
                  {dataBy("prohibited").map((x) => (
                    <li key={x.id}>{x.label}</li>
                  ))}
                  {!dataBy("prohibited").length && (
                    <li>
                      No categories marked prohibited, security
                      review needed
                    </li>
                  )}
                </ul>
                {dataBy("approval").length > 0 && (
                  <p className="gai-doc-text">
                    <strong>Approval required:</strong>{" "}
                    {dataBy("approval")
                      .map((x) => x.label)
                      .join(", ")}
                    .
                  </p>
                )}
              </div>





          <div className="gai-doc-section">
  <h3>Reviewer responsibilities</h3>

  <ul className="gai-doc-minor">
    {REVIEWS.filter((x) => v.reviewChecks[x.id]).map(
      (x) => (
        <li key={x.id}>{x.title}</li>
      ),
    )}
  </ul>

  <div className="gai-review-policy-detail">
    <strong>AI drafting standard</strong>
    <p className="gai-doc-text">{v.drafting}</p>
  </div>

  <div className="gai-review-policy-detail">
    <strong>Fact-checking and source verification</strong>
    <p className="gai-doc-text">{v.verification}</p>
  </div>

  <div className="gai-review-policy-detail">
    <strong>AI-use documentation</strong>
    <p className="gai-doc-text">{v.disclosure}</p>
  </div>
</div>


<div className="gai-doc-section">
  <h3>Exceptions & incident response</h3>
  <p className="gai-doc-text">
    <strong>Exceptions:</strong> {v.exceptions}
  </p>
  <p className="gai-doc-text">
    <strong>Incidents:</strong> {v.incidents}
  </p>
</div>

{text(v.notes) && (
  <div className="gai-doc-section">
    <h3>Other policy requirements</h3>
    <p
      className="gai-doc-text"
      style={{ whiteSpace: "pre-wrap" }}
    >
      {v.notes}
    </p>
  </div>
)}



            </div>
          </div>

          <div className="gai-doc-actions">
            <button
              type="button"
              className="gai-btn"
              onClick={copy}
            >
              <Icon name="copy" size={14} />
              Copy policy
            </button>
            <button
              type="button"
              className="gai-btn"
              onClick={downloadWorkbook}
            >
              <Icon name="download" size={14} />
              Download Excel
            </button>
            <button
              type="button"
              className="gai-btn gai-btn-dark"
              onClick={print}
            >
              <Icon name="file" size={14} />
              Save as PDF
            </button>
          </div>
          <div className="gai-footer-note">
            {loaded
              ? "Changes saved in this browser."
              : "Loading saved policy…"}{" "}
            This template does not verify AI vendor security or
            legal compliance.
          </div>
          {toast && (
            <div role="status" className="gai-toast">
              {toast}
            </div>
          )}
        </aside>
      </div>

      <article
        className="gai-print"
        aria-label="Print version of AI writing policy"
      >
        <div className="gai-print-cover">
          <strong
            style={{
              fontSize: "18pt",
              color: "white",
            }}
          >
            GrowUp.
          </strong>
          <div style={{ marginTop: "8mm" }}>
            <small>
              EDITORIAL GOVERNANCE · INTERNAL POLICY
            </small>
            <h1>
              {display(v.company, "Your organisation")}
              <br />
              AI-Assisted Writing Policy
            </h1>
            <p>
              Approved AI tools, editorial permissions, protected
              information and human review requirements.
            </p>
          </div>
        </div>

        <section>
          <h2>Policy summary</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {v.policySummary ?? empty().policySummary}
          </p>
        </section>

        <section>
          <h2>01 / Scope and responsibility</h2>
          <p>
            <strong>Applies to:</strong>{" "}
            {[...v.team, v.extraTeam]
              .filter(Boolean)
              .join(", ")}
          </p>
          <p>
            <strong>Owner:</strong> {display(v.owner)}
          </p>
          <p>
            <strong>Exceptions approver:</strong>{" "}
            {display(v.approver)}
          </p>
          <p>
            <strong>Effective:</strong> {prettyDate(v.effective)}{" "}
            · <strong>Review:</strong> {prettyDate(v.review)}
          </p>
          <p>
            <strong>Questions:</strong> {display(v.contact)}
          </p>
        </section>

        <section>
          <h2>02 / Approved AI workspaces</h2>
          {approvedToolNames.length ? (
            <ul>
              {approvedToolNames.map((name, i) => (
                <li key={name + i}>
                  {name}: verify authorised company environment
                  and data permissions.
                </li>
              ))}
            </ul>
          ) : (
            <p>No workspaces listed as approved.</p>
          )}
        </section>

        <section>
          <h2>03 / Editorial permissions</h2>
          <table>
            <thead>
              <tr>
                <th>Editorial task</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {USES.map((x) => (
                <tr key={x.id}>
                  <td>{x.label}</td>
                  <td>{ruleName(v.rules[x.id])}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Drafting standard</h3>
          <p>{v.drafting}</p>
        </section>

        <section>
          <h2>04 / Information handling</h2>
          <table>
            <thead>
              <tr>
                <th>Information category</th>
                <th>Decision</th>
              </tr>
            </thead>
            <tbody>
              {DATA.map((x) => (
                <tr key={x.id}>
                  <td>{x.label}</td>
                  <td>{ruleName(v.data[x.id])}</td>
                </tr>
              ))}

              {(v.customData || [])
                .filter((item) => text(item.label))
                .map((item) => (
                  <tr key={item.id}>
                    <td>{text(item.label)}</td>
                    <td>{ruleName(item.permission)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>05 / Review and verification</h2>
          <p>{v.verification}</p>
          <ul>
        {REVIEWS.filter((x) => v.reviewChecks[x.id]).map(
  (x) => (
    <li key={x.id}>
      <strong>{x.title}:</strong> {x.detail}
    </li>
  ),
)}


          </ul>
          <p>
            <strong>AI-use record:</strong> {v.disclosure}
          </p>
        </section>

        <section>
          <h2>06 / Exceptions and incidents</h2>
          <p>
            <strong>Exceptions:</strong> {v.exceptions}
          </p>
          <p>
            <strong>Incident response:</strong> {v.incidents}
          </p>
          {v.notes && (
            <p>
              <strong>Additional notes:</strong> {v.notes}
            </p>
          )}
        </section>

        <p className="gai-print-note">
          Prepared with GrowUp. Draft policy only; internal legal,
          privacy, security and editorial approvals are required
          before adoption.
        </p>
      </article>
    </div>
  );
}