// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// let oldRange;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// vscode.workspace.onDidChangeTextDocument(Alterações => {
	// 	if (Alterações.document.languageId == "cobol") {
	// 		// console.log(Alterações.contentChanges[0].text);
	// 		// Alterações.contentChanges[0].text.replace(Alterações.contentChanges[0].text, Alterações.contentChanges[0].text.toUpperCase());
	// 		let Utexto = String(Alterações.contentChanges[0].text).toUpperCase();
	// 		const UtextoRange = Alterações.contentChanges[0].range;
	// 		// // Alterações.contentChanges[0].range.intersection
	// 		if (oldRange != UtextoRange) {
	// 			vscode.window.activeTextEditor.edit(edit => {
	// 				oldRange = UtextoRange;
	// 				edit.replace(UtextoRange, Utexto);
	// 			})
	// 		}
	// 		// console.log(Alterações.document.getText());
	// 		// .getText(Alterações.contentChanges[0].range).replace(Utexto);
	// 	}
	// })

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zrainbow" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('zrainbow.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from zRainbow!');
		// const PalavrasChave = DefinirKeywords();
		const programa = new Programa(vscode.window.activeTextEditor.document.getText());
		console.log(programa);
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

// function DefinirKeywords() {

// 	const texto = vscode.window.activeTextEditor.document.getText();
// 	const ListaPalavras = new Palavras(texto);

// 	// for (let i = 0; i < ListaPalavras.ListaPalavras.length; i++) {
// 	// 	const element = ListaPalavras.ListaPalavras[i].palavra;
// 	// 	console.log(`palavra ${element}`);

// 	// }

// }

// class Palavras {
// 	constructor(Texto = new String) {

// 		const PalavrasChave = { "PalavraInicial": 'if', "PalavraFinal": "end-if", "PalavraNoMeio": "else" };
// 		// const texto = removeSeqnumAste(Texto);

// 		const palavras = ObtemPosições(Texto, PalavrasChave, 0);

// 		this.Palavras = palavras;

// 		if (palavras) {
// 			this.háPalavras = true;
// 		} else {
// 			this.háPalavras = false;
// 		}

// 		function ObtemPosições(texto = new String, palavrasChave, inicio = 0) {


// 			const PosiçãoPalavraInicial = texto.indexOf(palavrasChave[0].PalavraInicial, inicio);

// 			const PosiçãoPalavraNoMeio = texto.indexOf(PalavrasChave[0].PalavraNoMeio, inicio);
// 			const PosiçãoPalavraFinal = texto.indexOf(PalavrasChave[0].PalavraFinal, inicio);
// 			const proximaPalavraInicial = texto.indexOf(PalavrasChave[0].PalavraInicial, PosiçãoPalavraInicial + 1);

// 			if (PosiçãoPalavraInicial < 0) {

// 				console.log('não tem ifs');
// 				return undefined;
// 			} else {

// 				if (proximaPalavraInicial < 0) {

// 					console.log('não tem mais ifs');

// 					if (PosiçãoPalavraFinal < 0) {
// 						console.log('não tem end-if');

// 						if (PosiçãoPalavraNoMeio < 0) {
// 							console.log('não tem nenhum else')
// 							console.log('------------Apenas o if fica com cor------------')

// 							return RetornaApenasIf();

// 						} else {
// 							console.log('tem else e não tem end')
// 							console.log('---------------o if fica com cor----------------')
// 							console.log('--------------o else fica com cor---------------')
// 							return RetornaIfElse();

// 						}
// 					} else {
// 						console.log('tem end-if')
// 						if (PosiçãoPalavraNoMeio < 0) {
// 							console.log('não tem nenhum else')
// 							console.log('---------------o if fica com cor----------------')
// 							console.log('-------------o end-if fica com cor--------------')
// 							return RetornaIfEndif();

// 						} else {
// 							console.log('tem else e end-if')
// 							console.log('---------------o if fica com cor----------------')
// 							console.log('--------------o else fica com cor---------------')
// 							console.log('-------------o end-if fica com cor--------------')
// 							return RetornaIfElseEndif();

// 						}

// 					}
// 				} else {

// 					console.log('tem mais ifs');

// 					if (PosiçãoPalavraFinal < 0) {
// 						console.log('não tem end if');

// 						if (PosiçãoPalavraNoMeio < 0) {
// 							console.log('não tem nenhum else nem end-if')
// 							console.log('o if e tratado como filho do if')
// 							console.log('---------------o if fica com cor----------------')
// 							console.log('----invoca o paragrafo para o segundo if--------')
// 							return RetornaApenasIf();

// 						} else {
// 							console.log('tem else sme end if')

// 							if (PosiçãoPalavraNoMeio < proximaPalavraInicial) {
// 								console.log('tem else antes do proximo if nao tem end if')
// 								console.log('if tratado com filho do else')
// 								console.log('---------------o if fica com cor----------------')
// 								console.log('--------------o else fica com cor---------------')
// 								console.log('----invoca o paragrafo para o segundo if--------')
// 								return RetornaIfElse();

// 							} else {
// 								console.log('tem else depois do proximo if nao tem end if')
// 								console.log('if tratado com filho do if else agrupa com segundo if')
// 								console.log('---------------o if fica com cor----------------')
// 								console.log('----invoca o paragrafo para o segundo if--------')
// 								return RetornaIfEndif();

// 							}

// 						}

// 					} else {
// 						console.log('tem end-if')

// 						if (PosiçãoPalavraNoMeio < 0) {
// 							console.log('não tem else')


// 							if (proximaPalavraInicial < PosiçãoPalavraFinal) {
// 								console.log('tem if antes do end if');

// 								console.log('não tem nenhum else o if é filho do if')
// 								console.log('---------------o if fica com cor----------------')
// 								console.log('-------------o end-if fica com cor--------------')
// 								console.log('----invoca o paragrafo para o segundo if--------')
// 								return RetornaIfEndif();

// 							} else {
// 								console.log('tem if depois do end if e não é filho');
// 								console.log('---------------o if fica com cor----------------')
// 								console.log('-------------o end-if fica com cor--------------')
// 								return RetornaIfEndif();

// 							}
// 						} else {
// 							console.log('tem else e end if')

// 							if (proximaPalavraInicial < PosiçãoPalavraNoMeio) {
// 								console.log('tem else e end if e o if é filho do if')
// 								console.log('---------------o if fica com cor----------------')
// 								console.log('--------------o else fica com cor---------------')
// 								console.log('-------------o end-if fica com cor--------------')
// 								console.log('----invoca o paragrafo para o segundo if--------')
// 								return RetornaIfElseEndif();
// 								console.log('validar um terceiro if que seja ainterior ao ')
// 							} else {

// 								if (proximaPalavraInicial < PosiçãoPalavraFinal) {
// 									console.log('tem if entre o else e o end if');
// 									console.log('if filho do else');
// 									console.log('---------------o if fica com cor----------------')
// 									console.log('--------------o else fica com cor---------------')
// 									console.log('-------------o end-if fica com cor--------------')
// 									console.log('----invoca o paragrafo para o segundo if--------')
// 									return RetornaIfElseEndif();

// 								} else {
// 									console.log('tem if depois do end if e não é filho');
// 									console.log('---------------o if fica com cor----------------')
// 									console.log('--------------o else fica com cor---------------')
// 									console.log('-------------o end-if fica com cor--------------')
// 									return RetornaIfElseEndif();

// 								}
// 							}
// 						}

// 					}

// 				}
// 			}

// 			function RetornaIfElseEndif() {
// 				return `{
// 						"Tipo":"IfThenElse,
// 						"Palafras":
// 						[
// 							{
// 								"If":{
// 									"inicio":"${PosiçãoPalavraInicial}",
// 									"fim":"${PosiçãoPalavraInicial + 2}",
// 									"filhos":"undefined"
// 								}
// 							},
// 							{
// 								"Else":"{
// 									"inicio":"${PosiçãoPalavraNoMeio}",
// 									"fim":"${PosiçãoPalavraNoMeio + 4}",
// 									"filhos":"undefined"
// 								}
// 							},
// 							{
// 								"End-if":{
// 									"inicio":"${PosiçãoPalavraFinal}",
// 									"fim":"${PosiçãoPalavraFinal + 6}",
// 									"filhos":"undefined"
// 								}
// 							}
// 						]
// 					}`;
// 			}

// 			function RetornaIfEndif() {
// 				return `{
// 						"Tipo":"IfThenElse,
// 						"Palafras":
// 						[
// 							{
// 								"If":{
// 									"inicio":"${PosiçãoPalavraInicial}",
// 									"fim":"${PosiçãoPalavraInicial + 2}",
// 									"filhos":"undefined"
// 								}
// 							},
// 							{
// 								"Else":"undefined"
// 							},
// 							{
// 								"End-if":{
// 									"inicio":"${PosiçãoPalavraFinal}",
// 									"fim":"${PosiçãoPalavraFinal + 6}",
// 									"filhos":"undefined"
// 								}
// 							}
// 						]
// 					}`;
// 			}

// 			function RetornaIfElse() {
// 				return `{
// 						"Tipo":"IfThenElse,
// 						"Palafras":
// 						[
// 							{
// 								"If":{
// 									"inicio":"${PosiçãoPalavraInicial}",
// 									"fim":"${PosiçãoPalavraInicial + 2}",
// 									"filhos":"undefined"
// 								}
// 							},
// 							{
// 								"Else":"{
// 									"inicio":"${PosiçãoPalavraNoMeio}",
// 									"fim":"${PosiçãoPalavraNoMeio + 4}",
// 									"filhos":"undefined"
// 								}
// 							},
// 							{
// 								"End-if":"undefined"
// 							}
// 						]
// 					}`;
// 			}

// 			function RetornaApenasIf() {

// 				return `{
// 					"Tipo":"IfThenElse,
// 					"Palafras":
// 					[
// 						{
// 							"If":{
// 								"inicio":"${PosiçãoPalavraInicial}",
// 								"fim":"${PosiçãoPalavraInicial + 2}",
// 								"filhos":"undefined"
// 							}
// 						},
// 						{
// 							"Else":"undefined"
// 						},
// 						{
// 							"End-if":"undefined"
// 						}
// 					]
// 				}`;
// 			}


// 		}


// 		function removeSeqnumAste(fullText) {

// 			let fullTextArray = fullText.split(/\r?\n|\r|\n/g);

// 			let resultado = '';

// 			for (let i = 0; i < fullTextArray.length; ++i) {


// 				if (fullTextArray[i].trim().length > 6) {

// 					if (fullTextArray[i].substring(6, 7) == '*' && fullTextArray[i].substring(7, 72).trim().length > 0) {
// 						resultado += Array(fullTextArray).join(' ');
// 					} else {
// 						resultado += fullTextArray[i];
// 					}
// 				}
// 			}
// 			return resultado;
// 		}
// 	}

// }

class Programa {
	constructor(programa) {

		const separador = '\r\n';

		let ActiveDivision = new String;
		let Inicio;
		let DataDivisionCode = '';
		let EnviromentDivisionCode = '';
		let ProcedureDivisionCode = '';
		let IdentificationDivisionCode = '';
		let DataDivisionRange;
		let EnviromentDivisionRange;
		let IdentificationDivisionRange;
		let ProcedureDivisionRange;
		;

		const Palavras = {
			If: "IF",
			Else: "ELSE",
			EndIf: "END-IF",
			PontoFinal: ".",
			Evaluate: "EVALUATE",
			EndEvaluate: "END-EVALUATE"
		}
		const Division = {
			Identification: "IDENTIFICATION",
			Enviroment: "ENVIRONMENT",
			Data: "DATA",
			Procedure: "PROCEDURE"
		}
		const ListaPalavras = ["IF", "ELSE", "END-IF", "EVALUATE", "END-EVALUATE", "."];

		this.Code = programa;
		const programaLimpo = programa.split('\r\n');

		// this.IdentificationDivision = programaLimpo.

		// for (let i = 0; i < programaLimpo.length; i++) {
		// 	const linha = programaLimpo[i];

		ValidaDivision(programaLimpo);
		// 	ValidaDivision(linha, i);
		// 				ProcedureDivisionRange = new vscode.Range(Inicio, Fim);

		// }

		this.DataDivision = { Range: DataDivisionRange, Code: DataDivisionCode };
		this.EnviromentDivision = { Range: EnviromentDivisionRange, Code: EnviromentDivisionCode };
		this.IdentificationDivision = { Range: IdentificationDivisionRange, Code: IdentificationDivisionCode };
		this.ProcedureDivision = { Range: ProcedureDivisionRange, Code: ProcedureDivisionCode };

		trataProcedureDivision(this);




		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function trataProcedureDivision(isto) {

			const Linhas = isto.ProcedureDivision.Code.split(separador);
			let ArrayPalavras = [];

			for (let i = 0; i < Linhas.length; i++) {
				const linha = Linhas[i];
				// Separa a linha por espaços para validar que não é parte de outra palavra
				const linhaSeparada = linha.split(' ');

				for (let j = 0; j < ListaPalavras.length; j++) {
					const palavra = ListaPalavras[j];
					if (linhaSeparada.includes(palavra)) {
						ArrayPalavras.push(ValidaPalavra(palavra, linha, i, isto));
					}
				}


			}

			console.log(ArrayPalavras);



			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			function ValidaPalavra(Palavra = '', linha, Linha, isto) {

				const posição = linha.indexOf(Palavra);

				if (posição >= 0) {
					const linha = isto.ProcedureDivision.Range.start.line + Linha;
					const caracter = posição;
					const inicio = new vscode.Position(linha, caracter);
					const Fim = new vscode.Position(linha, caracter+Palavra.length);
					return { oalavra: Palavra, range: new vscode.Range(inicio, Fim) };
				}
			}

		}

		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function ValidaDivision(linha = '') {

			linha += separador;
			let Fim;

			for (let i = 0; i < programaLimpo.length; i++) {
				const linha = programaLimpo[i];

				if (linha.toUpperCase().indexOf("DIVISION") >= 0 && linha.substring(6, 7) != '*') {

					// fechar activo
					Fim = new vscode.Position(i, linha.length);

					switch (ActiveDivision) {
						case Division.Data:
							DataDivisionRange = new vscode.Range(Inicio, Fim);
							// const DataDivision = { code: DataDivisionCode, Range: DataDivisionRange };
							break;
						case Division.Enviroment:
							EnviromentDivisionRange = new vscode.Range(Inicio, Fim);
							// const EnviromentDivision = { code: EnviromentDivisionCode, Range: EnviromentDivisionRange };
							break;
						case Division.Identification:
							IdentificationDivisionRange = new vscode.Range(Inicio, Fim);
							// const IdentificationDivision = { code: IdentificationDivisionCode, Range: IdentificationDivisionRange };
							break;
						case Division.Procedure:
							ProcedureDivisionRange = new vscode.Range(Inicio, Fim);
							// const ProcedureDivision = { code: ProcedureDivisionCode, Range: ProcedureDivisionRange };
							break;
						default:
							console.log('Nenhuma DIVISION definida ainda')
					}
					// Abre novo activo

					Inicio = new vscode.Position(i, 0);

					if (linha.toUpperCase().includes(Division.Data)) {
						ActiveDivision = Division.Data;
						DataDivisionCode += linha;
					}
					if (linha.toUpperCase().includes(Division.Enviroment)) {
						ActiveDivision = Division.Enviroment;
						EnviromentDivisionCode += linha;
					}
					if (linha.toUpperCase().includes(Division.Identification)) {
						ActiveDivision = Division.Identification;
						IdentificationDivisionCode += linha;
					}
					if (linha.toUpperCase().includes(Division.Procedure)) {
						ActiveDivision = Division.Procedure;
						ProcedureDivisionCode += linha;
					}
				} else {

					switch (ActiveDivision) {
						case Division.Data:
							DataDivisionCode += linha + separador;
							break;
						case Division.Enviroment:
							EnviromentDivisionCode += linha + separador;
							break;
						case Division.Identification:
							IdentificationDivisionCode += linha + separador;
							break;
						case Division.Procedure:
							ProcedureDivisionCode += linha + separador;
							break;
						default:
							console.log('Nenhuma DIVISION definida ainda')
					}
				}
			}

			ProcedureDivisionRange = new vscode.Range(Inicio, Fim);

		}

	}
}
