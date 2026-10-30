import { existsSync } from "node:fs";
import * as vscode from "vscode";
import { compileFile } from "../../../src/compiler/compile-file.js";
import { compilerProblemFromError, diagnosticFileName } from "./diagnostics.js";
import {
  semanticTokenData,
  semanticTokenModifiers,
  semanticTokenTypes,
} from "./semantic-tokens.js";

const languageId = "kwechiri";
const checkCommand = "kwechiri.checkCurrentFile";

function isKwechiriDocument(document: vscode.TextDocument): boolean {
  return document.languageId === languageId && document.uri.scheme === "file";
}

function rangeForProblem(problem: { readonly line: number; readonly column: number }): vscode.Range {
  const line = Math.max(0, problem.line - 1);
  const column = Math.max(0, problem.column - 1);
  return new vscode.Range(line, column, line, column + 1);
}

class KwechiriChecker implements vscode.Disposable {
  private readonly diagnostics = vscode.languages.createDiagnosticCollection("kwechiri");
  private readonly output = vscode.window.createOutputChannel("Kwechiri");
  private readonly status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  private readonly revisions = new Map<string, number>();

  public constructor() {
    this.status.command = checkCommand;
    this.status.text = "$(symbol-keyword) Kwechiri";
    this.status.tooltip = "Check the current Kwechiri file.";
  }

  public async check(document: vscode.TextDocument): Promise<void> {
    if (!isKwechiriDocument(document)) return;

    const key = document.uri.toString();
    const revision = (this.revisions.get(key) ?? 0) + 1;
    this.revisions.set(key, revision);
    this.status.text = "$(sync~spin) Kwechiri";
    this.status.tooltip = "Checking Kwechiri source without executing it.";
    this.output.appendLine(`Checking ${document.uri.fsPath}`);

    try {
      await compileFile(document.uri.fsPath);
      if (this.revisions.get(key) !== revision) return;
      this.diagnostics.delete(document.uri);
      this.status.text = "$(pass) Kwechiri";
      this.status.tooltip = "No Kwechiri diagnostics.";
      this.output.appendLine("No diagnostics.");
    } catch (error: unknown) {
      if (this.revisions.get(key) !== revision) return;

      const problem = compilerProblemFromError(error, document.uri.fsPath);
      if (problem === undefined) {
        const detail = error instanceof Error ? error.message : "An unknown value was thrown.";
        this.output.appendLine(`Editor diagnostic failure: ${detail}`);
        this.status.text = "$(error) Kwechiri";
        this.status.tooltip = "Kwechiri could not complete the editor check.";
        void vscode.window.showErrorMessage("Kwechiri could not complete the editor check. See the Kwechiri output channel.");
        return;
      }

      const targetFile = diagnosticFileName(problem, document.uri.fsPath, existsSync(problem.fileName));
      const targetUri = vscode.Uri.file(targetFile);
      const diagnostic = new vscode.Diagnostic(
        rangeForProblem(problem),
        problem.message,
        vscode.DiagnosticSeverity.Error,
      );
      diagnostic.source = "kwechiri";
      diagnostic.code = problem.code;
      this.diagnostics.set(targetUri, [diagnostic]);
      if (targetUri.toString() !== document.uri.toString()) this.diagnostics.delete(document.uri);
      this.status.text = "$(error) Kwechiri";
      this.status.tooltip = `${problem.line}:${problem.column} ${problem.code}: ${problem.message}`;
      this.output.appendLine(`${problem.fileName}:${problem.line}:${problem.column}: ${problem.code}: ${problem.message}`);
    }
  }

  public invalidate(document: vscode.TextDocument): void {
    if (!isKwechiriDocument(document)) return;
    const key = document.uri.toString();
    this.revisions.set(key, (this.revisions.get(key) ?? 0) + 1);
    this.diagnostics.delete(document.uri);
    this.status.text = "$(edit) Kwechiri";
    this.status.tooltip = "Save or run Kwechiri: Check Current File.";
  }

  public clear(document: vscode.TextDocument): void {
    const key = document.uri.toString();
    this.revisions.set(key, (this.revisions.get(key) ?? 0) + 1);
    this.diagnostics.delete(document.uri);
  }

  public updateStatus(editor: vscode.TextEditor | undefined): void {
    if (editor?.document.languageId === languageId) this.status.show();
    else this.status.hide();
  }

  public dispose(): void {
    this.diagnostics.dispose();
    this.output.dispose();
    this.status.dispose();
  }
}

export function activate(context: vscode.ExtensionContext): void {
  const checker = new KwechiriChecker();
  const selector: vscode.DocumentSelector = { language: languageId };
  const legend = new vscode.SemanticTokensLegend(
    [...semanticTokenTypes],
    [...semanticTokenModifiers],
  );
  const semanticTokens = vscode.languages.registerDocumentSemanticTokensProvider(
    selector,
    {
      provideDocumentSemanticTokens(document): vscode.SemanticTokens {
        try {
          return new vscode.SemanticTokens(
            new Uint32Array(semanticTokenData(document.getText(), document.uri.fsPath)),
          );
        } catch {
          return new vscode.SemanticTokens(new Uint32Array());
        }
      },
    },
    legend,
  );

  context.subscriptions.push(
    checker,
    semanticTokens,
    vscode.commands.registerCommand(checkCommand, async () => {
      const document = vscode.window.activeTextEditor?.document;
      if (document === undefined || !isKwechiriDocument(document)) {
        vscode.window.showWarningMessage("Open a saved .kwe file before running the Kwechiri check.");
        return;
      }
      if (document.isDirty) await document.save();
      await checker.check(document);
    }),
    vscode.workspace.onDidOpenTextDocument((document) => void checker.check(document)),
    vscode.workspace.onDidSaveTextDocument((document) => void checker.check(document)),
    vscode.workspace.onDidChangeTextDocument((event) => checker.invalidate(event.document)),
    vscode.workspace.onDidCloseTextDocument((document) => checker.clear(document)),
    vscode.window.onDidChangeActiveTextEditor((editor) => checker.updateStatus(editor)),
  );

  checker.updateStatus(vscode.window.activeTextEditor);
  for (const document of vscode.workspace.textDocuments) void checker.check(document);
}

export function deactivate(): void {}
