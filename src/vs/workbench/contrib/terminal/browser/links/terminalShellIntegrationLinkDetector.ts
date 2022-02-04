/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { Schemas } from 'vs/base/common/network';
import { URI } from 'vs/base/common/uri';
import { ITerminalSimpleLink, ITerminalLinkDetector, TerminalBuiltinLinkType } from 'vs/workbench/contrib/terminal/browser/links/links';
import { IBufferCell, IBufferLine, Terminal } from 'xterm';

const linkText = 'Shell integration activated!';
const linkCodes = new Uint8Array(linkText.split('').map(e => e.charCodeAt(0)));

export class TerminalShellIntegrationLinkDetector implements ITerminalLinkDetector {
	static id = 'shellintegration';

	constructor(
		readonly xterm: Terminal
	) {
	}

	detect(lines: IBufferLine[], startLine: number, endLine: number): ITerminalSimpleLink[] {
		if (this._matches(lines)) {
			return [{
				text: linkText,
				type: TerminalBuiltinLinkType.Url,
				uri: URI.from({
					scheme: Schemas.https,
					path: 'aka.ms/vscode-shell-integration'
				}),
				bufferRange: {
					start: { x: 1, y: startLine + 1 },
					end: { x: linkText.length % this.xterm.cols, y: startLine + Math.floor(linkText.length / this.xterm.cols) + 1 }
				}
			}];
		}

		return [];
	}

	private _matches(lines: IBufferLine[]): boolean {
		let cell: IBufferCell | undefined;
		for (let i = 0; i < linkCodes.length; i++) {
			cell = lines[Math.floor(i / this.xterm.cols)].getCell(i % this.xterm.cols, cell);
			if (cell?.getCode() !== linkCodes[i]) {
				return false;
			}
		}
		return true;
	}
}
