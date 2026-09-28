// eslint-disable-next-line unicorn/consistent-boolean-name -- The exported name is part of the published API.
export function createSupportsHyperlinks() {
	return false;
}

const supportsHyperlinks = {
	stdout: createSupportsHyperlinks(),
	stderr: createSupportsHyperlinks(),
};

export default supportsHyperlinks;
