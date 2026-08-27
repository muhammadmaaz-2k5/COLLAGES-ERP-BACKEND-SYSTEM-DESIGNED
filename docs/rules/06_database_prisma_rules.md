# Module Rules: Database & Prisma ORM

## 1. Frozen Schema Enforcement
* Under no circumstances should `schema.prisma` be modified for convenience without architectural review.
* Use the existing indexes (`@@index([studentId])`, `@@unique([courseId, semesterId, section])`) for query performance.

## 2. Multi-Entity Mutations & Transactions
* Any business flow modifying more than one table must be wrapped in `prisma.$transaction`:
  ```typescript
  await prisma.$transaction(async (tx) => {
    // 1. Create payment
    const payment = await tx.payment.create({ ... });
    // 2. Update challan status
    await tx.feeChallan.update({ ... });
    // 3. Insert ledger entry
    await tx.transaction.create({ ... });
  });
  ```

## 3. Query Optimization & Projection
* Never use raw `select *` in high-volume queries; always explicitly project required fields with `select: { id: true, name: true, ... }`.
* Deep nested queries (more than 3 levels of `include`) are prohibited in high-traffic endpoints; split into targeted batch queries or optimized database views.
