#!/usr/bin/env node
/**
 * get-git-hash.mjs
 * Works in ESM mode ("type": "module")
 * Prints the short git commit hash for CI/build pipelines.
 */

import { execSync } from 'node:child_process';
import process from 'node:process';

/**
 * Get a short Git hash.
 * @param {object} [options]
 * @param {number} [options.length=7] - number of characters to return
 * @param {string} [options.fallback='unknown'] - fallback if git fails
 * @param {string[]} [options.envVars] - env vars to check first
 * @returns {string}
 */
export function getShortGitHash({
	length = 7,
	fallback = 'unknown',
	envVars = ['GIT_SHORT_HASH', 'CI_COMMIT_SHORT_SHA', 'GITHUB_SHA']
} = {}) {
	// 1. Check environment variables
	for (const name of envVars) {
		const val = process.env[name];
		if (val && typeof val === 'string' && val.length > 0) {
			return val.length > length ? val.slice(0, length) : val;
		}
	}

	// 2. Try Git
	try {
		const out = execSync(`git rev-parse --short=${length} HEAD`, {
			encoding: 'utf8',
			stdio: ['ignore', 'pipe', 'ignore'],
		}).trim();
		if (out) return out;
	} catch {}

	// 3. Fallback
	return fallback;
}

// --- CLI mode detection (works in all environments, including Windows) ---
if (process.argv[1] && process.argv[1].endsWith('get-git-hash.mjs')) {
	const arg = process.argv[2];
	const len = arg ? parseInt(arg, 10) : 7;
	const hash = getShortGitHash({ length: len });
	console.log(hash);
}
