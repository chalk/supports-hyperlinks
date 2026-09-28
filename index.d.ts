/**
Creates a supports hyperlinks check for a given stream.

@param stream - Optional stream to check for hyperlink support.
@param stream.isTTY - Whether the stream is a TTY.
@returns boolean indicating whether hyperlinks are supported.
*/
// eslint-disable-next-line unicorn/consistent-boolean-name -- The exported name is part of the published API.
export function createSupportsHyperlinks(stream?: {isTTY?: boolean}): boolean;

/**
Object containing hyperlink support status for stdout and stderr.
*/
type SupportsHyperlinks = {
	/**
	Whether stdout supports hyperlinks.
	*/
	stdout: boolean;
	/**
	Whether stderr supports hyperlinks.
	*/
	stderr: boolean;
};

declare const supportsHyperlinks: SupportsHyperlinks;

export default supportsHyperlinks;
