# Vietnam payroll and labour rules for an offer review

As of 2026-10-31. Figures change by decree, often on 1 January or 1 July: before quoting one, check whether a newer decree exists. `scripts/gross-net.mjs` holds the same numbers; update both together.

Scope: an employee who is a Vietnamese tax resident, on a labour contract of 1 month or longer. Foreigners, freelancers and contracts under 3 months (flat 10% withholding) follow other rules: say so and do not run the calculator for them.

## Personal income tax on salary

From the 2026 tax period:

- Deductions: 15,500,000/month for the taxpayer, 6,200,000/month per registered dependent ([Quốc hội](https://quochoi.vn/tintuc/Pages/tin-hoat-dong-cua-quoc-hoi.aspx?ItemID=96140)).
- Progressive schedule, 5 brackets, on monthly taxable income ([Cục Thuế TP.HCM](https://tphcm.gdt.gov.vn/wps/wcm/connect/TPHCM/site/news/cucthue/246e1161-c9a4-4020-a9a3-cc7b0b965094?presentationTemplate=Lib/pt_new_detail_print)):

  | Taxable income / month | Rate |
  |---|---|
  | up to 10 million | 5% |
  | 10–30 million | 10% |
  | 30–60 million | 20% |
  | 60–100 million | 30% |
  | above 100 million | 35% |

- Taxable income = gross − employee insurance − deductions. A 13th-month salary or bonus is taxed in the month it is paid, so that month's net is lower than a plain twelfth.

## Compulsory insurance, employee share

- Social insurance 8%, health insurance 1.5%, unemployment insurance 1% of the insurance salary base (employer pays about 21.5% on top; this is not deducted from the employee).
- Caps on the base:
  - social + health: 20 × reference salary = 50,600,000 (reference salary 2,530,000 from 2026-07-01; 46,800,000 before) ([BHXH Hà Nội](https://hanoi.baohiemxahoi.gov.vn/tintuc/Pages/chinh-sach-moi.aspx?CateID=0&ItemID=36492));
  - unemployment: 20 × regional minimum wage.
- Regional minimum wage from 2026-01-01 (Nghị định 293/2025/NĐ-CP): region I 5,310,000; II 4,730,000; III 4,140,000; IV 3,700,000. Most of Hà Nội and TP.HCM is region I; the decree's annex lists each ward and commune.
- **Insurance base below the real salary** is common: the employer declares a lower "lương đóng bảo hiểm" and pays the rest as allowances. Net is higher today, but pension, sick and maternity pay, and unemployment benefit are all computed on the declared base. Ask the employer for the figure; run the calculator with `--insurance-base`.

## Labour Code 2019 points that come up in offers

- **Probation**: at most 60 days for a role that needs a college degree or higher (180 days for enterprise managers, 30 for technician-level roles); pay at least 85% of the official salary. One probation per role.
- **Resignation notice by the employee**: 45 days on an indefinite-term contract, 30 days on a 12–36 month fixed-term contract, 3 working days under 12 months. A contract clause asking for more is not enforceable against the employee, but leaving early without notice can cost severance rights and pay in lieu.
- **13th-month salary** is not required by law: it is whatever the contract or the company's policy says. If the offer counts it in "annual package", ask whether it is guaranteed or performance-based.
- **Fixed-term contracts**: at most two in a row; the third must be indefinite-term.
- **Annual leave**: at least 12 working days a year for normal work, plus 1 day per 5 years of service.

## Gross, Net and USD offers

- "Net" offers mean the employer pays tax and insurance on top; check whether the Net figure is guaranteed if tax rules change (they did in 2026).
- USD offers are usually paid in VND at a stated rate or the day's rate; ask which, since exchange rate swings move the net.
