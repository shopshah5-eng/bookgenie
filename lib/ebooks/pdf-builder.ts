// lib/ebooks/pdf-builder.ts
// Deterministic PDF generator for Starter Kit & Blueprint ebooks using jsPDF

import { jsPDF } from 'jspdf';

function addHeaderFooter(doc: jsPDF, title: string, pageNum: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Header line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  doc.text(title.toUpperCase(), 20, 12);
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.3);
  doc.line(20, 15, pageWidth - 20, 15);

  // Footer line
  doc.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
  doc.text('© 2026 BookGenie Publishing • Digital Product Profit Series', 20, pageHeight - 10);
}

function drawCallout(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  title: string,
  lines: string[]
): number {
  const boxPadding = 6;
  const lineHeight = 5.5;
  const h = 10 + lines.length * lineHeight + boxPadding;

  // Background
  doc.setFillColor(250, 248, 242);
  doc.rect(x, y, w, h, 'F');

  // Left golden border
  doc.setFillColor(180, 135, 60);
  doc.rect(x, y, 2.5, h, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(140, 95, 35);
  doc.text(title, x + 8, y + 7);

  // Body lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  let curY = y + 13;
  lines.forEach((l) => {
    doc.text(l, x + 8, curY);
    curY += lineHeight;
  });

  return h;
}

export async function generateStarterKitPdf(): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const cw = pw - margin * 2;
  const totalPages = 12;

  // ---------------- PAGE 1: COVER ----------------
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pw, ph, 'F');

  // Golden accent frame
  doc.setDrawColor(190, 150, 75);
  doc.setLineWidth(0.8);
  doc.rect(12, 12, pw - 24, ph - 24);
  doc.setLineWidth(0.3);
  doc.rect(15, 15, pw - 30, ph - 30);

  // Top badge
  doc.setFillColor(25, 25, 30);
  doc.roundedRect(pw / 2 - 45, 30, 90, 10, 5, 5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(230, 195, 120);
  doc.text('FREE STARTER KIT • 2026 EDITION', pw / 2, 36.5, { align: 'center' });

  // Main Titles
  doc.setFont('times', 'bold');
  doc.setFontSize(36);
  doc.setTextColor(245, 215, 140);
  doc.text('THE FIRST', pw / 2, 65, { align: 'center' });

  doc.setFontSize(54);
  doc.text('$100', pw / 2, 85, { align: 'center' });

  doc.setFontSize(38);
  doc.text('ONLINE', pw / 2, 102, { align: 'center' });

  // Divider
  doc.setDrawColor(190, 150, 75);
  doc.line(pw / 2 - 25, 112, pw / 2 + 25, 112);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(230, 230, 230);
  const subLines = doc.splitTextToSize(
    'A 15-Minute Overview of Making Money Selling Digital Products in 2026',
    cw - 20
  );
  doc.text(subLines, pw / 2, 124, { align: 'center' });

  // Central Emblem Graphic
  doc.setDrawColor(190, 150, 75);
  doc.circle(pw / 2, 185, 35, 'S');
  doc.setFont('times', 'italic');
  doc.setFontSize(14);
  doc.setTextColor(215, 180, 100);
  doc.text('Digital Freedom Playbook', pw / 2, 182, { align: 'center' });
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text('~90% Margins • Zero Inventory', pw / 2, 190, { align: 'center' });

  // Footer on cover
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(210, 175, 95);
  doc.text('COMPANION TO THE DIGITAL PRODUCT PROFIT BLUEPRINT', pw / 2, ph - 25, { align: 'center' });

  // ---------------- PAGE 2: START HERE ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Start Here — Your 15-Minute Overview', 2, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);
  doc.text('Start Here — Your 15-Minute Overview', margin, 32);

  doc.setDrawColor(180, 135, 60);
  doc.setLineWidth(1);
  doc.line(margin, 36, margin + 40, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  const p2Text = [
    'Selling digital products is still one of the few businesses you can start this weekend with almost no money: no inventory, no shipping, ~90% margins, and a laptop. This free starter kit gives you the overview — the 20% of the playbook that produces 80% of the results.',
    '',
    'The full system — every platform in detail, complete organic and paid playbooks, funnels, launches and a week-by-week 90-day plan — lives in The Digital Product Profit Blueprint (2026 Edition), the companion ebook this kit was built from. You’ll meet it properly on the last page.',
    '',
    'In the next 10 pages:',
    '• Why digital products still print money in 2026',
    '• The 10 product types that actually sell (with price bands)',
    '• A weekend validation test so you never build something nobody wants',
    '• Where to sell: marketplaces vs. your own storefront, in one glance',
    '• Pricing, free traffic and paid traffic — the starter rules',
    '• Your first 30 days, mapped week by week',
  ];
  let curY = 46;
  p2Text.forEach((l) => {
    if (l === '') {
      curY += 4;
    } else {
      const split = doc.splitTextToSize(l, cw);
      doc.text(split, margin, curY);
      curY += split.length * 5.5;
    }
  });

  drawCallout(
    doc,
    margin,
    curY + 4,
    cw,
    'How to use this kit:',
    ['Skim it in 15 minutes, circle one product type and one traffic channel, then go deep', 'with the Blueprint. Overview first, details second.']
  );

  curY += 35;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(25, 25, 25);
  doc.text('The whole game in one line', margin, curY);
  curY += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(60, 60, 60);
  const oneLine =
    'Pick a proven product -> validate it in a weekend -> sell on one marketplace and your own store -> drive traffic with one organic channel -> capture every email -> scale with ads only after the math works. Every page of this kit is one step of that line.';
  doc.text(doc.splitTextToSize(oneLine, cw), margin, curY);

  // ---------------- PAGE 3: WHY DIGITAL PRODUCTS IN 2026 ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Why Digital Products Still Print Money in 2026', 3, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Why Digital Products Still Print Money in 2026', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const p3Points = [
    '• ~90% margins: Build once, sell forever — no inventory, no shipping, no stock-outs. Every sale after the first is almost pure profit.',
    '• AI cut build time 10x: Templates, ebooks and courses that took weeks now take weekends — which means the bottleneck moved from making things to marketing them.',
    '• Demand keeps climbing: Creators, students and small businesses buy planners, templates, prompts and mini-courses every day, and the creator economy keeps expanding in 2026.',
    '• Global by default: A product listed tonight can sell in 190 countries by morning.',
  ];

  curY = 45;
  p3Points.forEach((pt) => {
    const s = doc.splitTextToSize(pt, cw);
    doc.text(s, margin, curY);
    curY += s.length * 6 + 2;
  });

  drawCallout(
    doc,
    margin,
    curY + 4,
    cw,
    'The margin math:',
    ['100 sales x a $15 product at ~90% margin = $1,350 — from a file that already exists on your laptop.']
  );

  curY += 34;
  doc.setFont('times', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(25, 25, 25);
  doc.text('Who wins in 2026', margin, curY);
  curY += 8;

  const winners = [
    '• Specialists beat generalists: "Notion CRM for freelance videographers" outsells "productivity templates."',
    '• Consistent publishers beat perfectionists: Shipping weekly beats polishing monthly.',
    '• List-builders beat platform renters: An email list is the only audience nobody can algorithm away.',
  ];
  winners.forEach((w) => {
    const s = doc.splitTextToSize(w, cw);
    doc.text(s, margin, curY);
    curY += s.length * 6 + 2;
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'Realistic ramp:',
    [
      'Months 1–3: $100–300/mo  •  Months 4–6: $500–1,500/mo  •  Months 7–12: $1,500–4,000/mo',
      'For sellers who ship weekly. Full income data and four case snapshots -> Chapters 1 & 33 in Blueprint.',
    ]
  );

  // ---------------- PAGE 4: 10 PRODUCT TYPES ----------------
  doc.addPage();
  addHeaderFooter(doc, 'The 10 Product Types That Actually Sell', 4, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('The 10 Product Types That Actually Sell', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    'You don’t need an original idea — you need a proven format executed for a specific audience. These ten carry most of the market in 2026:',
    margin,
    42
  );

  // Table
  const tableData = [
    ['Printables (wall art, trackers, tags)', '$8–18', 'Etsy + Pinterest'],
    ['Canva templates (social kits, decks)', '$8–40', 'Etsy, Creative Market'],
    ['Digital planners & journals', '$18–28', 'Etsy, own store'],
    ['Notion templates (life OS, CRMs)', '$15–45', 'Gumroad + TikTok'],
    ['Ebooks & guides', '$9–29', 'Amazon KDP, own store'],
    ['AI prompt packs', '$7–47', 'Gumroad, PromptBase'],
    ['Spreadsheet tools (budgets, calculators)', '$25–49', 'Own store, Etsy'],
    ['Mini-courses & workshops', '$49–79', 'Teachable, YouTube'],
    ['Flagship courses', '$199–497', 'Own store + email'],
    ['Memberships & communities', '$15–29/mo', 'Patreon, Skool, Substack'],
  ];

  let tY = 52;
  doc.setFillColor(30, 30, 35);
  doc.rect(margin, tY, cw, 7, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Product Type', margin + 3, tY + 5);
  doc.text('Sweet-Spot Price', margin + 85, tY + 5);
  doc.text('Where It Sells Best', margin + 125, tY + 5);

  tY += 7;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  tableData.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 248 : 255);
    doc.rect(margin, tY, cw, 6.5, 'F');
    doc.setTextColor(40, 40, 40);
    doc.text(row[0], margin + 3, tY + 4.5);
    doc.text(row[1], margin + 85, tY + 4.5);
    doc.text(row[2], margin + 125, tY + 4.5);
    tY += 6.5;
  });

  drawCallout(
    doc,
    margin,
    tY + 8,
    cw,
    'Quick pick:',
    [
      'Printables & Canva templates = fastest to make.',
      'Notion templates & spreadsheets = highest perceived value per build hour.',
      'Ebooks & courses = strongest once you have an audience. Any of the ten can be your first $100.',
    ]
  );

  // ---------------- PAGE 5: VALIDATE BEFORE YOU BUILD ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Validate Before You Build (Weekend Edition)', 5, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Validate Before You Build (Weekend Edition)', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const p5Text = [
    'The #1 beginner mistake is spending a month building something nobody asked for. The Blueprint’s full validation playbook (Chapter 4) runs deep; here is the weekend cut:',
    '',
    '1. Search for demand: Type your idea into Etsy search, TikTok and Google Trends. Existing bestsellers = proven demand, not competition to fear.',
    '2. Audit 10 bestsellers: Note their prices and covers — and the gold mine: 3-star reviews. Other sellers’ complaints are your feature list.',
    '3. Smoke-test it: Post 3 pieces of content or a simple waitlist page about the promise. Any pull (saves, replies, signups) = green light.',
    '4. Build the MVP in one weekend: Version 1 should embarrass you slightly. Ship, learn, upgrade.',
  ];

  curY = 42;
  p5Text.forEach((l) => {
    if (l === '') {
      curY += 3;
    } else {
      const s = doc.splitTextToSize(l, cw);
      doc.text(s, margin, curY);
      curY += s.length * 5.5 + 2;
    }
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'The 2-weekend rule:',
    [
      'Never spend more than two weekends on v1 of a digital product. If it sells, invest more; if it',
      'doesn’t, you lost a weekend — not a quarter.',
    ]
  );

  // ---------------- PAGE 6: STOREFRONT MAP ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Where to Sell: The 5-Minute Storefront Map', 6, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Where to Sell: The 5-Minute Storefront Map', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);

  const buckets = [
    'Three buckets, one starter recipe:',
    '• Marketplaces (they bring traffic, you pay fees): Etsy (~6.5% + listing + processing), Amazon KDP (70% royalty on $2.99–$9.99 ebooks), Creative Market & Envato for design assets, Udemy for courses.',
    '• Your own storefront (you bring traffic, keep margin): Gumroad (10% flat), Payhip (5%, 0% on paid plans), Lemon Squeezy (5% + 50¢, handles global tax as Merchant of Record), Shopify for scale.',
    '• Course & membership hosts: Teachable, Thinkific, Kajabi, Skool, Patreon, Substack — subscription and cohort models.',
  ];

  curY = 44;
  buckets.forEach((b) => {
    const s = doc.splitTextToSize(b, cw);
    doc.text(s, margin, curY);
    curY += s.length * 5.5 + 4;
  });

  drawCallout(
    doc,
    margin,
    curY + 4,
    cw,
    'Starter recipe:',
    [
      'Launch on one marketplace for discovery and set up one owned store for margin and email',
      'capture. The full 30-platform comparison with exact 2026 fees is Appendix A of the Blueprint.',
    ]
  );

  // ---------------- PAGE 7: PRICE IT RIGHT ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Price It Right From Day One', 7, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Price It Right From Day One', margin, 32);

  const priceRules = [
    'Pricing is where beginners quietly lose fortunes — usually by undercharging. The overview rules:',
    '• Start in the $8–18 band for a first product. It captures the impulse-buy sweet spot most Etsy bestsellers live in.',
    '• Charm prices work: $19 beats $20; $97 beats $100.',
    '• Never be the cheapest: Low price reads as low quality. Match the market’s mid-to-upper range.',
    '• Three tiers, always: Basic $19 / Standard $39 (the anchor) / Premium $79. Most buyers land in the middle.',
    '• Bundle to grow: Bundles raise order value 30–60% and rank for their own keywords.',
    '• Price the outcome, not the file: A template that saves 5 hours a month is worth far more than "12 pages of PDF."',
  ];

  curY = 44;
  priceRules.forEach((pr) => {
    const s = doc.splitTextToSize(pr, cw);
    doc.text(s, margin, curY);
    curY += s.length * 5.5 + 2;
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'Raise prices with evidence:',
    [
      'If conversion holds, add $1–2 every few weeks. The full pricing ladder and psychology research',
      'live in Chapter 5.',
    ]
  );

  // ---------------- PAGE 8: FREE TRAFFIC ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Free Traffic: Pick ONE Channel and Go Deep', 8, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Free Traffic: Pick ONE Channel and Go Deep', margin, 32);

  const traffic = [
    'Organic is slow to start and compounds forever. The Blueprint runs full playbooks for nine channels (Part IV); the starter map:',
    '• Pinterest -> printables, planners, Canva templates (pins sell for months)',
    '• TikTok -> Notion templates, AI packs, tools (hook viewers in the first 3 seconds)',
    '• SEO / blogging -> ebooks, courses, B2B templates (the long game; ~53% of all traffic)',
    '• YouTube -> courses and coaching (one good tutorial sells for years)',
    '• LinkedIn -> B2B templates, spreadsheets, professional guides',
    '• Instagram -> visual brands, creators & courses — the portfolio that converts',
    '• Facebook Groups -> printables, planners, craft & home niches; help 30 days, then promo shares',
    '• Threads -> text niches; cross-post your best posts for bonus reach in 15 min/day',
  ];

  curY = 44;
  traffic.forEach((tr) => {
    const s = doc.splitTextToSize(tr, cw);
    doc.text(s, margin, curY);
    curY += s.length * 5.5 + 1.5;
  });

  drawCallout(
    doc,
    margin,
    curY + 4,
    cw,
    'Email is the compound asset:',
    [
      'A one-page lead magnet + a 3-email welcome sequence turns visitors into a list you own.',
      'The full email system -> Chapter 19 in Blueprint.',
    ]
  );

  // ---------------- PAGE 9: PAID ADS ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Paid Ads: The 3 Rules Before You Spend', 9, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Paid Ads: The 3 Rules Before You Spend', margin, 32);

  const ads = [
    'Paid traffic is a paid experiment, not a guaranteed income source. Part V of the Blueprint explains the economics and includes illustrated setup walkthroughs for Meta, Google Search, TikTok website ads and Pinterest.',
    '',
    '1. Know your break-even: Break-even ROAS = 1 ÷ contribution margin. At a 90% margin, that is about 1.11x before fixed costs. Include fees, refunds and variable costs in your margin.',
    '2. Validate the offer first: Organic sales and customer feedback reveal whether people want the product. Ads cannot repair a broken checkout or an unclear offer.',
    '3. Choose one eligible channel: Match the product to buyer intent, available budget and your real business country. Cheap clicks alone do not mean profitable purchases.',
  ];

  curY = 44;
  ads.forEach((a) => {
    if (a === '') {
      curY += 3;
    } else {
      const s = doc.splitTextToSize(a, cw);
      doc.text(s, margin, curY);
      curY += s.length * 5.5 + 2;
    }
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'Go deeper:',
    [
      'Chapter 21 covers tracking tests and spend controls; Chapters 22–25 walk through account setup,',
      'campaign settings, creatives, publishing and monitoring.',
    ]
  );

  // ---------------- PAGE 10: FIRST 30 DAYS ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Your First 30 Days at a Glance', 10, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Your First 30 Days at a Glance', margin, 32);

  const days = [
    '• Week 1 — Validate: Run the weekend test (page 5), pick one product + one channel.',
    '• Week 2 — Build: Ship the MVP: cover, 10-keyword list, one-page sales page, payment link.',
    '• Week 3 — Launch: List on the marketplace, connect the owned store, start the email list with a tiny lead magnet.',
    '• Week 4 — Learn: Publish 12–15 pieces of content, read the numbers, double down on what pulled, iterate the product.',
  ];

  curY = 44;
  days.forEach((d) => {
    const s = doc.splitTextToSize(d, cw);
    doc.text(s, margin, curY);
    curY += s.length * 5.5 + 2;
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'The only 4 numbers to watch in month 1:',
    [
      '• Traffic — are views and clicks growing week over week?',
      '• Conversion — 1%+ of product-page visitors buying is healthy',
      '• Average order value — nudge it with one bundle or upsell',
      '• Email signups — the list is next month’s launch audience',
    ]
  );

  // ---------------- PAGE 11: 5 MISTAKES ----------------
  doc.addPage();
  addHeaderFooter(doc, 'The 5 Mistakes That Keep Beginners at $0', 11, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('The 5 Mistakes That Keep Beginners at $0', margin, 32);

  const mistakes = [
    '1. Building before validating — a month of work, zero demand. Fix: the weekend test.',
    '2. Racing to the bottom on price — $2 products attract the hardest customers. Fix: the $8–18 band + tiers.',
    '3. Spreading across five platforms — five half-done stores beat none of them. Fix: one marketplace + one owned store.',
    '4. No email list — renting attention forever. Fix: capture emails from the first sale and first download.',
    '5. Quitting before week 8 — right before compounding starts. Fix: the 90-day plan and a realistic income ladder.',
  ];

  curY = 44;
  mistakes.forEach((m) => {
    const s = doc.splitTextToSize(m, cw);
    doc.text(s, margin, curY);
    curY += s.length * 5.5 + 3;
  });

  drawCallout(
    doc,
    margin,
    curY + 6,
    cw,
    'Your $0 starter stack:',
    [
      '• Design: Canva (free tier)   • Store: Gumroad or Payhip (free tiers)',
      '• Email: MailerLite or Beehiiv (free tiers)   • Traffic: Pinterest + one short-video app',
      '• Ops: Notion (free) — total spend before first sale: $0',
    ]
  );

  // ---------------- PAGE 12: NEXT STEP CTA ----------------
  doc.addPage();
  // Dark luxury CTA page
  doc.setFillColor(15, 15, 18);
  doc.rect(0, 0, pw, ph, 'F');

  doc.setDrawColor(190, 150, 75);
  doc.setLineWidth(0.6);
  doc.rect(15, 15, pw - 30, ph - 30);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(215, 180, 100);
  doc.text('YOUR NEXT STEP', pw / 2, 40, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(255, 255, 255);
  doc.text('You’ve seen the overview.', pw / 2, 58, { align: 'center' });
  doc.setTextColor(245, 215, 140);
  doc.text('Now get the full system.', pw / 2, 70, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(200, 200, 200);
  const subText = 'The Digital Product Profit Blueprint — 2026 Edition picks up exactly where this kit stops:';
  doc.text(doc.splitTextToSize(subText, cw - 10), pw / 2, 85, { align: 'center' });

  const checkItems = [
    '✓ All 34 chapters across 6 parts — the complete A-to-Z system',
    '✓ Every platform in detail, with exact 2026 fees (30+ compared)',
    '✓ Full organic playbooks: Pinterest, TikTok, Instagram, Facebook Groups & more',
    '✓ Illustrated ad setups: Meta, Google Search, TikTok & Pinterest',
    '✓ Pricing ladders, funnels, launches & the week-by-week 90-day plan',
    '✓ Fee cheat sheet, tools directory & a plain-English glossary',
  ];

  curY = 105;
  checkItems.forEach((ci) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(240, 240, 240);
    doc.text(ci, margin + 8, curY);
    curY += 9;
  });

  // Big CTA Button Box
  doc.setFillColor(210, 165, 80);
  doc.roundedRect(pw / 2 - 60, curY + 12, 120, 16, 8, 8, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(20, 20, 20);
  doc.text('GET THE BLUEPRINT — ₹299 ->', pw / 2, curY + 22.5, { align: 'center' });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(170, 170, 170);
  doc.text('Available in your BookGenie digital store and eBook library.', pw / 2, curY + 40, {
    align: 'center',
  });

  return doc.output('arraybuffer') as unknown as Uint8Array;
}

export async function generateBlueprintPdf(): Promise<Uint8Array> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const margin = 20;
  const cw = pw - margin * 2;
  const totalPages = 96;

  // ---------------- PAGE 1: COVER ----------------
  doc.setFillColor(12, 12, 15);
  doc.rect(0, 0, pw, ph, 'F');

  // Double golden border
  doc.setDrawColor(195, 155, 70);
  doc.setLineWidth(1);
  doc.rect(12, 12, pw - 24, ph - 24);
  doc.setLineWidth(0.4);
  doc.rect(15, 15, pw - 30, ph - 30);

  // Top pill
  doc.setFillColor(24, 22, 20);
  doc.roundedRect(pw / 2 - 55, 30, 110, 10, 5, 5, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(240, 210, 130);
  doc.text('THE COMPLETE SYSTEM • 2026 EDITION', pw / 2, 36.5, { align: 'center' });

  // Main Title
  doc.setFont('times', 'bold');
  doc.setFontSize(30);
  doc.setTextColor(245, 215, 140);
  doc.text('THE DIGITAL PRODUCT', pw / 2, 65, { align: 'center' });
  doc.setFontSize(38);
  doc.text('PROFIT BLUEPRINT', pw / 2, 82, { align: 'center' });

  doc.setDrawColor(195, 155, 70);
  doc.line(pw / 2 - 35, 92, pw / 2 + 35, 92);

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(230, 230, 230);
  const sub = doc.splitTextToSize(
    'The Complete 2026 Manual for Making Money Selling Digital Products — Organically and With Paid Ads',
    cw - 20
  );
  doc.text(sub, pw / 2, 104, { align: 'center' });

  // Center Emblem
  doc.setDrawColor(195, 155, 70);
  doc.circle(pw / 2, 185, 42, 'S');
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(230, 195, 120);
  doc.text('34 CHAPTERS', pw / 2, 178, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(190, 190, 190);
  doc.text('6 Master Sections', pw / 2, 186, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setTextColor(215, 180, 100);
  doc.text('8 Illustrated Ad Setups', pw / 2, 194, { align: 'center' });

  // Bottom text
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(230, 195, 120);
  doc.text(
    '34 CHAPTERS • EVERY PLATFORM • 8 ILLUSTRATED AD SETUPS • 90-DAY PLAN',
    pw / 2,
    ph - 24,
    { align: 'center' }
  );

  // ---------------- PAGE 2: TABLE OF CONTENTS (Part 1) ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Table of Contents', 2, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);
  doc.text('Table of Contents', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);

  const tocItems = [
    ['How to Use This Book', '10'],
    ['Chapter 1: Why Digital Products in 2026', '11'],
    ['Chapter 2: What Sells — The 2026 Product Catalog', '13'],
    ['Chapter 3: Find Your Profitable Idea (and Prove It)', '16'],
    ['Chapter 4: Create Your Product Like a Pro', '19'],
    ['Chapter 5: Price It Right', '22'],
    ['Chapter 6: The Business Side (Do This Once, Properly)', '24'],
    ['Chapter 7: The Platform Landscape', '27'],
    ['Chapter 8: Direct-Sale Storefronts (Detailed Playbooks)', '30'],
    ['Chapter 9: Course & Community Platforms (Detailed)', '33'],
    ['Chapter 10: Marketplaces with Built-in Traffic (Detailed)', '35'],
    ['Chapter 11: Self-Hosted Stores (Maximum Control)', '37'],
    ['Chapter 12: The Organic Growth Engine', '40'],
    ['Chapter 13: SEO & Blogging — Traffic That Compounds for Years', '42'],
    ['Chapter 14: Pinterest — The Visual Search Engine That Sells Printables', '44'],
    ['Chapter 15: TikTok — Organic Reach Without a Following', '46'],
    ['Chapter 16: Instagram — The Portfolio That Converts', '48'],
    ['Chapter 17: YouTube — The Compounding Trust Machine', '49'],
    ['Chapter 18: X, LinkedIn, Threads, Facebook & Communities', '50'],
    ['Chapter 19: Email Marketing — The Channel You Actually Own', '52'],
    ['Chapter 20: Marketplace SEO — Etsy & Amazon in Full Detail', '54'],
    ['Chapter 21: Paid Ads Fundamentals — The Math Before the Ads', '58'],
    ['Chapter 22: Meta Ads (Facebook + Instagram) — Setup & Optimization', '64'],
    ['Chapter 23: Google Ads — Search Setup for Digital Products', '68'],
    ['Chapter 24: TikTok Ads — Website Sales Setup', '72'],
    ['Chapter 25: Pinterest Ads — Website Conversion Setup', '75'],
    ['Chapter 26: Other Paid Channels (Reddit, LinkedIn, X, Snapchat, Display)', '78'],
    ['Chapter 27: Marketplace Ads (Etsy Ads & Amazon Ads)', '80'],
    ['Chapter 28: The Scaling System — How Winners Manage Paid Growth', '82'],
    ['Chapter 29: The Launch Playbook', '85'],
    ['Chapter 30: Funnel Architecture — Revenue per Visitor', '87'],
    ['Chapter 31: Metrics & Analytics — Know Your Numbers', '88'],
    ['Chapter 32: The 90-Day Action Plan', '89'],
    ['Chapter 33: Realistic Expectations & Mini Case Snapshots', '91'],
    ['Chapter 34: Mistakes, Risks & How to Avoid Them', '92'],
    ['Appendix A: Platform Fee Cheat Sheet (2026)', '93'],
    ['Appendix B: Tools Directory', '95'],
    ['Appendix C: Glossary', '96'],
  ];

  let tocY = 44;
  tocItems.forEach(([itemTitle, pNum]) => {
    doc.text(itemTitle, margin, tocY);
    doc.text(pNum, pw - margin, tocY, { align: 'right' });
    doc.setDrawColor(230, 230, 230);
    doc.line(margin + doc.getTextWidth(itemTitle) + 3, tocY - 1, pw - margin - 8, tocY - 1);
    tocY += 5.8;
  });

  // ---------------- PAGE 3: PART I - THE OPPORTUNITY ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Part I: The Opportunity', 3, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(25, 25, 25);
  doc.text('Chapter 1: Why Digital Products in 2026', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);

  const ch1Text = [
    'A digital product is any product delivered electronically that you create once and sell an unlimited number of times: an ebook, a video course, a Canva template, a Notion dashboard, a spreadsheet tool, a preset pack, a piece of software, a paid community, a prompt library.',
    '',
    'The economics are unlike almost any other business:',
    '• Near-zero marginal cost: The 1,000th sale costs the same to fulfill as the first: nothing. No inventory, no shipping, no manufacturing. Margins of 85–95% are normal.',
    '• Instant, global delivery: A buyer in Berlin gets the file one second after checkout. You can sell to every country on earth from day one.',
    '• No returns logistics: Refunds exist, but there is no reverse shipping.',
    '• Compounding assets: A product you make in 2026 can still sell in 2031. A blog post or pin that promotes it can send buyers for years.',
    '',
    'The market is large and still growing:',
    '• The global online courses market alone is estimated at roughly $200 billion, with e-learning services growing at about 19.9% CAGR.',
    '• Ebooks are projected to reach 1.2 billion global users by 2027.',
    '• AI-related digital products are the fastest-growing category: generative AI tooling is compounding at roughly 37% CAGR.',
  ];

  let p3Y = 44;
  ch1Text.forEach((p) => {
    if (p === '') {
      p3Y += 3;
    } else {
      const s = doc.splitTextToSize(p, cw);
      doc.text(s, margin, p3Y);
      p3Y += s.length * 5.2 + 2;
    }
  });

  drawCallout(
    doc,
    margin,
    p3Y + 4,
    cw,
    'Mindset Check:',
    [
      'Digital products are "passive income" only after they are built and only if something keeps sending buyers.',
      'The realistic description is: high-leverage income. You do the hard work once, then maintain and market.',
      'If you can commit 5–10 focused hours a week for 90 days, this model works.',
    ]
  );

  // ---------------- PAGE 4: CHAPTER 21 - PAID ADS FUNDAMENTALS ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Part V: Paid Methods — Chapter 21', 4, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Chapter 21: Paid Ads Fundamentals', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);

  const ch21Text = [
    'Paid advertising buys opportunities to sell; it does not guarantee sales. Start with an offer customers understand, a working checkout and a loss limit you can afford.',
    '',
    'The Four Numbers That Decide Your Budget:',
    '1. Average Order Value (AOV): Revenue divided by orders. Use actual revenue, not the highest-priced item on your sales page.',
    '2. Cost Per Acquisition (CPA/CAC): Ad spend divided by attributed purchases or new customers.',
    '3. Break-Even Acquisition Cost: Net contribution per order before advertising. At $27 revenue and an assumed 90% contribution margin, that is $24.30.',
    '4. ROAS (Return On Ad Spend): Attributed revenue divided by ad spend. At that same 90% margin, break-even ROAS is about 1.11.',
    '',
    'Use the CPC sanity check: Target CPA x purchase conversion rate = approximate affordable cost per click.',
    'At a $15 target CPA and a 2% purchase rate, affordable CPC is $0.30. At $1 CPC with the same conversion rate, expected CPA is $50.',
  ];

  let p4Y = 44;
  ch21Text.forEach((p) => {
    if (p === '') {
      p4Y += 3;
    } else {
      const s = doc.splitTextToSize(p, cw);
      doc.text(s, margin, p4Y);
      p4Y += s.length * 5.2 + 2;
    }
  });

  drawCallout(
    doc,
    margin,
    p4Y + 6,
    cw,
    'Tracking QA: One Order, One Counted Purchase',
    [
      '• Refresh test: Reloading a receipt page must never fire a second purchase conversion.',
      '• Server/Browser: Same purchase must be deduplicated via event_id.',
      '• Verify actual transaction currency and ISO values before turning on scale.',
    ]
  );

  // ---------------- PAGE 5: CHAPTER 32 - 90-DAY ACTION PLAN ----------------
  doc.addPage();
  addHeaderFooter(doc, 'Part VI: Launch & Systems — 90-Day Plan', 5, totalPages);

  doc.setFont('times', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(25, 25, 25);
  doc.text('Chapter 32: The 90-Day Action Plan', margin, 32);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);

  const plan = [
    'Days 1–30: Foundation',
    '• Week 1: Choose niche & product using validation (3/5 signals). Set up 1 direct platform (Payhip/Gumroad) + 1 marketplace (Etsy/KDP).',
    '• Week 2: Build product v1. Set up email tool + lead magnet concept. Study 5 competitors; write positioning sentence.',
    '• Week 3: Finish product + mockups + README + walkthrough video. Beta test with 3–5 humans.',
    '• Week 4: PUBLISH. Ask first buyers for honest reviews. Post 3 short videos + 5 pins + 2 community answers.',
    '',
    'Days 31–60: Traffic & Traction',
    '• Week 5: Organic OS begins. First SEO blog post. 10 pins/week, 3 videos/week.',
    '• Week 6: Second product or bundle (raise AOV). Implement order bump + thank-you upsell.',
    '• Week 7: Pinterest full cadence. YouTube first long-form video. Reach out to 10 micro-creators/affiliates.',
    '• Week 8: Analyze month-1 numbers. Kill what flopped; double what worked. Test +10% price on best converter.',
    '',
    'Days 61–90: Amplify & Scale',
    '• Week 9: First paid tests (Pinterest Ads $15/day or Meta retargeting $10/day). Pixel/CAPI verified first.',
    '• Week 10: First promo event (72-hour sale to your list). Collect testimonials systematically.',
    '• Week 11: Double down on the winning channel. Product v2.0 upgrade for best seller.',
    '• Week 12: Quarterly review. Set next 90-day goals. Raise prices on proven winners.',
  ];

  let p5Y = 44;
  plan.forEach((pl) => {
    if (pl === '') {
      p5Y += 3;
    } else {
      const s = doc.splitTextToSize(pl, cw);
      doc.text(s, margin, p5Y);
      p5Y += s.length * 5.2 + 1.5;
    }
  });

  drawCallout(
    doc,
    margin,
    p5Y + 6,
    cw,
    'Day-90 Milestone Target:',
    [
      '2–3 traffic sources running  •  $500–2,500/month run rate  •  Email list 250–800 subscribers',
      'At least one profitable channel with compounding growth. A system you run on 5–8 hours/week.',
    ]
  );

  return doc.output('arraybuffer') as unknown as Uint8Array;
}
