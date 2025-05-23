import process from 'node:process';
import test from 'ava';
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

test('supported iTerm.app 3.1, tty stream', t => {
	t.true(isSupported(
		{
			env: {
				TERM_PROGRAM: 'iTerm.app',
				TERM_PROGRAM_VERSION: '3.1.0',
			},
			stream: {
				isTTY: true,
			},
		},
	));
});

test('supported iTerm.app 3.1, no stream supplied', t => {
	t.true(isSupported(
		{
			env: {
				TERM_PROGRAM: 'iTerm.app',
				TERM_PROGRAM_VERSION: '3.1.0',
			},
		},
	));
});

test('supported iTerm.app 4.0, no stream supplied', t => {
	t.true(isSupported(
		{
			env: {
				TERM_PROGRAM: 'iTerm.app',
				TERM_PROGRAM_VERSION: '4.0.0',
			},
		},
	));
});

test('not supported iTerm 3.0, tty stream', t => {
	t.false(isSupported(
		{
			env: {
				TERM_PROGRAM: 'iTerm.app',
				TERM_PROGRAM_VERSION: '3.0.0',
			},
			stream: {
				isTTY: true,
			},
		},
	));
});

test('not supported iTerm 3.1, non-tty stream', t => {
	t.false(isSupported(
		{
			env: {
				TERM_PROGRAM: 'iTerm.app',
				TERM_PROGRAM_VERSION: '3.1.0',
			},
			stream: {
				isTTY: false,
			},
		},
	));
});

test('not supported WezTerm 20200620 no stream supplied', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200620-160318-e00b076c',
		},
	}));
});

test('not supported WezTerm 20200608 no stream supplied', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200608-110940-3fb3a61',
		},
	}));
});

test('supported WezTerm 20200620, tty stream', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200620-160318-e00b076c',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported WezTerm 20200608, tty stream', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'WezTerm',
			TERM_PROGRAM_VERSION: '20200608-110940-3fb3a61',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported vscode <= 1.0 no stream supplied', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.72.0',
		},
	}));
});

test('not supported vscode <= 1.0 tty stream', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.72.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported vscode 2.70.0 no stream supplied', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '2.70.0',
		},
	}));
});

test('supported vscode 2.70.0 tty stream', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '2.70.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported vscode 1.0 no stream supplied', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.0.0',
		},
	}));
});

test('not supported vscode 1.0 tty stream', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.0.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported vscode >= 1.72.0 no stream supplied', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.72.0',
		},
	}));
});

test('supported vscode >= 1.72.0 tty stream', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '1.72.0',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported Cursor (vscode fork) no stream supplied', t => {
	t.true(isSupported({
		env: {
			CURSOR_TRACE_ID: 'some-trace-id',
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.49.6',
		},
	}));
});

test('supported Cursor (vscode fork) tty stream', t => {
	t.true(isSupported({
		env: {
			CURSOR_TRACE_ID: 'some-trace-id',
			TERM_PROGRAM: 'vscode',
			TERM_PROGRAM_VERSION: '0.49.6',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('supported ghostty no stream supplied', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'ghostty',
		},
	}));
});

test('supported ghostty tty stream', t => {
	t.true(isSupported({
		env: {
			TERM_PROGRAM: 'ghostty',
		},
		stream: {
			isTTY: true,
		},
	}));
});

test('not supported in VTE 0.50.0', t => {
	t.false(isSupported({
		env: {
			VTE_VERSION: '0.50.0',
		},
	}));
});

test('supported in VTE 0.50.1', t => {
	t.true(isSupported({
		env: {
			VTE_VERSION: '0.50.1',
		},
	}));
});

test('supported in VTE 0.51.0', t => {
	t.true(isSupported({
		env: {
			VTE_VERSION: '0.51.0',
		},
	}));
});

test('supported in VTE 1.0.0', t => {
	t.true(isSupported({
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('not supported in VTE 4601 (0.46.1)', t => {
	t.false(isSupported({
		env: {
			VTE_VERSION: '4601',
		},
	}));
});

test('supported in VTE 5105 (0.51.5)', t => {
	t.true(isSupported({
		env: {
			VTE_VERSION: '5105',
		},
	}));
});

test('supported in alacritty', t => {
	t.true(isSupported({
		env: {
			TERM: 'alacritty',
		},
	}));
});

test('empty env not supported', t => {
	t.false(isSupported({env: {}}));
});

test.failing('no-color flag disables support', t => {
	t.false(isSupported({
		argv: ['--no-color'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('not supported if no environment variables are set', t => {
	t.false(isSupported({}));
});

test('supported if hyperlink=true flag is set', t => {
	t.true(isSupported({
		argv: ['--hyperlink=true'],
	}));
});

test('supported if hyperlink=always flag is set', t => {
	t.true(isSupported({
		argv: ['--hyperlink=always'],
	}));
});

test('hyperlink=false flag disables support', t => {
	t.false(isSupported({
		argv: ['--hyperlink=false'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=never flag disables support', t => {
	t.false(isSupported({
		argv: ['--hyperlink=never'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('no-hyperlink flag disables support', t => {
	t.false(isSupported({
		argv: ['--no-hyperlink'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('no-hyperlinks flag disables support', t => {
	t.false(isSupported({
		argv: ['--no-hyperlinks'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=always flag takes precedence over no-color flags', t => {
	t.true(isSupported({
		argv: ['--no-color', '--hyperlink=always'],
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('not supported on win32 platform', t => {
	t.false(isSupported({
		platform: 'win32',
		env: {
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('hyperlink=always forces support on win32 platform', t => {
	t.true(isSupported({
		argv: ['--hyperlink=always'],
		platform: 'win32',
	}));
});

test('disabled in CI', t => {
	t.false(isSupported({
		env: {
			CI: 'Travis',
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('disabled in TEAMCITY', t => {
	t.false(isSupported({
		env: {
			TEAMCITY_VERSION: '10.2.0',
			VTE_VERSION: '1.0.0',
		},
	}));
});

test('enabled in Netlify build logs', t => {
	t.true(isSupported({
		env: {
			CI: 'true',
			NETLIFY: 'true',
		},
	}));
});

test('not supported if TERM_PROGRAM exists, but TERM_VERSION does not', t => {
	t.false(isSupported({
		env: {
			TERM_PROGRAM: 'iTerm.app',
		},
	}));
});

test('FORCE_HYPERLINK=1 forces hyperlink support', t => {
	t.true(isSupported({
		env: {
			FORCE_HYPERLINK: '1',
		},
	}));
});

test('FORCE_HYPERLINK=0 disables hyperlink support', t => {
	t.false(isSupported({
		argv: ['--hyperlink=always'],
		env: {
			FORCE_HYPERLINK: '0',
		},
	}));
});
