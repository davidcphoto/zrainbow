// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode');

// Decoration types for different nesting levels
let decorationTypes = [];
let connectorTypes = [];

// Cache para armazenar estruturas parseadas por documento
const documentCache = new Map();

// Timeouts para debouncing
let updateTimeout = null;
let selectionTimeout = null;

// Configurações de performance
const DEBOUNCE_DELAY = 300; // ms para esperar após digitação
const SELECTION_THROTTLE = 100; // ms para throttle de mudança de seleção
const MAX_DOCUMENT_SIZE = 50000; // Linhas máximas para processar

// Default colors for different nesting levels (rainbow effect)
const defaultColors = [
	{ opening: '#FFD700', middle: '#FFA500', closing: '#FFD700' }, // Gold/Orange
	{ opening: '#00CED1', middle: '#1E90FF', closing: '#00CED1' }, // Cyan/Blue
	{ opening: '#FF69B4', middle: '#FF1493', closing: '#FF69B4' }, // Pink/Deep Pink
	{ opening: '#32CD32', middle: '#228B22', closing: '#32CD32' }, // Lime/Green
	{ opening: '#9370DB', middle: '#8B008B', closing: '#9370DB' }, // Purple/Dark Magenta
	{ opening: '#FF6347', middle: '#DC143C', closing: '#FF6347' }, // Tomato/Crimson
];

/**
 * Get colors from configuration or use defaults
 */
function getColors() {
	const config = vscode.workspace.getConfiguration('zrainbow');
	const userColors = config.get('colors', []);

	// Use user colors if available and valid, otherwise use defaults
	if (userColors && Array.isArray(userColors) && userColors.length > 0) {
		return userColors;
	}
	return defaultColors;
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('zRainbow COBOL extension is now active!');

	// Initialize decoration types
	initializeDecorationTypes();

	// Register the command to toggle rainbow brackets
	let toggleCommand = vscode.commands.registerCommand('zrainbow.toggle', function () {
		const config = vscode.workspace.getConfiguration('zrainbow');
		const enabled = config.get('enabled', true);
		config.update('enabled', !enabled, true);
		vscode.window.showInformationMessage(`zRainbow ${!enabled ? 'enabled' : 'disabled'}`);

		// Refresh all visible editors
		vscode.window.visibleTextEditors.forEach(editor => {
			if (isCobolFile(editor.document)) {
				updateDecorations(editor);
			}
		});
	});

	context.subscriptions.push(toggleCommand);

	// Update decorations when active editor changes
	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor(editor => {
			if (editor && isCobolFile(editor.document)) {
				updateDecorations(editor);
			}
		})
	);

	// Update decorations when document changes (COM DEBOUNCING)
	context.subscriptions.push(
		vscode.workspace.onDidChangeTextDocument(event => {
			const editor = vscode.window.activeTextEditor;
			if (editor && event.document === editor.document && isCobolFile(event.document)) {
				// Invalidar cache do documento
				documentCache.delete(event.document.uri.toString());

				// Debounce: esperar antes de recalcular
				if (updateTimeout) {
					clearTimeout(updateTimeout);
				}
				updateTimeout = setTimeout(() => {
					updateDecorations(editor);
					updateTimeout = null;
				}, DEBOUNCE_DELAY);
			}
		})
	);

	// Update decorations when configuration changes
	context.subscriptions.push(
		vscode.workspace.onDidChangeConfiguration(event => {
			if (event.affectsConfiguration('zrainbow.colors')) {
				// Dispose old decoration types
				decorationTypes.forEach(dt => {
					dt.opening.dispose();
					dt.middle.dispose();
					dt.closing.dispose();
				});
				connectorTypes.forEach(ct => ct.dispose());

				// Reinitialize with new colors
				initializeDecorationTypes();

				// Refresh all visible editors
				vscode.window.visibleTextEditors.forEach(editor => {
					if (isCobolFile(editor.document)) {
						updateDecorations(editor);
					}
				});
			} else if (event.affectsConfiguration('zrainbow.enabled')) {
				// Refresh all visible editors
				vscode.window.visibleTextEditors.forEach(editor => {
					if (isCobolFile(editor.document)) {
						updateDecorations(editor);
					}
				});
			}
		})
	);

	// Update decorations for currently active editor
	if (vscode.window.activeTextEditor && isCobolFile(vscode.window.activeTextEditor.document)) {
		updateDecorations(vscode.window.activeTextEditor);
	}

	// Atualiza a linha vertical quando o cursor se move (COM THROTTLING)
	context.subscriptions.push(
		vscode.window.onDidChangeTextEditorSelection(event => {
			const editor = event.textEditor;
			if (editor && isCobolFile(editor.document)) {
				// Throttle: limitar frequência de atualizações
				if (!selectionTimeout) {
					selectionTimeout = setTimeout(() => {
						updateDecorationsSelection(editor);
						selectionTimeout = null;
					}, SELECTION_THROTTLE);
				}
			}
		})
	);

	// Limpar cache quando um documento é fechado
	context.subscriptions.push(
		vscode.workspace.onDidCloseTextDocument(document => {
			documentCache.delete(document.uri.toString());
		})
	);
}

/**
 * Initialize decoration types for each nesting level
 */
function initializeDecorationTypes() {
       const colors = getColors();
       decorationTypes = colors.map(color => ({
	       opening: vscode.window.createTextEditorDecorationType({
		       color: color.opening,
		       fontWeight: 'bold'
	       }),
	       middle: vscode.window.createTextEditorDecorationType({
		       color: color.middle,
		       fontWeight: 'bold'
	       }),
	       closing: vscode.window.createTextEditorDecorationType({
		       color: color.closing,
		       fontWeight: 'bold'
	       })
       }));
       connectorTypes = colors.map(color =>
	       vscode.window.createTextEditorDecorationType({
		       isWholeLine: true,
		       borderColor: color.opening,
		       borderStyle: 'solid',
		       borderWidth: '0 0 0 3px',
		       borderRadius: '2px',
		       margin: '0 0 0 2px',
	       })
       );
}

/**
 * Check if document is a COBOL file
 */
function isCobolFile(document) {
	const language = document.languageId.toLowerCase();
	const extension = document.fileName.split('.').pop()?.toLowerCase();
	return language === 'cobol' ||
	       extension === 'cbl' ||
	       extension === 'cob' ||
	       extension === 'cobol';
}

/**
 * Check if a position in a line is inside a string literal
 */
function isInsideString(line, position) {
	let inSingleQuote = false;
	let inDoubleQuote = false;

	for (let i = 0; i < position && i < line.length; i++) {
		const char = line[i];

		if (char === "'" && !inDoubleQuote) {
			inSingleQuote = !inSingleQuote;
		} else if (char === '"' && !inSingleQuote) {
			inDoubleQuote = !inDoubleQuote;
		}
	}

	return inSingleQuote || inDoubleQuote;
}

/**
 * Extract word from line at position
 */
function getWordAtPosition(line, startPos) {
	let word = '';
	let pos = startPos;

	// Skip whitespace
	while (pos < line.length && /\s/.test(line[pos])) {
		pos++;
	}

	const wordStartPos = pos;

	// Extract word
	while (pos < line.length && /[a-z0-9\-]/i.test(line[pos])) {
		word += line[pos];
		pos++;
	}

	return { word: word.toUpperCase(), startPos: wordStartPos, endPos: pos };
}

/**
 * Parse COBOL document and find conditional structures
 */
function parseCobolStructures(document) {
	const structures = [];
	const stack = [];

	for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
		const line = document.lineAt(lineNum);
		const text = line.text;

		// Skip empty lines
		if (!text || text.trim().length === 0) {
			continue;
		}

		// Skip comment lines (asterisk in column 7 for fixed format, or starts with *)
		const trimmedText = text.trim();
		if (text.length > 6 && text[6] === '*') {
			continue;
		}
		if (trimmedText.startsWith('*')) {
			continue;
		}

		// Determine code area - support both fixed and free format
		let codeArea = text;
		let columnOffset = 0;

		// Check if it's fixed format COBOL (columns 1-6 for sequence, 7 for indicator)
		// Most COBOL code uses 6 spaces or numbers in first 6 positions
		if (text.length > 7) {
			const firstSix = text.substring(0, 6);
			const column7 = text[6];
			// Fixed format if first 6 are spaces/digits and column 7 is space
			if (/^[\s\d]{6}$/.test(firstSix) && column7 === ' ') {
				// Fixed format - code starts at column 8 (index 7)
				codeArea = text.substring(7);
				columnOffset = 7;
			} else {
				// Free format - use entire line
				codeArea = text;
				columnOffset = 0;
			}
		} else {
			// Free format or modernized COBOL - use entire line
			codeArea = text;
			columnOffset = 0;
		}

		// Find all keywords in the line
		let pos = 0;
		while (pos < codeArea.length) {
			const result = getWordAtPosition(codeArea, pos);
			const word = result.word;
			const wordStart = result.startPos;

			if (!word) {
				pos = result.endPos + 1;
				continue;
			}

			// Skip if the keyword is inside a string literal
			if (isInsideString(codeArea, wordStart)) {
				pos = result.endPos;
				continue;
			}

			// Check for opening keywords
			if (word === 'IF') {
				stack.push({
					type: 'IF',
					startLine: lineNum,
					startChar: columnOffset + wordStart,
					endChar: columnOffset + result.endPos,
					level: stack.length
				});
			} else if (word === 'PERFORM') {
				// Check if it's not "PERFORM procedure-name" but has UNTIL or contains block
				const remainingLine = codeArea.substring(result.endPos).toUpperCase();
				// Only track PERFORM with END-PERFORM (inline perform)
				if (remainingLine.includes('UNTIL') || remainingLine.includes('VARYING') || remainingLine.includes('TIMES')) {
					stack.push({
						type: 'PERFORM',
						startLine: lineNum,
						startChar: columnOffset + wordStart,
						endChar: columnOffset + result.endPos,
						level: stack.length
					});
				}
			} else if (word === 'EVALUATE') {
				stack.push({
					type: 'EVALUATE',
					startLine: lineNum,
					startChar: columnOffset + wordStart,
					endChar: columnOffset + result.endPos,
					level: stack.length,
					whens: []
				});
			} else if (word === 'WHEN' && stack.length > 0 && stack[stack.length - 1].type === 'EVALUATE') {
				// Add WHEN to the current EVALUATE
				stack[stack.length - 1].whens.push({
					line: lineNum,
					startChar: columnOffset + wordStart,
					endChar: columnOffset + result.endPos
				});
			} else if (word === 'ELSE') {
				// Find the most recent IF in the stack
				for (let i = stack.length - 1; i >= 0; i--) {
					if (stack[i].type === 'IF' && stack[i].elseLine === undefined) {
						stack[i].elseLine = lineNum;
						stack[i].elseStartChar = columnOffset + wordStart;
						stack[i].elseEndChar = columnOffset + result.endPos;
						break;
					}
				}
			} else if (word === 'END-IF' || word === 'END-PERFORM' || word === 'END-EVALUATE') {
				// Find matching opening
				const expectedType = word.substring(4); // Remove 'END-'

				for (let i = stack.length - 1; i >= 0; i--) {
					if (stack[i].type === expectedType) {
						const structure = stack.splice(i, 1)[0];
						structure.endLine = lineNum;
						structure.endStartChar = columnOffset + wordStart;
						structure.endEndChar = columnOffset + result.endPos;
						structures.push(structure);
						break;
					}
				}
			}

			pos = result.endPos;
		}
	}

	return structures;
}

/**
 * Obter estruturas parseadas com cache
 */
function getCachedStructures(document) {
	const uri = document.uri.toString();
	const version = document.version;

	// Verificar se temos cache válido
	const cached = documentCache.get(uri);
	if (cached && cached.version === version) {
		return cached.structures;
	}

	// Verificar tamanho do documento (aviso apenas uma vez)
	if (document.lineCount > MAX_DOCUMENT_SIZE && (!cached || !cached.warningShown)) {
		vscode.window.showWarningMessage(
			`zRainbow: Arquivo COBOL grande (${document.lineCount} linhas). Performance pode ser afetada.`,
			'OK'
		);
	}

	// Parse e cache
	const structures = parseCobolStructures(document);
	documentCache.set(uri, {
		version,
		structures,
		warningShown: document.lineCount > MAX_DOCUMENT_SIZE
	});

	return structures;
}

/**
 * Find active structure at cursor position
 */
function findActiveStructure(structures, selections) {
	let activeStructure = null;

	// Descobre se o cursor está sobre algum elemento de bloco
	for (const sel of selections) {
		const pos = sel.active;
		for (const structure of structures) {
			const level = structure.level % decorationTypes.length;

			// Opening
			if (pos.line === structure.startLine &&
			    pos.character >= structure.startChar &&
			    pos.character <= structure.endChar) {
				activeStructure = { structure, level };
				break;
			}

			// Closing
			if (structure.endLine !== undefined &&
			    pos.line === structure.endLine &&
			    pos.character >= structure.endStartChar &&
			    pos.character <= structure.endEndChar) {
				activeStructure = { structure, level };
				break;
			}

			// ELSE
			if (structure.elseLine !== undefined &&
			    pos.line === structure.elseLine &&
			    pos.character >= structure.elseStartChar &&
			    pos.character <= structure.elseEndChar) {
				activeStructure = { structure, level };
				break;
			}

			// WHENs
			if (structure.whens && structure.whens.length > 0) {
				for (const when of structure.whens) {
					if (pos.line === when.line &&
					    pos.character >= when.startChar &&
					    pos.character <= when.endChar) {
						activeStructure = { structure, level };
						break;
					}
				}
			}

			if (activeStructure) break;
		}
		if (activeStructure) break;
	}

	return activeStructure;
}

/**
 * Apply decorations to editor
 */
function applyDecorations(editor, structures, activeStructure) {
	// Group decorations by level and type
	const decorationsByLevel = {};

	structures.forEach(structure => {
		const level = structure.level % decorationTypes.length;

		if (!decorationsByLevel[level]) {
			decorationsByLevel[level] = {
				opening: [],
				middle: [],
				closing: []
			};
		}

		// Opening keyword decoration
		const openingRange = new vscode.Range(
			structure.startLine,
			structure.startChar,
			structure.startLine,
			structure.endChar
		);
		decorationsByLevel[level].opening.push({ range: openingRange });

		// Middle keyword decoration (ELSE ou WHEN)
		if (structure.elseLine !== undefined) {
			const elseRange = new vscode.Range(
				structure.elseLine,
				structure.elseStartChar,
				structure.elseLine,
				structure.elseEndChar
			);
			decorationsByLevel[level].middle.push({ range: elseRange });
		}

		if (structure.whens && structure.whens.length > 0) {
			structure.whens.forEach(when => {
				const whenRange = new vscode.Range(
					when.line,
					when.startChar,
					when.line,
					when.endChar
				);
				decorationsByLevel[level].middle.push({ range: whenRange });
			});
		}

		// Closing keyword decoration
		if (structure.endLine !== undefined) {
			const closingRange = new vscode.Range(
				structure.endLine,
				structure.endStartChar,
				structure.endLine,
				structure.endEndChar
			);
			decorationsByLevel[level].closing.push({ range: closingRange });
		}
	});

	// Aplica decorações
	for (let levelNum = 0; levelNum < decorationTypes.length; levelNum++) {
		const decorations = decorationsByLevel[levelNum] || { opening: [], middle: [], closing: [] };

		editor.setDecorations(decorationTypes[levelNum].opening, decorations.opening);
		editor.setDecorations(decorationTypes[levelNum].middle, decorations.middle);
		editor.setDecorations(decorationTypes[levelNum].closing, decorations.closing);

		// Só mostra a linha vertical se o cursor estiver sobre o bloco
		if (activeStructure && activeStructure.level === levelNum) {
			const s = activeStructure.structure;
			const lines = [];
			lines.push({ range: new vscode.Range(s.startLine, 0, s.startLine, 0) });
			if (s.elseLine !== undefined) {
				lines.push({ range: new vscode.Range(s.elseLine, 0, s.elseLine, 0) });
			}
			if (s.whens && s.whens.length > 0) {
				s.whens.forEach(when => lines.push({ range: new vscode.Range(when.line, 0, when.line, 0) }));
			}
			if (s.endLine !== undefined) {
				lines.push({ range: new vscode.Range(s.endLine, 0, s.endLine, 0) });
			}
			editor.setDecorations(connectorTypes[levelNum], lines);
		} else {
			editor.setDecorations(connectorTypes[levelNum], []);
		}
	}
}

/**
 * Update decorations for an editor (completo com cores e linhas)
 */
function updateDecorations(editor) {
	if (!editor) return;

	const config = vscode.workspace.getConfiguration('zrainbow');
	const enabled = config.get('enabled', true);

	// Clear all decorations if disabled
	if (!enabled) {
		decorationTypes.forEach(dt => {
			editor.setDecorations(dt.opening, []);
			editor.setDecorations(dt.middle, []);
			editor.setDecorations(dt.closing, []);
		});
		connectorTypes.forEach(ct => {
			editor.setDecorations(ct, []);
		});
		return;
	}

	const structures = getCachedStructures(editor.document);
	const activeStructure = findActiveStructure(structures, editor.selections);

	applyDecorations(editor, structures, activeStructure);
}

/**
 * Update apenas a seleção (apenas linhas verticais) - mais leve para mudanças de cursor
 */
function updateDecorationsSelection(editor) {
	if (!editor) return;

	const config = vscode.workspace.getConfiguration('zrainbow');
	const enabled = config.get('enabled', true);

	if (!enabled) return;

	// Usar cache para estruturas
	const structures = getCachedStructures(editor.document);
	const activeStructure = findActiveStructure(structures, editor.selections);

	// Limpar todas as linhas verticais e atualizar apenas a ativa
	connectorTypes.forEach((ct, idx) => {
		if (activeStructure && activeStructure.level === idx) {
			const s = activeStructure.structure;
			const lines = [];
			lines.push({ range: new vscode.Range(s.startLine, 0, s.startLine, 0) });
			if (s.elseLine !== undefined) {
				lines.push({ range: new vscode.Range(s.elseLine, 0, s.elseLine, 0) });
			}
			if (s.whens && s.whens.length > 0) {
				s.whens.forEach(when => lines.push({ range: new vscode.Range(when.line, 0, when.line, 0) }));
			}
			if (s.endLine !== undefined) {
				lines.push({ range: new vscode.Range(s.endLine, 0, s.endLine, 0) });
			}
			editor.setDecorations(ct, lines);
		} else {
			editor.setDecorations(ct, []);
		}
	});
}

// This method is called when your extension is deactivated
function deactivate() {
	// Limpar timeouts
	if (updateTimeout) {
		clearTimeout(updateTimeout);
		updateTimeout = null;
	}
	if (selectionTimeout) {
		clearTimeout(selectionTimeout);
		selectionTimeout = null;
	}

	// Limpar cache
	documentCache.clear();

	// Dispose decorations
	decorationTypes.forEach(dt => {
		dt.opening.dispose();
		dt.middle.dispose();
		dt.closing.dispose();
	});
	connectorTypes.forEach(dt => dt.dispose());
}

module.exports = {
	activate,
	deactivate
}
