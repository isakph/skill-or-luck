# Skill vs Luck Simulation

An interactive visualization of the simulation model from the appendix of Robert Frank's *Success and Luck: Good Fortune and the Myth of Meritocracy* (2016).

The central claim: in large competitive fields, winners are rarely the most talented — they are usually among the luckiest. This holds even when luck accounts for only a small fraction of performance, because the top of the skill distribution is tightly packed and luck acts as a tiebreaker among near-equals.

This becomes important particularly in situations where the winner takes all or most.
This is the situation in many fields, such as sports (tennis, golf) and business (software platforms and their network effects, for instance).
The practical implications is often that being lucky, at a certain point, is more important than your absolute level of skill.

## The model

Each simulated contest has N contestants. Each contestant draws three scores independently from a uniform distribution on [0, 100]:

- **Ability**
- **Effort**
- **Luck**

Performance is:

```
performance = (1 − luckWeight) × (ability + effort) / 2 + luckWeight × luck
```

The contestant with the highest performance score wins. Because `(ability + effort) / 2` follows a triangular distribution (peaked at 50, less variance than a single draw), the top contestants are especially tightly bunched — which makes luck increasingly decisive as N grows, even at very small `luckWeight` values.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Parameters

| Parameter    | Range          | Default | Notes              |
|--------------|----------------|---------|--------------------|
| Contestants  | 100 – 100,000  | 1,000   | Log scale          |
| Luck weight  | 1% – 20%       | 5%      |                    |
| Contests     | 100 – 10,000   | 1,000   | Contests per batch |

## Design notes and trade-offs

**Scatter plot sampling.** The "Winners vs displaced champions" scatter is capped at 300 points per series regardless of how many contests are run. This is a deliberate performance trade-off: Recharts renders each dot as an SVG element with event listeners, and at m = 10,000 the unsampled chart (~6,000 × 2 elements) makes the page noticeably slow. The visual pattern — two separated clouds — is equally legible at 300 points. The cost is that the clouds look sparser than they would at full density. A canvas-based renderer would remove this constraint but adds significant complexity; left for a future phase if it matters.

**Synchronous simulation.** All computation runs on the main thread. At the default settings (n = 1,000, m = 1,000) this takes roughly 100–400 ms and is acceptable. At n = 100,000 it can approach a second or two. Moving to a Web Worker would keep the UI responsive during large runs; deferred until it becomes a real problem.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) with TypeScript
- [Tailwind CSS](https://tailwindcss.com) v4
- [Recharts](https://recharts.org) for all charts
- Pure `useState` — no external state library

## Bugs
- When you shift between `Batch-run` and `Step through` on `page.tsx` the main column shifts left and right
