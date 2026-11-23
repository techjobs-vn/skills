import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { after, describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { fromGross, fromNet, VERIFIED_ON } from "../tools/gross-net.mjs";

const SCRIPT = fileURLToPath(new URL("../tools/gross-net.mjs", import.meta.url));

describe("resident payroll estimates", () => {
  it("applies independently stated 2026 PIT bracket boundaries", () => {
    for (const [gross, tax] of [[15500000, 0], [25500000, 500000], [45500000, 2500000], [75500000, 8500000], [115500000, 20500000], [125500000, 24000000]]) {
      assert.equal(fromGross(gross, { insuranceBase: 0 }).tax, tax);
    }
  });

  it("accounts for insurance, dependents and capped bases", () => {
    const r = fromGross(40000000, { dependents: 1 });
    assert.equal(r.insuranceTotal, 4200000);
    assert.equal(r.tax, 910000);
    assert.equal(r.net, 34890000);
    const high = fromGross(200000000, { region: 1 });
    assert.equal(high.insurance.social, 4048000);
    assert.equal(high.insurance.health, 759000);
    assert.equal(high.insurance.unemployment, 1062000);
    assert.equal(r.verifiedOn, VERIFIED_ON);
  });

  it("round-trips net and gross with a fixed insurance base", () => {
    for (const gross of [20000000, 40000000, 80000000, 150000000]) {
      const opts = { insuranceBase: 15000000, dependents: 1, region: 2 };
      const forward = fromGross(gross, opts);
      const reverse = fromNet(forward.net, opts);
      assert.ok(Math.abs(reverse.net - forward.net) <= 1);
      assert.ok(Math.abs(reverse.gross - gross) <= 2);
    }
  });

  it("rejects invalid numeric inputs", () => {
    for (const salary of [NaN, Infinity, -1]) assert.throws(() => fromGross(salary), RangeError);
    assert.throws(() => fromNet(-1), RangeError);
    assert.throws(() => fromGross(40000000, { dependents: 1.5 }), RangeError);
    assert.throws(() => fromGross(40000000, { insuranceBase: -1 }), RangeError);
    assert.throws(() => fromGross(40000000, { region: 5 }), RangeError);
  });
});

describe("command line", () => {
  // A folder with a space and Vietnamese accents, holding a symlink to the script: the
  // shapes the old `import.meta.url === file://argv[1]` check silently ignored.
  const dir = mkdtempSync(path.join(tmpdir(), "thư mục có dấu cách "));
  const link = path.join(dir, "gross-net.mjs");
  symlinkSync(SCRIPT, link);
  after(() => rmSync(dir, { recursive: true, force: true }));

  for (const [label, script] of [["real path", SCRIPT], ["symlink in an accented folder", link]]) {
    it(`prints JSON when run by its ${label}`, () => {
      const out = execFileSync(process.execPath, [script, "--gross", "40000000", "--dependents", "1", "--json"], { encoding: "utf8" });
      const r = JSON.parse(out);
      assert.equal(r.net, 34890000);
      assert.equal(r.verifiedOn, VERIFIED_ON);
    });
  }

  it("prints the check date in text mode", () => {
    const out = execFileSync(process.execPath, [SCRIPT, "--net", "30000000"], { encoding: "utf8" });
    assert.match(out, new RegExp(`checked on ${VERIFIED_ON}`));
  });

  it("exits 1 with a message, not a stack trace, on a bad region", () => {
    const run = spawnSync(process.execPath, [SCRIPT, "--gross", "40000000", "--region", "5"], { encoding: "utf8" });
    assert.equal(run.status, 1);
    assert.match(run.stderr, /Region must be 1, 2, 3, or 4\./);
    assert.doesNotMatch(run.stderr, /at fromGross|RangeError:/);
  });

  it("exits 1 with the usage when neither or both amounts are given", () => {
    for (const args of [[], ["--gross", "1", "--net", "1"]]) {
      const run = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: "utf8" });
      assert.equal(run.status, 1);
      assert.match(run.stderr, /^Usage:/);
    }
  });
});
