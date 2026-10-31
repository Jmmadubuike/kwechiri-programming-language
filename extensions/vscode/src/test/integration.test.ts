import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import * as vscode from "vscode";

async function waitFor<T>(
  read: () => T | undefined,
  description: string,
  timeoutMilliseconds = 10_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMilliseconds;
  while (Date.now() < deadline) {
    const value = read();
    if (value !== undefined) return value;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${description}.`);
}

export async function run(): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), "kwechiri-vscode-"));
  const invalidFile = join(directory, "invalid.kwe");
  const missingModuleFile = join(directory, "missing-module.kwe");
  const standardLibraryFile = join(directory, "standard-library.kwe");

  try {
    console.log("Kwechiri extension test: opening invalid source.");
    await writeFile(invalidFile, "bipụta(amaghị)", "utf8");
    const invalidDocument = await vscode.workspace.openTextDocument(invalidFile);
    const invalidEditor = await vscode.window.showTextDocument(invalidDocument);
    console.log("Kwechiri extension test: invalid source opened.");

    assert.equal(invalidDocument.languageId, "kwechiri");
    const diagnostics = await waitFor(
      () => {
        const current = vscode.languages.getDiagnostics(invalidDocument.uri);
        return current.length > 0 ? current : undefined;
      },
      "located Kwechiri diagnostics",
    );
    console.log("Kwechiri extension test: located diagnostic observed.");
    assert.equal(diagnostics[0]?.severity, vscode.DiagnosticSeverity.Error);
    assert.equal(diagnostics[0]?.source, "kwechiri");
    assert.equal(diagnostics[0]?.code, "KWE-SEM-001");
    assert.match(diagnostics[0]?.message ?? "", /Undefined variable/);

    const semanticTokens = await vscode.commands.executeCommand<vscode.SemanticTokens>(
      "vscode.provideDocumentSemanticTokens",
      invalidDocument.uri,
    );
    console.log("Kwechiri extension test: semantic tokens observed.");
    assert.ok(semanticTokens !== undefined && semanticTokens.data.length > 0);

    await invalidEditor.edit((edit) => {
      edit.replace(
        invalidDocument.lineAt(0).range,
        'bipụta("Ndewo")',
      );
    });
    await invalidDocument.save();
    await waitFor(
      () => vscode.languages.getDiagnostics(invalidDocument.uri).length === 0 ? true : undefined,
      "diagnostics to clear",
    );
    console.log("Kwechiri extension test: corrected source cleared diagnostics.");

    await invalidEditor.edit((edit) => {
      edit.replace(
        invalidDocument.lineAt(0).range,
        "bipụta(amaghị)",
      );
    });
    await vscode.commands.executeCommand("kwechiri.checkCurrentFile");
    assert.equal(invalidDocument.isDirty, false);
    await waitFor(
      () => {
        const current = vscode.languages.getDiagnostics(invalidDocument.uri);
        return current.length > 0 ? current : undefined;
      },
      "manual check diagnostics",
    );
    console.log("Kwechiri extension test: manual check saved and produced diagnostics.");

    await writeFile(
      missingModuleFile,
      'webata { enyi } site na "./missing.kwe"',
      "utf8",
    );
    const missingModuleDocument = await vscode.workspace.openTextDocument(missingModuleFile);
    await vscode.window.showTextDocument(missingModuleDocument);
    const moduleDiagnostics = await waitFor(
      () => {
        const current = vscode.languages.getDiagnostics(missingModuleDocument.uri);
        return current.length > 0 ? current : undefined;
      },
      "missing module diagnostics",
    );
    console.log("Kwechiri extension test: missing module diagnostic observed.");
    assert.equal(moduleDiagnostics[0]?.code, "KWE-MOD-002");
    assert.match(moduleDiagnostics[0]?.message ?? "", /Missing imported module/);

    await writeFile(
      standardLibraryFile,
      'webata { wepuOghere } site na "kwechiri:eriri"\nbipụta(wepuOghere(42))',
      "utf8",
    );
    const standardLibraryDocument = await vscode.workspace.openTextDocument(standardLibraryFile);
    await vscode.window.showTextDocument(standardLibraryDocument);
    const standardLibraryDiagnostics = await waitFor(
      () => {
        const current = vscode.languages.getDiagnostics(standardLibraryDocument.uri);
        return current.length > 0 ? current : undefined;
      },
      "Batch 11C standard-library diagnostics",
    );
    console.log("Kwechiri extension test: Batch 11C diagnostic observed.");
    assert.equal(standardLibraryDiagnostics[0]?.code, "KWE-STD-004");
    assert.match(standardLibraryDiagnostics[0]?.message ?? "", /argument type mismatch/i);
  } finally {
    await vscode.commands.executeCommand("workbench.action.closeAllEditors");
    await new Promise((resolve) => setTimeout(resolve, 250));
    await rm(directory, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
}
