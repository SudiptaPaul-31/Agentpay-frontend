export const metadata = { title: "About — AgentPay" };

export default function AboutPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-4 p-8 focus:outline-none"
    >
      <h1 className="text-3xl font-semibold tracking-tight">About AgentPay</h1>
      <p className="text-zinc-700 dark:text-zinc-300">
        AgentPay is a pay-per-request payment protocol for autonomous AI
        agents and APIs, settled on Stellar via Soroban. Agents accrue usage
        against registered services off-chain; a settlement worker drains
        the usage counters and mirrors them on-chain.
      </p>
      <p className="text-zinc-700 dark:text-zinc-300">
        This dashboard exposes every read and write surface the backend
        provides: service registry, usage metering, billing quotes, audit
        log, webhooks, API keys, and admin pause/unpause.
      </p>
    </main>
  );
}
