# Raphael — natural AI conversation (activation)

Raphael is already integrated into the existing portfolio. His animated character, website navigation, published Work/Certificates knowledge and offline guide do not depend on an AI account.

**Natural, free-form explanations require an actual generative model.** GitHub Pages cannot safely keep the model key because the repository and browser scripts are public. This repository includes an optional Cloudflare Worker backend that stores the key privately and calls Gemini.

## One-time activation (the site owner must authorize these services)

1. Create or use your own Cloudflare account. The Worker uses the free plan unless you choose a paid plan. No Cloudflare credentials are needed in this repository.
2. Create a Gemini API key in [Google AI Studio](https://aistudio.google.com/apikey). Check your project’s **current** free-tier availability, region and request quotas. Free tiers are limited and may change. Avoid enabling paid billing unless you intend to.
3. In Cloudflare Workers, deploy `workers/raphael-ai.js`. The included root `wrangler.toml` supports the CLI: from the repository root, run `npx wrangler login`, then `npx wrangler secret put GEMINI_API_KEY`, and `npx wrangler deploy`. Paste the key only into the private Cloudflare secret prompt; **never put it in GitHub or ChatGPT**. Or use Cloudflare’s Worker dashboard and create the same secret there.
4. Copy the Worker’s URL (for example `https://jahid-raphael-ai.<your-subdomain>.workers.dev`). In `raphael-ai-config.js`, set `endpoint` to that URL plus `/chat`, e.g. `https://jahid-raphael-ai.<your-subdomain>.workers.dev/chat`. The URL is public; the key remains server-side.
5. Commit only that configuration URL. GitHub Pages will deploy. The footer switches to **AI explanations** when the Worker health check confirms the private secret is present.

Raphael still uses his existing guide when the Worker is absent, over quota, blocked or offline. A server-side Worker fetches the publicly deployed corpus generated from `work.html`, `certifications.html`, `index.html` and `cv.html`; he receives matched verified facts and recent in-session conversation turns, so he can explain the work naturally without inventing results.

**Privacy and limits:** When connected, visitors’ questions and limited in-session context are sent to the configured Worker and Google Gemini. Do not submit private information. Cloudflare Workers and Gemini each have usage limits; this is not an unlimited free AI. The code contains a best-effort rate limit, exact website-origin restriction, request-size limit and provider quota handling. The origin restriction alone is not strong protection against automated abuse; consider Cloudflare WAF/Turnstile before promoting widely. Only publish approved portfolio facts. The backend uses `gemini-2.5-flash-lite` by default and can be changed privately with `GEMINI_MODEL` if available to your account.

If you only want the portfolio guide, leave `raphael-ai-config.js` empty. Never paste a Gemini key into the browser or repository.
