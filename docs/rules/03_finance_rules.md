# Module Rules: Finance, Billing & General Ledger

## 1. Fee Challan Generation Invariants
* Fee challans must be generated using `FeeStructure` and `FeeStructureItem` templates for the student's program and semester.
* Any valid `ScholarshipAward` active for the term must be deducted before finalizing `totalAmount` (`totalAmount = baseAmount - discountAmount`).
* Every generated challan must have a unique `challanNumber` in format `CHL-YYYY-XXXXXX`.

## 2. Payment Processing & Idempotency
* All payment capture endpoints must accept an `X-Idempotency-Key` to prevent duplicate charges or double receipts.
* When a payment is verified:
  1. `Payment` record is created with payment method and reference.
  2. `FeeChallan.paidAmount` is updated.
  3. If `paidAmount >= totalAmount`, `FeeChallan.status` becomes `PAID`; if `paidAmount > 0`, it becomes `PARTIAL`.
  4. Corresponding `Transaction` is logged in General Ledger (`Account`).
  5. The entire operation must execute inside an atomic `prisma.$transaction`.

## 3. Late Fee Policy
* If `CurrentDate > FeeChallan.dueDate` and `status != PAID`:
  * Apply late fee amount specified in institutional settings.
  * Update `FeeChallan.lateFee` and `FeeChallan.totalAmount`.
  * Set `FeeChallan.status = OVERDUE`.
