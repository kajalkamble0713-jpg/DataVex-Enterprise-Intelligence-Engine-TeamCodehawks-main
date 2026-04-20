/**
 * Quick test script for the direct agent pipeline
 * Run with: npx tsx test-agents.ts
 */

import { runAgentPipeline } from "./src/services/agents/orchestrator";

async function test() {
  console.log("Testing direct agent pipeline...\n");

  const testDomain = "stripe.com";
  const testJobId = "test-job-123";

  try {
    console.log(`Starting analysis for ${testDomain}...`);
    const result = await runAgentPipeline(testJobId, testDomain);

    console.log("\n=== RESULTS ===");
    console.log(`Job ID: ${result.jobId}`);
    console.log(`Status: ${result.status}`);
    console.log(`Verdict: ${result.verdict}`);
    console.log(`\nDossier:`, JSON.stringify(result.dossier, null, 2));
    console.log(`\nDecision Reasoning:`, result.decisionReasoning);
    console.log(`\nOutreach Message:`, result.outreachMessage);
    console.log(`\nBonus Content:`, JSON.stringify(result.bonusContent, null, 2));
    console.log(`\nTrace (${result.trace?.length} steps):`, result.trace?.map(t => t.agent).join(" → "));

    console.log("\n✅ Test completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  }
}

test();
