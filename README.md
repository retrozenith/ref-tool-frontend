# ref-tool-frontend — cleanup and deployment notes

This frontend was initialized from the Cloudflare/Astro starter template. I cleaned up the configuration so it's ready to be built and deployed.

What I changed (cleanup)
- Added a `services` binding in `wrangler.json` so the frontend worker can call the API worker internally via `env.API.fetch(...)`.

How to run locally
- Install deps:

```powershell
npm install
```

- Development:

```powershell
npm run dev
```

- Build for production (this generates `dist/`):

```powershell
npm run build
```

Deploy
- The `deploy` script uses `wrangler deploy` from this directory. Before deploying, ensure the worker name in `wrangler.json` and the service binding `service` name match the published API worker name (default: `ref-tool-worker`).

Service binding usage
- The added binding in `wrangler.json` will make the API worker available under the `env` object in your Worker. Example inside your Worker entry (module worker):

```ts
export default {
	async fetch(request: Request, env: any) {
		// call the API worker internally (no CORS needed)
		const apiRes = await env.API.fetch('https://dummy.example/api/generate-report', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ /* form data */ }),
		});
		return apiRes;
	}
}
```

Notes and next steps
- If you prefer the frontend to call the API over a public URL instead of a service binding, remove the `services` entry and fetch the deployed API URL directly; ensure CORS is configured on the API.
- The backend (API worker) expects PDF templates and fonts in its `public/` assets. Ensure the API's `wrangler.jsonc` points to `./public` (it does) and that you include the `reports/` and `fonts/` directories when deploying.

If you'd like, I can:
- Wire a minimal form UI into `src/pages/index.astro` that posts to the API.
- Add CI deploy scripts for both frontend and backend.

---
Generated/updated by automation to prepare the project for deployment.

Recent changes
- Excluded starter placeholder images from assets by updating `public/.assetsignore`.
- Added a small report generation form to `src/pages/index.astro`. It posts JSON to `/api/generate-report` and downloads the returned PDF. If your API is deployed at a different URL, update the `API_URL` in the page's script.

Blog cleanup
- Removed blog routes and disabled the RSS endpoint. Blog content files remain in `src/content/blog/` but are no longer included in the build because `src/content.config.ts` no longer defines a `blog` collection.
- Replaced the blog layout with a lightweight placeholder so any residual references don't break the build.
