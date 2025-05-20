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
		const PalavrasChave = DefinirKeywords();
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

function DefinirKeywords() {

	const texto = vscode.window.activeTextEditor.document.getText();
	const ListaPalavras = new Palavras(texto);

	// for (let i = 0; i < ListaPalavras.ListaPalavras.length; i++) {
	// 	const element = ListaPalavras.ListaPalavras[i].palavra;
	// 	console.log(`palavra ${element}`);

	// }

}

class Palavras {
	constructor(Texto = new String) {

		const PalavrasChave = { "PalavraInicial": 'if', "PalavraFinal": "end-if", "PalavraNoMeio": "else" };
		const texto = removeSeqnumAste(Texto);

		const palavras = ObtemPosições(texto, PalavrasChave, 0);

		this.Palavras = palavras;

		if (palavras) {
			this.háPalavras = true;
		} else {
			this.háPalavras = false;
		}

		function ObtemPosições(texto = '', palavrasChave, inicio = 0) {


			const PosiçãoPalavraInicial = texto.indexOf(palavrasChave[0].PalavraInicial, inicio);

			const PosiçãoPalavraNoMeio = texto.indexOf(PalavrasChave[0].PalavraNoMeio, inicio);
			const PosiçãoPalavraFinal = texto.indexOf(PalavrasChave[0].PalavraFinal, inicio);
			const proximaPalavraInicial = texto.indexOf(PalavrasChave[0].PalavraInicial, PosiçãoPalavraInicial + 1);

			if (PosiçãoPalavraInicial < 0) {

				console.log('não tem ifs');
				return undefined;
			} else {

				if (proximaPalavraInicial < 0) {

					console.log('não tem mais ifs');

					if (PosiçãoPalavraFinal < 0) {
						console.log('não tem end-if');

						if (PosiçãoPalavraNoMeio < 0) {
							console.log('não tem nenhum else')
							console.log('------------Apenas o if fica com cor------------')

							return RetornaApenasIf();

						} else {
							console.log('tem else e não tem end')
							console.log('---------------o if fica com cor----------------')
							console.log('--------------o else fica com cor---------------')
							return RetornaIfElse();

						}
					} else {
						console.log('tem end-if')
						if (PosiçãoPalavraNoMeio < 0) {
							console.log('não tem nenhum else')
							console.log('---------------o if fica com cor----------------')
							console.log('-------------o end-if fica com cor--------------')
							return RetornaIfEndif();

						} else {
							console.log('tem else e end-if')
							console.log('---------------o if fica com cor----------------')
							console.log('--------------o else fica com cor---------------')
							console.log('-------------o end-if fica com cor--------------')
							return RetornaIfElseEndif();

						}

					}
				} else {

					console.log('tem mais ifs');

					if (PosiçãoPalavraFinal < 0) {
						console.log('não tem end if');

						if (PosiçãoPalavraNoMeio < 0) {
							console.log('não tem nenhum else nem end-if')
							console.log('o if e tratado como filho do if')
							console.log('---------------o if fica com cor----------------')
							console.log('----invoca o paragrafo para o segundo if--------')
							return RetornaApenasIf();

						} else {
							console.log('tem else sme end if')

							if (PosiçãoPalavraNoMeio < proximaPalavraInicial) {
								console.log('tem else antes do proximo if nao tem end if')
								console.log('if tratado com filho do else')
								console.log('---------------o if fica com cor----------------')
								console.log('--------------o else fica com cor---------------')
								console.log('----invoca o paragrafo para o segundo if--------')
								return RetornaIfElse();

							} else {
								console.log('tem else depois do proximo if nao tem end if')
								console.log('if tratado com filho do if else agrupa com segundo if')
								console.log('---------------o if fica com cor----------------')
								console.log('----invoca o paragrafo para o segundo if--------')
								return RetornaIfEndif();

							}

						}

					} else {
						console.log('tem end-if')

						if (PosiçãoPalavraNoMeio < 0) {
							console.log('não tem else')


							if (proximaPalavraInicial < PosiçãoPalavraFinal) {
								console.log('tem if antes do end if');

								console.log('não tem nenhum else o if é filho do if')
								console.log('---------------o if fica com cor----------------')
								console.log('-------------o end-if fica com cor--------------')
								console.log('----invoca o paragrafo para o segundo if--------')
								return RetornaIfEndif();

							} else {
								console.log('tem if depois do end if e não é filho');
								console.log('---------------o if fica com cor----------------')
								console.log('-------------o end-if fica com cor--------------')
								return RetornaIfEndif();

							}
						} else {
							console.log('tem else e end if')

							if (proximaPalavraInicial < PosiçãoPalavraNoMeio) {
								console.log('tem else e end if e o if é filho do if')
								console.log('---------------o if fica com cor----------------')
								console.log('--------------o else fica com cor---------------')
								console.log('-------------o end-if fica com cor--------------')
								console.log('----invoca o paragrafo para o segundo if--------')
								return RetornaIfElseEndif();
								console.log('validar um terceiro if que seja ainterior ao ')
							} else {

								if (proximaPalavraInicial < PosiçãoPalavraFinal) {
									console.log('tem if entre o else e o end if');
									console.log('if filho do else');
									console.log('---------------o if fica com cor----------------')
									console.log('--------------o else fica com cor---------------')
									console.log('-------------o end-if fica com cor--------------')
									console.log('----invoca o paragrafo para o segundo if--------')
									return RetornaIfElseEndif();

								} else {
									console.log('tem if depois do end if e não é filho');
									console.log('---------------o if fica com cor----------------')
									console.log('--------------o else fica com cor---------------')
									console.log('-------------o end-if fica com cor--------------')
									return RetornaIfElseEndif();

								}
							}
						}

					}

				}
			}

			function RetornaIfElseEndif() {
				return `{
						"Tipo":"IfThenElse,
						"Palafras":
						[
							{
								"If":{
									"inicio":"${PosiçãoPalavraInicial}",
									"fim":"${PosiçãoPalavraInicial + 2}",
									"filhos":"undefined"
								}
							},
							{
								"Else":"{
									"inicio":"${PosiçãoPalavraNoMeio}",
									"fim":"${PosiçãoPalavraNoMeio + 4}",
									"filhos":"undefined"
								}
							},
							{
								"End-if":{
									"inicio":"${PosiçãoPalavraFinal}",
									"fim":"${PosiçãoPalavraFinal + 6}",
									"filhos":"undefined"
								}
							}
						]
					}`;
			}

			function RetornaIfEndif() {
				return `{
						"Tipo":"IfThenElse,
						"Palafras":
						[
							{
								"If":{
									"inicio":"${PosiçãoPalavraInicial}",
									"fim":"${PosiçãoPalavraInicial + 2}",
									"filhos":"undefined"
								}
							},
							{
								"Else":"undefined"
							},
							{
								"End-if":{
									"inicio":"${PosiçãoPalavraFinal}",
									"fim":"${PosiçãoPalavraFinal + 6}",
									"filhos":"undefined"
								}
							}
						]
					}`;
			}

			function RetornaIfElse() {
				return `{
						"Tipo":"IfThenElse,
						"Palafras":
						[
							{
								"If":{
									"inicio":"${PosiçãoPalavraInicial}",
									"fim":"${PosiçãoPalavraInicial + 2}",
									"filhos":"undefined"
								}
							},
							{
								"Else":"{
									"inicio":"${PosiçãoPalavraNoMeio}",
									"fim":"${PosiçãoPalavraNoMeio + 4}",
									"filhos":"undefined"
								}
							},
							{
								"End-if":"undefined"
							}
						]
					}`;
			}

			function RetornaApenasIf() {

				return `{
					"Tipo":"IfThenElse,
					"Palafras":
					[
						{
							"If":{
								"inicio":"${PosiçãoPalavraInicial}",
								"fim":"${PosiçãoPalavraInicial + 2}",
								"filhos":"undefined"
							}
						},
						{
							"Else":"undefined"
						},
						{
							"End-if":"undefined"
						}
					]
				}`;
			}


		}


		function removeSeqnumAste(fullText) {

			let fullTextArray = fullText.split(/\r?\n|\r|\n/g);

			let resultado = '';

			for (let i = 0; i < fullTextArray.length; ++i) {


				if (fullTextArray[i].trim().length > 6) {

					if (fullTextArray[i].substring(6, 7) == '*' && fullTextArray[i].substring(7, 72).trim().length > 0) {
						resultado += Array(fullTextArray).join(' ');
					} else {
						resultado += fullTextArray[i];
					}
				}
			}
			return resultado;
		}
	}

}

class Programa {
	constructor(programa) {

		
			const Palavras = {
				If: "IF",
				Else:"ELSE",
				EndIf:"END-IF",
				PontoFinal:"."
			}

		this.codigo = programa;
		const programaLimpo = removeSeqnumAste(programa).split('\n');

		// this.IdentificationDivision = programaLimpo.

		for (let i = 0; i < programaLimpo.length; i++) {
			const linha = programaLimpo[i];

			ValidaDivision(linha, i);

		}

		trataProcedureDivision();

		const Division = {
			Identification: "IDENTIFICATION",
			Enviroment: "ENVIRONMENT",
			Data: "DATA",
			Procedure: "PROCEDURE"
		}


		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function trataProcedureDivision(){

			const Linhas = this.ProcedureDivision.Code.split('\n');
			let ArrayPalavras=[];
			let ELSEs=[];
			let END_IFs=[];
			let PONTOSs=[];
			const ListaPalavras = ["IF", "ELSE", "END-IF", ".", "EVALUATE", "END-EVALUATE", ];

			for (let i = 0; i < Linhas.length; i++) {
				const linha = Linhas[i];

				for (let j = 0; j < ListaPalavras.length; j++) {
					const palavra = ListaPalavras[j];
					ArrayPalavras.push(ValidaPalavra.call(palavra, linha, i));
				}
				
				
			}



			function ValidaPalavra(Palavra='', linha, Linha) {

				const posição = linha.indexOf(Palavra);

				if (posição >= 0) {
					const linha = this.ProcedureDivision.Range.start.line + Linha;
					const caracter = posição;
					const inicio = new vscode.Position(linha, caracter);
					const Fim = new vscode.Position(linha, caracter.Palavra.length);
					return {oalavra:Palavra, range: new vscode.Range(inicio, Fim)};
				}
			}

		}
		
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function ValidaDivision(linha = '', NumeroLinha = 0) {

			let ActiveDivision = "";
			let Inicio;

			if (linha.indexOf("DIVISION") >= 0) {

				// fechar activo
				const Fim=new vscode.Position(NumeroLinha, linha.length);

				switch(ActiveDivision) {
					case Division.Data:
						this.DataDivision.Range= new vscode.Range(Inicio, Fim);
						break;
						case Division.Enviroment:
						this.EnviromentDivision.Range= new vscode.Range(Inicio, Fim);
							break;
						case Division.Identification:
						this.IdentificationDivision.Range= new vscode.Range(Inicio, Fim);
							break;
						case Division.Procedure:
						this.ProcedureDivision.Range= new vscode.Range(Inicio, Fim);
							break;
				}
				// Abre novo activo
				
				Inicio = new vscode.Position(NumeroLinha, 0);

				if (linha.indexOf(Division.Data)) {
					ActiveDivision = Division.Data;
					this.DataDivision.code += linha;
				}
				if (linha.indexOf(Division.Enviroment)) {
					ActiveDivision = Division.Enviroment;
					this.EnviromentDivision.code += linha;
				}
				if (linha.indexOf(Division.Identification)) {
					ActiveDivision = Division.Identification;
					this.IdentificationDivision.code += linha;
				}
				if (linha.indexOf(Division.Procedure)) {
					ActiveDivision = Division.Procedure;
					this.ProcedureDivision.code += linha;
				}
			}
		}
		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function removeSeqnumAste(fullText) {

			let fullTextArray = fullText.split(/\r?\n|\r|\n/g);

			let resultado = '';

			for (let i = 0; i < fullTextArray.length; ++i) {


				if (fullTextArray[i].trim().length > 6) {

					if (fullTextArray[i].substring(6, 7) == '*' && fullTextArray[i].substring(7, 72).trim().length > 0) {
						resultado += Array(fullTextArray).join(' ');
					} else {
						resultado += fullTextArray[i];
					}
				}
			}
			return resultado;
		}
	}
}
