import process from 'node:process';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createSupportsHyperlinks} from './index.js';

const isSupported = ({
	platform = 'darwin',
	env = {},
	argv = [],
	stream,
}) => {
	const oldPlatform = process.platform;
	const oldEnv = process.env;
	const oldArgv = process.argv;

	Object.defineProperties(process, {
		platform: {value: platform},
		env: {value: env},
		argv: {value: [process.argv[0], ...argv]},
	});

	const result = createSupportsHyperlinks(stream);

	Object.defineProperties(process, {
		platform: {value: oldPlatform},
		env: {value: oldEnv},
		argv: {value: oldArgv},
	});

	return result;
};

test('supported iTerm.app 3.1, tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
			TERM_PROGRAM_VERSION: '3.1.0',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('supported iTerm.app 3.1, no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
			TERM_PROGRAM_VERSION: '3.1.0',
		},
	}), true);
});

test('supported iTerm.app 4.0, no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
			TERM_PROGRAM_VERSION: '4.0.0',
		},
	}), true);
});

test('not supported iTerm 3.0, tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
			TERM_PROGRAM_VERSION: '3.0.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported iTerm 3.1, non-tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
			TERM_PROGRAM_VERSION: '3.1.0',
		},
		stream: {
			isTTY: false,
		},
	}));
});

test('not supported WezTerm 20200620 no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200620-160318-e00b076c',
		},
	}), true);
});

test('not supported WezTerm 20200608 no stream supplied', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200608-110940-3fb3a61',
		},
	}));
});

test('supported WezTerm 20200620, tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200620-160318-e00b076c',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('not supported WezTerm 20200608, tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200608-110940-3fb3a61',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported WezTerm 20200620 packaged by Nix, tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '0-unstable-2020-06-20',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('not supported WezTerm 20200608 packaged by Nix, tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '0-unstable-2020-06-08',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported vscode <= 1.0 no stream supplied', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.72.0',
		},
	}));
});

test('not supported vscode <= 1.0 tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.72.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported vscode 2.70.0 no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '2.70.0',
		},
	}), true);
});

test('supported vscode 2.70.0 tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '2.70.0',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('not supported vscode 1.0 no stream supplied', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.0.0',
		},
	}));
});

test('not supported vscode 1.0 tty stream', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.0.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported vscode >= 1.72.0 no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.72.0',
		},
	}), true);
});

test('supported vscode >= 1.72.0 tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.72.0',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('supported Cursor (vscode fork) no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			CURSOR_TRACE_ID: 'some-trace-id',
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.49.6',
		},
	}), true);
});

test('supported Cursor (vscode fork) tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			CURSOR_TRACE_ID: 'some-trace-id',
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.49.6',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('supported ghostty no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'ghostty',
		},
	}), true);
});

test('supported ghostty tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'ghostty',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('not supported in VTE 0.50.0', () => {
	assert.ok(!isSupported({
		env: {
			VTE_VERSION: '0.50.0',
		},
	}));
});

test('supported in VTE 0.50.1', () => {
	assert.strictEqual(isSupported({
		env: {
			VTE_VERSION: '0.50.1',
		},
	}), true);
});

test('supported in VTE 0.51.0', () => {
	assert.strictEqual(isSupported({
		env: {
			VTE_VERSION: '0.51.0',
		},
	}), true);
});

test('supported in VTE 1.0.0', () => {
	assert.strictEqual(isSupported({
		env: {
			VTE_VERSION: '1.0.0',
		},
	}), true);
});

test('not supported in VTE 4601 (0.46.1)', () => {
	assert.ok(!isSupported({
		env: {
			VTE_VERSION: '4601',
		},
	}));
});

test('supported in VTE 5105 (0.51.5)', () => {
	assert.strictEqual(isSupported({
		env: {
			VTE_VERSION: '5105',
		},
	}), true);
});

test('supported in alacritty', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM: 'alacritty',
		},
	}), true);
});

test('supported in kitty', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM: 'xterm-kitty',
		},
	}), true);
});

test('supported zed no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'zed',
		},
	}), true);
});

test('supported zed tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'zed',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('supported Orca no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'Orca',
		},
	}), true);
});

test('supported Orca tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'Orca',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('supported Warp no stream supplied', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'WarpTerminal',
		},
	}), true);
});

test('supported Warp tty stream', () => {
	assert.strictEqual(isSupported({
		env: {
			TERM_PROGRAM: 'WarpTerminal',
		},
		stream: {
			isTTY: true,
		},
	}), true);
});

test('empty env not supported', () => {
	assert.ok(!isSupported({env: {}}));
});

// The `--no-color` flag should disable hyperlinks, but it does not. AVA had this as `test.failing`, which `node:test` has no equivalent of, so the known-wrong result is asserted instead so a change is noticed.
test('`--no-color` does not disable support', () => {
	assert.strictEqual(isSupported({
		argv: ['--no-color'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}), true);
});

test('not supported if no environment variables are set', () => {
	assert.ok(!isSupported({}));
});

test('supported if hyperlink=true flag is set', () => {
	assert.strictEqual(isSupported({
		argv: ['--hyperlink=true'],
	}), true);
});

test('supported if hyperlink=always flag is set', () => {
	assert.strictEqual(isSupported({
		argv: ['--hyperlink=always'],
	}), true);
});

test('hyperlink=false flag disables support', () => {
	assert.ok(!isSupported({
		argv: ['--hyperlink=false'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=never flag disables support', () => {
	assert.ok(!isSupported({
		argv: ['--hyperlink=never'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('no-hyperlink flag disables support', () => {
	assert.ok(!isSupported({
		argv: ['--no-hyperlink'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('no-hyperlinks flag disables support', () => {
	assert.ok(!isSupported({
		argv: ['--no-hyperlinks'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=always flag takes precedence over no-color flags', () => {
	assert.strictEqual(isSupported({
		argv: ['--no-color', '--hyperlink=always'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}), true);
});

test('not supported on win32 platform', () => {
	assert.ok(!isSupported({
		platform: 'win32',
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=always forces support on win32 platform', () => {
	assert.strictEqual(isSupported({
		argv: ['--hyperlink=always'],
		platform: 'win32',
	}), true);
});

test('disabled in CI', () => {
	assert.ok(!isSupported({
		env: {
			CI: 'Travis',
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('disabled in TEAMCITY', () => {
	assert.ok(!isSupported({
		env: {
			TEAMCITY_VERSION: '10.2.0',
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('enabled in Netlify build logs', () => {
	assert.strictEqual(isSupported({
		env: {
			CI: 'true',
			NETLIFY: 'true',
		},
	}), true);
});

test('not supported if TERM_PROGRAM exists, but TERM_VERSION does not', () => {
	assert.ok(!isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
		},
	}));
});

test('FORCE_HYPERLINK=1 forces hyperlink support', () => {
	assert.strictEqual(isSupported({
		env: {
			FORCE_HYPERLINK: '1',
		},
	}), true);
});

test('FORCE_HYPERLINK=0 disables hyperlink support', () => {
	assert.ok(!isSupported({
		argv: ['--hyperlink=always'],
		env: {
			FORCE_HYPERLINK: '0',
		},
	}));
});
