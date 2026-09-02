# Portfolio Cook Out — Prompt 5: Prompt Library Truth + Privacy Sync — 2026-09-02

## 1. DECISIONS FOR SKY

- [ ] **Push this branch and open a PR against `Skypie99/Prompt_Library`**
  - **Action:** From this worktree: `git push -u origin claude/cookout-p5-privacy-truth-20260902` (branch not yet created — see §7), then `gh pr create`. I have not pushed or opened a PR — only committed locally, pending your go-ahead.
  - **Rollback:** Branch is disposable pre-merge; `git push --delete origin <branch>` or just close the PR.
  - **Why deferred:** Constitution — only Sky merges/pushes; I don't push code without explicit permission.
  - **Owner:** this session (direct invocation, no role persona).

- [ ] **Decide what to do with two dangling, unmerged 2026-08-28 branches that overlap this work**
  - `claude/prompt-library-truth-readme-20260828` — pushed to origin, no PR ever opened. README-only privacy wording, superseded by this pass.
  - `claude/prompt-library-pl1-20260828` — local only (`~/Documents/Claude/Worktrees/Prompt-Library-PL1-20260828`), never pushed. Bundles a real Sheet.tsx focus-trap bug fix + regression test, a CommandPalette dark-mode contrast fix, and stale `@ts-expect-error` cleanup, alongside its own privacy wording (superseded by this pass).
  - **Action:** Per your instruction this session, neither was cherry-picked or merged — both were read-only evidence. The privacy/truth wording in both is now superseded by this branch's independent reimplementation. The **non-privacy fixes in the pl1 branch are real, still-open defects** (see §6) — recommend either landing them as their own follow-up PR sourced from that branch, or letting a future task rediscover and refix them.
  - **Rollback:** n/a — no action taken on either branch.
  - **Why deferred:** Scope discipline — you explicitly asked to keep this branch privacy/truth-only.
  - **Owner:** this session.

- [ ] **Open PR #3 (`steve/auto-2026-05-29-security-hardening`) has sat unmerged since 2026-05-29** — noticed in passing, not investigated. Recommend a look, independent of this Cook Out.

## 2. BLOCKERS / FAIL_FAST

None. Clean run.

## 3. Summary

Preflight found three independent local clones of `Skypie99/Prompt_Library` in divergent states (none clean-and-current), so per your direction I worked from a fresh clone of `origin/main` (`a3cbead5`) instead. Fixed the exact overclaim flagged by the Cook Out P1 truth manifest (§6 item 2) — "your key and prompts never leave your browser" — in every public-facing surface that carried it (README ×3, homepage hero + footer, OpenGraph share image), plus a stale Vercel deploy comment in `next.config.js` (site is actually GitHub Pages). Added a regression-guard test. Full suite green (442/442 tests, typecheck clean, lint 0 errors, production build succeeds); verified visually in-browser at desktop and mobile widths, both the live page and the OG image render.

## 4. What Shipped (Checkpoints)

Committed locally to branch `claude/cookout-p5-privacy-truth-20260902` in `/Users/skypie/.../prompt-library-cookout-p5` (fresh clone off `a3cbead5`) — **not pushed**:

- `README.md` — rewrote the hero-line overclaim and two "Privacy model" bullets to disclose the Anthropic network call instead of implying nothing leaves the machine.
- `src/components/HomeClient.tsx` — homepage trust line ("No account, no backend — your library stays in this browser; runs go directly to Anthropic.") and footer text ("Your library stays in this browser") replace the "never leave your browser" / "All data stays in this browser" overclaims.
- `src/app/opengraph-image.tsx` — share-image subtitle: "on-device" → "no backend" (same overclaim, baked into a generated image).
- `next.config.js` — comments corrected from a stale "served from Vercel" claim to the actual GitHub Pages deploy (confirmed via `.github/workflows/*.yml` and the committed `CNAME` files).
- `tests/privacy-claims.truth.test.ts` (new) — greps README/HomeClient/opengraph-image source for the banned phrases and asserts the README still discloses the Anthropic call, so this can't silently regress.

## 5. What's Proposed (Not Applied)

| Proposal | File path | What it does | Impact | Rollback documented? |
|---|---|---|---|---|
| Push branch + open PR | (git remote) | Publishes the above commit for review/merge | Makes the fix visible on GitHub; no production effect until merged | Yes — §1 |

## 6. Findings by Domain

### Privacy / Docs (this task's scope)
- 🟢 Fixed — see §4. All five surfaces now match the actual data flow: persistence is local, but a Run sends the prompt + API key to `api.anthropic.com`.
- 🟢 Verified `PROJECT_EXTRACTION.md`'s existing phrasing ("never leaves their browser **except to call Anthropic**") was already accurate — left untouched, not a false positive for the regression guard.

### Out-of-scope findings (observed, not fixed — per your explicit scope instruction)
- 🟡 **Real accessibility bug, still open:** `src/components/ui/Sheet.tsx`'s modal focus trap uses `requestAnimationFrame` to move focus on open; rAF is throttled/skipped by the browser when the tab isn't visibly rendering, which silently defeats the focus trap. A fix + regression test (`tests/Sheet.focus.test.tsx`) already exists, unpushed, on `claude/prompt-library-pl1-20260828`. Recommend landing as its own PR.
- 🟡 **Dark-mode contrast:** `CommandPalette.tsx` secondary text (`paper-muted`, ~3.85:1) fails SC 1.4.3 on the teal-tinted active row; a fix (new `paper-soft` token, ~5.5:1+) exists unpushed on the same branch.
- 🟡 **`typecheck:test` gate is currently broken on clean `origin/main`** (confirmed by stashing my changes and re-running) — 8 files with now-unused `@ts-expect-error` directives (TS2578) plus 2 test-fixture type mismatches (missing `Prompt` fields, an obsolete `multiline` field on `PromptVariable`). Pre-existing, unrelated to this task; `npm test` and `npm run typecheck` (app code) both pass, only `typecheck:test` fails. A fix exists unpushed on `claude/prompt-library-pl1-20260828`.
- 🟢 **Internal docs** (`PROJECT_STATE.md`, `DECISIONS_LOG.md`) are stale (last compiled 2026-06-18, predate the MIT license merge) — left untouched as Claude Corp bookkeeping, not public-facing truth, out of this task's "public repository" scope.

## 6.5 Process Self-Check

### Efficiency Check
Necessary — the P1 truth manifest (§6 item 2) explicitly named this exact overclaim as blocking the Prompt Library site's own credibility, independent of Portfolio.

### Overlap Check
Yes, real overlap found: two prior 2026-08-28 sessions (branches `claude/prompt-library-truth-readme-20260828` and `claude/prompt-library-pl1-20260828`) already attempted this same README fix, neither merged. Surfaced to you before proceeding (§1); per your instruction, reimplemented independently rather than reusing either commit, and logged their non-overlapping unrelated fixes as follow-ups (§6) instead of importing them.

### Simplification Opportunities
None — the fix is a direct text/comment correction plus one guard test; no simpler path considered necessary.

## 7. How to Review

```bash
cd "/Users/skypie/Library/Application Support/Claude/scratch-workspaces/c33613f8-b7b5-4c3d-b309-221e8e82c10a/de10261b-e063-47df-a47a-8448c4f835e4/scratch-2026-09-02-3624ee/prompt-library-cookout-p5"
git diff a3cbead
npm test
npm run typecheck
npm run build
```

## 8. Next Recommended Action

Review the diff and, if it looks right, tell me to push the branch and open the PR (§1) — I won't do either without your go-ahead.
