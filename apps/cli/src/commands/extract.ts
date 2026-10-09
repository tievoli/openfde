import type { Command } from "commander";
import {
  AnthropicExtractor,
  MockExtractor,
  openLedger,
  resolveEngagement,
  runExtraction,
  type Extractor,
} from "@openfde/core";
import { fail } from "../lib/helpers.js";

export function registerExtract(program: Command): void {
  program
    .command("extract")
    .description("Run ontology-constrained extraction and resolution over pending episodes")
    .option("-e, --engagement <slug>", "target engagement (defaults to current)")
    .option("--mock", "use the offline mock extractor (testing)")
    .option("--model <model>", "override model (default: glm-5, or OPENFDE_MODEL env var)")
    .option("--json", "JSON output")
    .action(
      async (options: { engagement?: string; mock?: boolean; model?: string; json?: boolean }) => {
        try {
          const slug = resolveEngagement(options.engagement);
          const db = openLedger(slug);
          let extractor: Extractor;
          if (options.mock) {
            extractor = new MockExtractor();
          } else {
            // 支持百炼 API: OPENFDE_API_KEY 或 ANTHROPIC_API_KEY
            const apiKey = process.env.OPENFDE_API_KEY || process.env.ANTHROPIC_API_KEY;
            if (!apiKey && !process.env.ANTHROPIC_AUTH_TOKEN) {
              throw new Error(
                "API key not found. Set OPENFDE_API_KEY (recommended) or ANTHROPIC_API_KEY, or use --mock for the offline extractor",
              );
            }
            extractor = new AnthropicExtractor({ model: options.model });
          }
          const stats = await runExtraction(db, extractor);
          db.close();
          if (options.json) console.log(JSON.stringify({ engagement: slug, ...stats }));
          else
            console.log(
              `Processed ${stats.episodes} episode(s): +${stats.facts.ADD} facts, ` +
                `${stats.facts.INVALIDATE} superseded, ${stats.facts.NOOP} deduped, ${stats.failed} failed` +
                (stats.coerced ? `, ${stats.coerced} coerced to RELATES_TO (relation did not fit its types)` : ""),
            );
        } catch (error) {
          fail(error);
        }
      },
    );
}
