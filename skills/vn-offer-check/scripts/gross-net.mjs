#!/usr/bin/env node
// Gross ⇄ Net ordinary resident payroll in Vietnam (Vietnamese employee, labour contract ≥ 3 months).
// Rates: see ../references/vn-payroll.md. Update RATES, AS_OF and VERIFIED_ON together when the law changes.
// No dependencies; Node 18+.

import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Date the newest rate below took effect.
const AS_OF = "2026-07-01";
// Date the rates were last checked against primary sources.
export const VERIFIED_ON = "2026-11-09";

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

function validate(amount, { dependents = 0, region = 1, insuranceBase } = {}) {
  if (!Number.isFinite(amount) || amount < 0) throw new RangeError("Salary must be a finite non-negative VND amount.");
  if (!Number.isInteger(dependents) || dependents < 0) throw new RangeError("Dependents must be a non-negative integer.");
  if (!Number.isInteger(region) || !(region in RATES.regionalMinWage)) throw new RangeError("Region must be 1, 2, 3, or 4.");
  if (insuranceBase !== undefined && (!Number.isFinite(insuranceBase) || insuranceBase < 0)) {
    throw new RangeError("Insurance base must be a finite non-negative amount.");
  }
}

export function fromGross(gross, { dependents = 0, region = 1, insuranceBase } = {}) {
  validate(gross, { dependents, region, insuranceBase });
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
    verifiedOn: VERIFIED_ON,
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
  validate(net, opts);
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

/** True when this file is the script node was started with, also through a symlink or a path with spaces or accents. */
function isMain() {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

function main() {
  const a = parseArgs(process.argv.slice(2));
  if (a.help) {
    console.log(USAGE);
    return 0;
  }
  if ((a.gross === undefined) === (a.net === undefined)) {
    console.error(USAGE);
    return 1;
  }
  const opts = {
    dependents: a.dependents ?? 0,
    region: a.region ?? 1,
    insuranceBase: a["insurance-base"],
  };
  let r;
  try {
    r = a.gross !== undefined ? fromGross(a.gross, opts) : fromNet(a.net, opts);
  } catch (error) {
    if (!(error instanceof RangeError)) throw error;
    console.error(`${error.message}\n\n${USAGE}`);
    return 1;
  }
  if (a.json) {
    console.log(JSON.stringify(r, null, 2));
    return 0;
  }
  console.log(`Rates in effect since ${r.asOf}, checked on ${r.verifiedOn} (VND/month)`);
  console.log(`Gross            ${fmt(r.gross)}`);
  console.log(`- Social ins 8%  ${fmt(r.insurance.social)}`);
  console.log(`- Health ins 1.5% ${fmt(r.insurance.health)}`);
  console.log(`- Unemploy 1%    ${fmt(r.insurance.unemployment)}`);
  console.log(`Deductions       ${fmt(r.deductions)} (${opts.dependents} dependent(s))`);
  console.log(`Taxable income   ${fmt(r.taxable)}`);
  console.log(`- PIT            ${fmt(r.tax)}`);
  console.log(`Net              ${fmt(r.net)}`);
  return 0;
}

if (isMain()) process.exitCode = main();
