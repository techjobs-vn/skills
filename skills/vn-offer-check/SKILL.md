---
name: vn-offer-check
description: Review a job offer or salary in Vietnam — convert Gross ⇄ Net with current tax and social insurance (BHXH, BHYT, BHTN), compare offers on the same basis, and flag contract terms (probation, notice period, 13th-month salary, insurance base). Use when the user asks "lương gross/net bao nhiêu", compares offers, negotiates salary, or reviews an offer letter or labour contract in Vietnam.
---

# Vietnam offer check

Put every offer on one basis, show the arithmetic, and list the questions the user should ask the employer before signing. This is a calculation and a checklist, not legal or tax advice: say so once, and point to an accountant or lawyer for disputes.

Read [references/vn-payroll.md](references/vn-payroll.md) for the rates, caps and Labour Code rules before quoting any figure.

## 1. Collect the offer

From the offer letter, contract or the user's words, write down for each offer:

- salary and whether it is **Gross or Net**, VND or USD (and the exchange-rate rule);
- insurance salary base, if it differs from salary;
- 13th month or bonus: guaranteed, or depends on performance;
- allowances (lunch, parking, phone), stock or ESOP, sign-on bonus;
- probation length and pay; contract type and length; notice period; work mode and hours;
- the user's region (1–4) and number of registered dependents.

Ask for what is missing that changes the number (Gross/Net, dependents, insurance base). Done when each offer has every field filled or marked "unknown".

## 2. Compute

Run the calculator by its absolute path, `<this skill's directory>/scripts/gross-net.mjs` (Node 18+, no dependencies; `--help` lists the options); never do the tax arithmetic by hand:

```bash
node <skill-dir>/scripts/gross-net.mjs --gross 40000000 --dependents 1 --region 1
node <skill-dir>/scripts/gross-net.mjs --net 30000000 --insurance-base 15000000
```

`--insurance-base` works with `--net` too. Without a shell, apply the rules in the reference file step by step and show each line.

For each offer produce: monthly gross, monthly net, and **first-year net**:

- probation months: run the calculator on probation gross (the agreed share of gross, at least 85%), keeping the insurance base the contract states;
- remaining months at full net;
- plus bonuses that are guaranteed: run a 13th month as that month's gross plus the bonus, and add the difference in net. A bonus marked "unknown" counts as 0, and the table says so.

## 3. Compare and flag

A table, one column per offer: monthly gross, monthly net, yearly net in the first year, guaranteed part versus variable part.

Then the flags, each with the question to send the employer:

- insurance base below salary → lower pension, sick and unemployment benefits;
- probation longer or paid less than the legal limits;
- notice period longer than the law requires of the employee;
- 13th month or bonus only "up to" or "based on performance";
- Net offer with no clause on who absorbs future tax changes;
- USD salary with no exchange-rate rule.

Done when every offer is in the table and every flag found has its question.

## 4. Negotiate (when asked)

- Anchor on **gross** and on yearly net, not on the monthly net the employer quotes.
- Market range: `search_jobs` (techjobs.vn MCP) for the same role, seniority and city; few JDs list salary, so treat it as a rough signal and say so.
- Draft the reply for the user to send; the agent never sends it.
