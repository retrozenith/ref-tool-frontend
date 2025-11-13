// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import { execSync } from 'child_process';

// Get git hash during build
let gitHash = 'dev';
try {
	gitHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
	console.warn('Could not get git hash, using "dev"');
}

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	vite: {
		define: {
			'import.meta.env.PUBLIC_GIT_HASH': JSON.stringify(gitHash),
		},
	},
});
