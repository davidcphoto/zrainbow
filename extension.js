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

		DarCorIfs(programa.ProcedureDivision.Objects.IfElseEndIfs, 0);
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function DarCorIfs(Elementos, indice) {

	const Cores = ["green", "red", "blue", "orange", "yellow"];
	let decoração1 = [];

	if (indice>=Cores.length) {
		indice=0;
	}

	for (let i = 0; i < Elementos.length; i++) {
		const element = Elementos[i];
		if (element.IfElseEndIf.If.range) {
			decoração1.push(element.IfElseEndIf.If.range);
			if (element.IfElseEndIf.If.Filhos.length>0){
				DarCorIfs(element.IfElseEndIf.If.Filhos, indice +1);
			}

		}
		if (element.IfElseEndIf.Else.range) {
			decoração1.push(element.IfElseEndIf.Else.range);
		} 
		if (element.IfElseEndIf.EndIf.range) {
			decoração1.push(element.IfElseEndIf.EndIf.range);
		}
	}

		const decoration1 = vscode.window.createTextEditorDecorationType({
			isWholeLine: false,
			color: Cores[indice]
		});
	vscode.window.activeTextEditor.setDecorations(decoration1,decoração1);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
			EndEvaluate: "END-EVALUATE",
			Perform: "PERFORM",
			EndPerform: "END-PERFORM",
			Ponto: "."
		}
		const Division = {
			Identification: "IDENTIFICATION",
			Enviroment: "ENVIRONMENT",
			Data: "DATA",
			Procedure: "PROCEDURE"
		}
		const ListaPalavras = ["IF", "ELSE", "END-IF", "EVALUATE", "END-EVALUATE", "PERFORM", "END-PERFORM", "."];

		this.Code = programa;
		const programaLimpo = programa.split('\r\n');


		ValidaDivision(programaLimpo);

		this.DataDivision = { Range: DataDivisionRange, Code: DataDivisionCode };
		this.EnviromentDivision = { Range: EnviromentDivisionRange, Code: EnviromentDivisionCode };
		this.IdentificationDivision = { Range: IdentificationDivisionRange, Code: IdentificationDivisionCode };
		this.ProcedureDivision = { Range: ProcedureDivisionRange, Code: ProcedureDivisionCode };

		const procedure = trataProcedureDivision(this);

		this.ProcedureDivision = { Range: ProcedureDivisionRange, Code: ProcedureDivisionCode, Objects: procedure };



		/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		function trataProcedureDivision(isto) {

			const Linhas = isto.ProcedureDivision.Code.split(separador);
			let ArrayPalavras = [];
			let codigo = true;

			for (let i = 0; i < Linhas.length; i++) {
				const linha = Linhas[i];
				// Separa a linha por espaços para validar que não é parte de outra palavra
				const linhaSeparada = linha.split(/(?=[. ])|(?<=[. ])/g);

				for (let j = 0; j < ListaPalavras.length; j++) {
					const palavra = ListaPalavras[j];
					if (palavra == "'" || palavra == '"') {
						codigo = !codigo;
					}
					if (linhaSeparada.includes(palavra) && codigo) {
						ArrayPalavras.push(ValidaPalavra(palavra, linha, i, isto));
					}
				}


			}

			const IfElseEndIfs = validaIfElseEndIf(ArrayPalavras);

			const retorno = { IfElseEndIfs: IfElseEndIfs }
			console.log(IfElseEndIfs[0].Code);

			return retorno;



			/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			function ValidaPalavra(Palavra = '', linha, i, isto) {

				const posição = linha.indexOf(Palavra);


				if (posição >= 0) {
					const linha = isto.ProcedureDivision.Range.start.line + i + 1;
					const caracter = posição;
					const inicio = new vscode.Position(linha, caracter);
					const Fim = new vscode.Position(linha, caracter + Palavra.length);
					return { palavra: Palavra, range: new vscode.Range(inicio, Fim) };
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
function validaIfElseEndIf(ArrayPalavras) {

	let IfElseEndIf = [];

	for (let i = 0; i < ArrayPalavras.length; i++) {
		const palavra = ArrayPalavras[i];

		// encontrou o primeiro if
		if (palavra.palavra == 'IF') {
			const condição = validaSaida(ArrayPalavras, i);
			const range = new vscode.Range(palavra.range.start, condição.retorno.Fim.end);
			const code = vscode.window.activeTextEditor.document.getText(range);
			IfElseEndIf.push({ IfElseEndIf: condição.retorno, Range: range, Code: code });
			i = condição.Posição;
		}

	}

	return IfElseEndIf;

	function validaSaida(array = [], posiçãoInicial) {

		let If = array[posiçãoInicial];
		let Else = { range: undefined };
		let EndIf = { range: undefined };
		let Filhos = [];
		let FilhosIf = [];
		let FilhosElse = [];
		let Fim = vscode.Range;

		for (let i = posiçãoInicial + 1; i < array.length; i++) {
			const element = array[i];
			switch (element.palavra) {
				case "ELSE":
					FilhosIf = Filhos;
					Else = array[i];
					Filhos = [];
					break;
				case "END-IF":
					if (Else.range) {
						FilhosElse = Filhos;
					} else {
						FilhosIf = Filhos;
					}
					EndIf = array[i];
					Fim = EndIf.range;
					return { retorno: { If: { range: If.range, Filhos: FilhosIf }, Else: { range: Else.range, Filhos: FilhosElse }, EndIf: { range: EndIf.range }, Fim: Fim }, Posição: i }
				case ".":
					if (EndIf.range) {
						Fim = EndIf.range;
					} else {
						Fim = element.range;
					}

					return { retorno: { If: { range: If.range, Filhos: FilhosIf }, Else: { range: Else.range, Filhos: FilhosElse }, EndIf: { range: EndIf.range }, Fim: Fim }, Posição: i }
				// break;
				case "IF":
					const retorno = validaSaida(ArrayPalavras, i);
					Filhos.push({IfElseEndIf: retorno.retorno});
					i = retorno.Posição;
					break;
			}

		}

	}
}

