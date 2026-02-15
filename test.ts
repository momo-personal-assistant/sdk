import { Momo, MomoApiError, MomoAuthenticationError } from "./src/index.js";

const API_KEY = "momo_npgfEh4E2Ni-9I6KAHkWz6grHhFfvrEoUCNAK_S2ju0";
const BASE_URL = "http://localhost:3000";

const momo = new Momo({ apiKey: API_KEY, baseUrl: BASE_URL });

let passed = 0;
let failed = 0;

function pretty(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

async function test(name: string, fn: () => Promise<unknown>) {
  try {
    const result = await fn();
    passed++;
    console.log(`\n✓ ${name}`);
    console.log("─".repeat(60));
    console.log(pretty(result));
  } catch (err) {
    failed++;
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`\n✗ ${name}`);
    console.log("─".repeat(60));
    console.log(`ERROR: ${msg}`);
    if (err instanceof MomoApiError) {
      console.log(`Status: ${err.status}`);
      console.log(`Response: ${err.rawResponse}`);
    }
  }
}

async function run() {
  console.log("=".repeat(60));
  console.log("  @momo-memory/sdk — full test suite");
  console.log("=".repeat(60));

  // --- search ---
  await test("search('database')", () => momo.search("database"));

  await test("search({ query, limit, source })", () =>
    momo.search({ query: "project decisions", limit: 3, source: "github" })
  );

  // --- context ---
  await test("context('auth decisions')", () =>
    momo.context("auth decisions")
  );

  await test("context({ query, maxTokens })", () =>
    momo.context({ query: "hiring", maxTokens: 2000 })
  );

  // --- store ---
  await test("store()", () =>
    momo.store([
      {
        title: "SDK Test: Use Bun for scripts",
        summary: "Chose Bun over tsx for running TypeScript scripts",
        decisionType: "selection",
        confidence: "medium",
        involvedPersons: [{ name: "Test User", role: "approver" }],
      },
    ])
  );

  // --- summary ---
  await test("summary({ period: 'week' })", () =>
    momo.summary({ period: "week" })
  );

  // --- insights ---
  await test("insights()", () => momo.insights());

  // --- capabilities ---
  const caps = await test("capabilities()", () => momo.capabilities());

  // --- tools.execute ---
  // First get available tools, then try executing one
  const capsResult = await momo.capabilities();
  if (capsResult.tools.length > 0) {
    const toolNames = capsResult.tools.map((t) => t.name);
    console.log(`\nAvailable tools: ${toolNames.join(", ")}`);

    // Try gmail_send_email if available
    const gmailSend = capsResult.tools.find(
      (t) => t.name === "gmail_send_email"
    );
    if (gmailSend) {
      await test("tools.execute(gmail_send_email)", () =>
        momo.tools.execute({
          tool: "gmail_send_email",
          params: {
            to: "cailyn@usemomo.com",
            subject: "SDK Test — tools.execute()",
            body: "This email was sent via @momo-memory/sdk tools.execute()!",
          },
        })
      );
    }
  } else {
    console.log("\nNo tools available — skipping tools.execute()");
  }

  // --- usage ---
  await test("usage()", () => momo.usage());

  // --- scheduledTasks ---
  await test("scheduledTasks.list()", () => momo.scheduledTasks.list());

  // --- error handling ---
  await test("bad API key → MomoAuthenticationError", async () => {
    const bad = new Momo({ apiKey: "momo_invalid", baseUrl: BASE_URL });
    try {
      await bad.search("test");
      throw new Error("should have thrown");
    } catch (err) {
      if (!(err instanceof MomoAuthenticationError)) {
        throw new Error(`Expected MomoAuthenticationError, got ${err}`);
      }
      return { errorName: err.name, status: err.status, message: err.message };
    }
  });

  // --- final summary ---
  console.log("\n" + "=".repeat(60));
  console.log(`  Results: ${passed} passed, ${failed} failed`);
  console.log("=".repeat(60) + "\n");
  process.exit(failed > 0 ? 1 : 0);
}

run();
