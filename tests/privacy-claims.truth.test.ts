/**
 * Privacy-claim truth guard (Portfolio Cook Out Prompt 5).
 *
 * `src/lib/anthropic.ts` sends the prompt and the user's API key directly
 * from the browser to `api.anthropic.com` on every Run — that's the one
 * intentional network call the app makes. Several public-facing surfaces
 * previously said "never leave your browser" / "on-device" / "nothing to
 * go" without carving out that call, which is false whenever Run is used.
 *
 * This pins the banned overclaims out of the surfaces that had them —
 * README, the homepage hero/footer, and the OpenGraph share image — so a
 * future edit can't silently reintroduce the contradiction. It does not
 * forbid "on-device"/"never leaves" everywhere: PROJECT_EXTRACTION.md, for
 * instance, already correctly scopes the claim to *storage* ("never leaves
 * their browser except to call Anthropic") and is left alone.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(__dirname, "..");

const SURFACES = [
  "README.md",
  "src/components/HomeClient.tsx",
  "src/app/opengraph-image.tsx",
] as const;

const BANNED_PHRASES = [
  "never leave your browser",
  "byte of your data leaving your machine",
  "nowhere for your data to go",
  "all data stays in this browser",
];

describe("privacy claims stay accurate about the Anthropic network call", () => {
  for (const surface of SURFACES) {
    it(`${surface} does not overclaim that nothing leaves the browser`, () => {
      const source = readFileSync(path.join(root, surface), "utf8").toLowerCase();
      for (const phrase of BANNED_PHRASES) {
        expect(source).not.toContain(phrase);
      }
    });
  }

  it("README still discloses the one real network call (Anthropic)", () => {
    const readme = readFileSync(path.join(root, "README.md"), "utf8");
    expect(readme).toMatch(/anthropic/i);
    expect(readme.toLowerCase()).toMatch(
      /sends? .*(directly|straight) to anthropic|goes? (directly|straight) to anthropic/,
    );
  });
});
