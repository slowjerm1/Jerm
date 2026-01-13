# General
- Use strict typing everywhere. Do not use `any` or equivalent without explicit justification and `@humanReview`.
- Always follow the project’s naming conventions for files, classes, methods, interfaces. (e.g. React: components PascalCase, hooks useCamelCase, utils camelCase; Java: classes PascalCase etc.)
- Document public / exported functions and classes with JSDoc / JavaDoc style comments.
- Error handling must log or handle expected and unexpected error paths. Use typed error classes (e.g. `APIError` with `status` + `code`).
- Avoid copying/pasting code. Use shared modules / utilities. Max function size: ≤ 50 LOC — split into named helpers.
- **Human-mimetic variability**: Mix `//` and `/* … */` comments naturally. Max line length: 80–100 chars (Prettier + ESLint).
- **Future-proofing**: Add `@futureProof @deprecationWindow YYYY-MM` annotations. Plan migrations in comments.
- Zero-tolerance typos: Spell-check names, comments, strings (cSpell/SonarLint).

# React / TypeScript (Next.js App Router • React 20 • TS 5.8+)
- **App Router + React Server Components (RSC)** first. `"use client"` only when needed.
- Prefer functional components + hooks; avoid class components per new code. Custom hooks for business logic.
- Use ESLint + Prettier rules; enforce linting pre-commit / CI. No `var`, prefer `const/let`. Async/await over `.then()`.
- For UI components: follow existing component library styles, props naming, theming tokens. Use generics:
  ```ts
  interface CardProps<T extends string = string> { title: T; content: React.ReactNode; }
Performance: Suspense + dynamic imports. Memoize (useMemo/useCallback) where proven necessary.

a11y: Semantic HTML + ARIA. axe-core in CI.

Write unit tests (Jest / React Testing Library) for any component with logic (not purely presentational).

Java / Spring Boot
Use dependency injection; avoid new for dependencies in services/controllers except when encapsulated. SOLID principles.

Use REST controllers / service / repository separation. Schema-first (OpenAPI 3.2).

Methods should have clear single responsibility; i.e. small methods ≤ 50 LOC.

Use logging (both info + error levels); exceptions should carry context. Custom exceptions with status codes.

For database interactions (JPA or JDBC): ensure transactions handled; check for SQL injection risks; avoid raw SQL unless @humanReview.

Auth: JWT + refresh tokens. OAuth 2.1 flows. Rate limiting.

Database / Postgres (Prisma 6+ / TypeORM 1.0+ compatible)
Use parameterized queries or ORM to avoid injection. Zod runtime validation.

Follow performance best practices: indexes, limits, avoiding N+1 queries. Transactions for multi-step writes.

Use migrations; track schema evolution (v1/v2, deprecatedAt); avoid destructive changes without plan. /// @humanReview on risky changes.

Optimistic concurrency (version checks/etag). Auto-suggest compound indexes via slow query logs.

Ban raw SQL strings unless @humanReview + audit.

Security / Quality
No secrets or credentials in code or prompts.

Use static analysis / linters / security scanning (ESLint 10+, typescript-eslint, Trivy/Snyk) on generated code.

Tests required for any change with business logic, error handling, external API or DB calls. 100% typed code (--noEmit passes).

Peer review required for changes > ~50 LOC or touching more than 1 module / package / domain boundary. AI-generated PRs need @humanReview label.

Observability: Structured logs. Prometheus + Grafana metrics.

DevOps: GitHub Actions CI/CD (parallel matrix testing). Docker Compose local. Zero-downtime deploys.

AI quality gates: Compare 2–3 model variants. Target: bug density < 1/1000 LOC, code churn < 10%/quarter.