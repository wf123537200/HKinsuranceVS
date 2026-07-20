# Unit tests

Unit tests for the insurance project. Run them locally before every push:

```bash
npm test
```

Watch mode (re-runs on save):

```bash
npm run test:watch
```

## What's covered

- `middleware.test.ts` — i18n routing logic (Googlebot detection, locale prefix handling)
- `locale-cookie.test.ts` — language-switch cookie + URL builder
- `seo.test.ts` — `siteUrl()`, `localizedUrl()` helpers from `lib/seo.ts`
- `data-utils.test.ts` — registry JSON / CSV integrity

## Pre-push hook (optional)

Hook up the test runner so it runs before every `git push`:

### PowerShell (Windows)
```powershell
New-Item -ItemType SymbolicLink -Path .git/hooks/pre-push -Target (Resolve-Path scripts/pre-push-check.ps1)
```

### Bash (Linux/macOS/Git Bash)
```bash
ln -s ../../scripts/pre-push-check.sh .git/hooks/pre-push
```

## Adding new tests

1. Create `__tests__/<topic>.test.ts`.
2. Mirror the production logic into a small pure helper inside the test
   file (or import the helper directly if it has no side effects).
3. Run `npm test` to verify.

Keep tests dependency-free: don't import Prisma, the full middleware
function, or anything that pulls in the Next.js runtime. Extract the
pure logic into a testable helper, then test the helper.