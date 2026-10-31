#!/usr/bin/env node
// Gross ⇄ Net monthly salary for an employee in Vietnam (Vietnamese tax resident, labour contract ≥ 1 month).
// Rates: see ../references/vn-payroll.md. Update RATES and AS_OF together when the law changes.
//

// Date the newest rate below took effect.
const AS_OF = "2026-07-01";

const USAGE = `Usage: node gross-net.mjs (--gross N | --net N) [options]   (VND per month)

  --dependents N      registered dependents (default 0)
  --region 1-4        regional minimum wage region (default 1: most of Hà Nội, TP.HCM)
  --insurance-base N  salary declared for insurance, when lower than gross (default: gross)
  --json              machine-readable output`;

const RATES = {
  personalDeduction: 15_500_000,
  dependentDeduction: 6_200_000,
  // Employee shares of compulsory insurance.
  socialInsurance: 0.08,
  healthInsurance: 0.015,
  unemploymentInsurance: 0.01,
  // Social + health insurance base is capped at 20 × the reference salary (lương cơ sở 2,530,000).
  socialHealthCap: 20 * 2_530_000,
  // Unemployment insurance base is capped at 20 × the regional minimum wage.
  regionalMinWage: { 1: 5_310_000, 2: 4_730_000, 3: 4_140_000, 4: 3_700_000 },
  // Monthly progressive PIT on taxable income: [upper bound, rate].
  brackets: [
    [10_000_000, 0.05],
    [30_000_000, 0.1],
    [60_000_000, 0.2],
    [100_000_000, 0.3],
    [Infinity, 0.35],
  ],
};

function pit(taxable) {
  let tax = 0;
  let lower = 0;
  for (const [upper, rate] of RATES.brackets) {
    if (taxable <= lower) break;
    tax += (Math.min(taxable, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

export function fromGross(gross, { dependents = 0, region = 1, insuranceBase } = {}) {
  const base = insuranceBase ?? gross;
  const socialHealthBase = Math.min(base, RATES.socialHealthCap);
  const unemploymentBase = Math.min(base, 20 * RATES.regionalMinWage[region]);
  const insurance = {
    social: socialHealthBase * RATES.socialInsurance,
    health: socialHealthBase * RATES.healthInsurance,
    unemployment: unemploymentBase * RATES.unemploymentInsurance,
  };
  const insuranceTotal = insurance.social + insurance.health + insurance.unemployment;
  const deductions = RATES.personalDeduction + dependents * RATES.dependentDeduction;
  const taxable = Math.max(0, gross - insuranceTotal - deductions);
  const tax = pit(taxable);
  return {
    asOf: AS_OF,
    gross: Math.round(gross),
    insurance: Object.fromEntries(Object.entries(insurance).map(([k, v]) => [k, Math.round(v)])),
    insuranceTotal: Math.round(insuranceTotal),
    deductions,
    taxable: Math.round(taxable),
    tax: Math.round(tax),
    net: Math.round(gross - insuranceTotal - tax),
  };
}

// Net is monotonic in gross, so bisect.
export function fromNet(net, opts = {}) {
  let lo = net;
  let hi = net * 2 + 10_000_000;
  for (let i = 0; i < 100 && hi - lo > 1; i++) {
    const mid = (lo + hi) / 2;
    if (fromGross(mid, opts).net < net) lo = mid;
    else hi = mid;
  }
  return fromGross(Math.ceil(hi), opts);
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, "");
    if (key === "json" || key === "help") args[key] = true;
    else args[key] = Number(argv[++i]);
  }
  return args;
}

function fmt(n) {
  return n.toLocaleString("en-US");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) {
    console.log(USAGE);
    process.exit(0);
  }
  const opts = {
    dependents: a.dependents ?? 0,
    region: a.region ?? 1,
    insuranceBase: a["insurance-base"],
  };
  if (!(opts.region in RATES.regionalMinWage) || (a.gross === undefined) === (a.net === undefined)) {
    console.error(USAGE);
    process.exit(1);
  }
  const r = a.gross !== undefined ? fromGross(a.gross, opts) : fromNet(a.net, opts);
  if (a.json) {
    console.log(JSON.stringify(r, null, 2));
  } else {
    console.log(`Rates in effect since ${r.asOf} (VND/month)`);
    console.log(`Gross            ${fmt(r.gross)}`);
    console.log(`- Social ins 8%  ${fmt(r.insurance.social)}`);
    console.log(`- Health ins 1.5% ${fmt(r.insurance.health)}`);
    console.log(`- Unemploy 1%    ${fmt(r.insurance.unemployment)}`);
    console.log(`Deductions       ${fmt(r.deductions)} (${opts.dependents} dependent(s))`);
    console.log(`Taxable income   ${fmt(r.taxable)}`);
    console.log(`- PIT            ${fmt(r.tax)}`);
    console.log(`Net              ${fmt(r.net)}`);
  }
}
