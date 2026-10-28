import helloSource from "../generated/examples/hello.kwe?raw";
import variablesSource from "../generated/examples/tutorial-variables.kwe?raw";
import decisionsSource from "../generated/examples/tutorial-expressions-and-decisions.kwe?raw";
import loopsSource from "../generated/examples/tutorial-loops.kwe?raw";
import functionsSource from "../generated/examples/tutorial-functions.kwe?raw";
import collectionsSource from "../generated/examples/tutorial-collections.kwe?raw";
import stringsSource from "../generated/examples/tutorial-standard-library.kwe?raw";
import type {
  PlaygroundDiagnosticKind,
  PlaygroundDiagnosticResponse,
  PlaygroundWorkerResponse,
} from "../lib/playground-protocol";

const MAX_SOURCE_BYTES = 64 * 1024;
const EXECUTION_TIMEOUT_MS = 2_000;

const examples = [
  { id: "ndewo", name: "Ndewo Ụwa", source: helloSource },
  { id: "variables", name: "Variables and values", source: variablesSource },
  { id: "decisions", name: "Expressions and decisions", source: decisionsSource },
  { id: "loops", name: "Repetition", source: loopsSource },
  { id: "functions", name: "Functions", source: functionsSource },
  { id: "collections", name: "Arrays and objects", source: collectionsSource },
  { id: "strings", name: "Standard Library strings", source: stringsSource },
] as const;

type PlaygroundExample = (typeof examples)[number];

const byId = <T extends HTMLElement>(id: string, expected: new () => T): T => {
  const element = document.getElementById(id);
  if (!(element instanceof expected)) throw new Error(`Playground element #${id} is unavailable.`);
  return element;
};

const editor = byId("source-editor", HTMLTextAreaElement);
const exampleSelect = byId("example-select", HTMLSelectElement);
const runButton = byId("run-source", HTMLButtonElement);
const cancelButton = byId("cancel-source", HTMLButtonElement);
const resetButton = byId("reset-source", HTMLButtonElement);
const outputPanel = byId("playground-output", HTMLPreElement);
const outputPanelContainer = byId("output-panel", HTMLElement);
const errorPanel = byId("playground-error", HTMLElement);
const errorTitle = byId("playground-error-title", HTMLElement);
const errorMessage = byId("playground-error-message", HTMLElement);
const runStatus = byId("playground-status", HTMLElement);

let activeWorker: Worker | undefined;
let activeRequestId = 0;
let timeoutId: number | undefined;

const selectedExample = (): PlaygroundExample => examples.find((example) => example.id === exampleSelect.value) ?? examples[0];

const clearError = (): void => {
  errorPanel.hidden = true;
  errorTitle.textContent = "";
  errorMessage.textContent = "";
};

const clearResult = (): void => {
  clearError();
  outputPanel.textContent = "";
  outputPanelContainer.classList.add("playground-output--empty");
};

const diagnosticTitle = (kind: PlaygroundDiagnosticKind): string => {
  if (kind === "compile") return "Kwechiri could not compile this program.";
  if (kind === "runtime") return "The program stopped with a runtime error.";
  if (kind === "limit") return "The program reached a playground limit.";
  return "The playground could not complete this run.";
};

const showDiagnostic = (diagnostic: PlaygroundDiagnosticResponse): void => {
  outputPanel.textContent = "";
  outputPanelContainer.classList.add("playground-output--empty");
  errorTitle.textContent = diagnosticTitle(diagnostic.kind);
  errorMessage.textContent = diagnostic.message;
  errorPanel.hidden = false;
};

const finishRun = (): void => {
  if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  timeoutId = undefined;
  activeWorker?.terminate();
  activeWorker = undefined;
  runButton.disabled = false;
  cancelButton.disabled = true;
  resetButton.disabled = false;
  exampleSelect.disabled = false;
};

const cancelRun = (message = "Execution cancelled."): void => {
  const wasRunning = activeWorker !== undefined;
  finishRun();
  activeRequestId += 1;
  runStatus.textContent = wasRunning ? message : "Ready.";
  if (wasRunning) clearResult();
};

const showTimeout = (): void => {
  finishRun();
  activeRequestId += 1;
  runStatus.textContent = "Execution stopped after 2 seconds.";
  showDiagnostic({
    type: "diagnostic",
    requestId: activeRequestId,
    kind: "limit",
    message: "Execution exceeded the playground limit of 2 seconds. Check for a loop that never ends.",
  });
};

const runSource = (): void => {
  cancelRun();
  clearResult();

  const sourceBytes = new TextEncoder().encode(editor.value).byteLength;
  if (sourceBytes > MAX_SOURCE_BYTES) {
    runStatus.textContent = "Source is too large.";
    showDiagnostic({
      type: "diagnostic",
      requestId: activeRequestId,
      kind: "limit",
      message: "Source must be 64 KiB or smaller.",
    });
    return;
  }
  if (typeof Worker === "undefined") {
    runStatus.textContent = "Browser worker support is unavailable.";
    showDiagnostic({
      type: "diagnostic",
      requestId: activeRequestId,
      kind: "internal",
      message: "This browser does not support the dedicated worker required by the playground.",
    });
    return;
  }

  const requestId = activeRequestId + 1;
  activeRequestId = requestId;
  runButton.disabled = true;
  cancelButton.disabled = false;
  resetButton.disabled = true;
  exampleSelect.disabled = true;
  runStatus.textContent = "Compiling and running…";

  const worker = new Worker(new URL("../workers/playground.worker.ts", import.meta.url), {
    type: "module",
    name: "kwechiri-playground",
  });
  activeWorker = worker;
  timeoutId = window.setTimeout(showTimeout, EXECUTION_TIMEOUT_MS);

  worker.onmessage = (event: MessageEvent<PlaygroundWorkerResponse>): void => {
    const response = event.data;
    if (response.requestId !== activeRequestId) return;
    finishRun();
    if (response.type === "success") {
      if (response.output === "") {
        outputPanel.textContent = "The program completed without output.";
        outputPanelContainer.classList.add("playground-output--empty");
      } else {
        outputPanel.textContent = response.output;
        outputPanelContainer.classList.remove("playground-output--empty");
      }
      runStatus.textContent = `Finished in ${response.elapsedMs} ms.`;
      return;
    }
    runStatus.textContent = "Run stopped.";
    showDiagnostic(response);
  };

  worker.onerror = (): void => {
    if (requestId !== activeRequestId) return;
    finishRun();
    runStatus.textContent = "The dedicated worker failed.";
    showDiagnostic({
      type: "diagnostic",
      requestId,
      kind: "internal",
      message: "The playground worker could not start or was interrupted.",
    });
  };

  worker.postMessage({ type: "run", requestId, source: editor.value });
};

const loadExample = (): void => {
  cancelRun();
  editor.value = selectedExample().source.trimEnd();
  clearResult();
  runStatus.textContent = "Ready.";
  editor.focus();
};

exampleSelect.addEventListener("change", loadExample);
runButton.addEventListener("click", runSource);
cancelButton.addEventListener("click", () => cancelRun());
resetButton.addEventListener("click", loadExample);
editor.addEventListener("keydown", (event): void => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
    event.preventDefault();
    runSource();
  }
});

clearResult();
cancelButton.disabled = true;
runStatus.textContent = "Ready.";
