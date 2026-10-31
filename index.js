import process from 'node:process';
import {createSupportsColor} from 'supports-color';
import hasFlag from 'has-flag';

/* eslint-disable unicorn/prefer-number-coercion -- `Number.parseInt` intentionally accepts a partial parse. `Number()` requires the whole string, so a terminal version string like `20200620-160318-e00b076c` would become `NaN`. */
function parseVersion(versionString = '') {
	if (/^\d{3,4}$/v.test(versionString)) {
		// Env var doesn't always use dots. example: 4601 => 46.1.0
		const match = /(?<minor>\d{1,2})(?<patch>\d{2})/v.exec(versionString)?.groups ?? {};
		return {
			major: 0,
			minor: Number.parseInt(match.minor, 10),
			patch: Number.parseInt(match.patch, 10),
		};
	}

	const versions = (versionString ?? '').split('.').map(n => Number.parseInt(n, 10));
	return {
		major: versions[0],
		minor: versions[1],
		patch: versions[2],
	};
}
/* eslint-enable unicorn/prefer-number-coercion */

// eslint-disable-next-line complexity
export function createSupportsHyperlinks(stream) {
	const {
		CI,
		CURSOR_TRACE_ID,
		FORCE_HYPERLINK,
		NETLIFY,
		TEAMCITY_VERSION,
		TERM_PROGRAM,
		TERM_PROGRAM_VERSION,
		VTE_VERSION,
		TERM,
	} = process.env;

	if (FORCE_HYPERLINK) {
		// eslint-disable-next-line unicorn/prefer-number-coercion -- `Number()` requires the whole string, so `FORCE_HYPERLINK=0abc` would go from disabled to enabled.
		return !(FORCE_HYPERLINK.length > 0 && Number.parseInt(FORCE_HYPERLINK, 10) === 0);
	}

	if (hasFlag('no-hyperlink') || hasFlag('no-hyperlinks') || hasFlag('hyperlink=false') || hasFlag('hyperlink=never')) {
		return false;
	}

	// Netlify does not run a TTY, it does not need `supportsColor` check
	if (NETLIFY || hasFlag('hyperlink=true') || hasFlag('hyperlink=always')) {
		return true;
	}

	// If they specify no colors, they probably don't want hyperlinks. A non-TTY stream cannot show a hyperlink either.
	if (!createSupportsColor(stream) || (stream && !stream.isTTY)) {
		return false;
	}

	// Windows Terminal
	if ('WT_SESSION' in process.env) {
		return true;
	}

	if (CI || TEAMCITY_VERSION || process.platform === 'win32') {
		return false;
	}

	if (TERM_PROGRAM) {
		const version = parseVersion(TERM_PROGRAM_VERSION);

		switch (TERM_PROGRAM) {
			case 'iTerm.app': {
				return version.major === 3 ? version.minor >= 1 : version.major > 3;
			}

			case 'WezTerm': {
				// WezTerm packaged by Nix uses their own version scheme.
				if (/^0-unstable-\d{4}-\d{2}-\d{2}$/v.test(TERM_PROGRAM_VERSION)) {
					const date = TERM_PROGRAM_VERSION.slice('0-unstable-'.length);
					return date >= '2020-06-20';
				}

				// This number is a date and reads better grouped as such.
				// eslint-disable-next-line unicorn/numeric-separators-style
				return version.major >= 2020_06_20;
			}

			case 'vscode': {
				// Cursor forked VS Code and supports hyperlinks in 0.x.x
				// eslint-disable-next-line @stylistic/no-mixed-operators
				return CURSOR_TRACE_ID ? true : version.major > 1 || version.major === 1 && version.minor >= 72;
			}

			case 'ghostty': {
				return true;
			}

			case 'zed': {
				return true;
			}

			case 'Orca': {
				// Orca is an Electron-based terminal (xterm.js + OSC 8
				// linkHandler). https://github.com/stablyai/orca
				return true;
			}

			case 'WarpTerminal': {
				return true;
			}

			case 'herdr': {
				// Renders OSC 8 hyperlinks since 0.5.6.
				// https://github.com/herdrdev/herdr
				return true;
			}

		// No default
		}
	}

	if (VTE_VERSION) {
		// 0.50.0 was supposed to support hyperlinks, but throws a segfault
		if (VTE_VERSION === '0.50.0') {
			return false;
		}

		const version = parseVersion(VTE_VERSION);
		return version.major > 0 || version.minor >= 50;
	}

	switch (TERM) {
		case 'alacritty': {
			// Support added in v0.11 (2022-10-13)
			return true;
		}

		case 'xterm-kitty': {
			return true;
		}
		// No default
	}

	return false;
}

const supportsHyperlinks = {
	stdout: createSupportsHyperlinks(process.stdout),
	stderr: createSupportsHyperlinks(process.stderr),
};

export default supportsHyperlinks;
