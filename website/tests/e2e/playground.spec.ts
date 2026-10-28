import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const expectedExamples = [
  {
    id: "ndewo",
    output: "Ndewo Ụwa!",
  },
  {
    id: "variables",
    output: "Uche\n36\neziokwu\nefu\nAda",
  },
  {
    id: "decisions",
    output: "16\neziokwu\nụgha\neziokwu\neziokwu\neziokwu\nOkenye",
  },
  {
    id: "loops",
    output: "Mgbe\n1\n2\n3\nKwụsị\n1\nGaa n'ihu\n1\n3\n4",
  },
  {
    id: "functions",
    output: "30\nOkenye\nNwatakịrị\nAda\nefu",
  },
  {
    id: "collections",
    output: '["Uche","Ada","Obi"]\n{"aha":"Uche","afọ":36}\nUche\n["Uche","Chidi","Obi"]\n{"aha":"Uche","afọ":37}',
  },
  {
    id: "strings",
    output: "eziokwu\nụgha\neziokwu\neziokwu\n6\nNdewo, Kwechiri\neziokwu",
  },
] as const;

test.describe.configure({ mode: "serial" });

test("runs every verified playground example", async ({ page }) => {
  await page.goto("/playground/");
  for (const example of expectedExamples) {
    await page.locator("#example-select").selectOption(example.id);
    await page.getByRole("button", { name: "Run" }).click();
    await expect(page.locator("#playground-status")).toContainText("Finished in", { timeout: 5_000 });
    await expect(page.getByRole("log", { name: "Program output" })).toHaveText(example.output);
  }
});

test("reports compile and runtime diagnostics without host stack traces", async ({ page }) => {
  await page.goto("/playground/");
  const editor = page.getByLabel("Kwechiri source code");
  const run = page.getByRole("button", { name: "Run" });
  const alert = page.getByRole("alert");

  await editor.fill("bipụta(amaghị)");
  await run.click();
  await expect(alert).toContainText("Kwechiri could not compile this program.");
  await expect(alert).toContainText("playground.kwe:1:8:");
  await expect(alert).not.toContainText(" at ");

  await editor.fill("bipụta(10 / 0)");
  await run.click();
  await expect(alert).toContainText("The program stopped with a runtime error.");
  await expect(alert).toContainText("Division by zero.");
  await expect(alert).not.toContainText(" at ");
});

test("rejects filesystem imports with the approved limitation", async ({ page }) => {
  await page.goto("/playground/");
  await page.getByLabel("Kwechiri source code").fill('webata { aha } site na "./aha.kwe"');
  await page.getByRole("button", { name: "Run" }).click();
  await expect(page.getByRole("alert")).toContainText("Filesystem modules are unavailable in the browser playground.");
});

test("enforces source, output, timeout, and cancellation controls", async ({ page }) => {
  test.setTimeout(15_000);
  await page.goto("/playground/");
  const editor = page.getByLabel("Kwechiri source code");
  const run = page.getByRole("button", { name: "Run" });
  const alert = page.getByRole("alert");

  await editor.fill(`#${"x".repeat(70 * 1024)}`);
  await run.click();
  await expect(page.locator("#playground-status")).toHaveText("Source is too large.");
  await expect(alert).toContainText("Source must be 64 KiB or smaller.");

  await editor.fill("i = 1\nmgbe (i <= 1001) {\n    bipụta(i)\n    i = i + 1\n}");
  await run.click();
  await expect(alert).toContainText("Program output exceeded the playground limit");

  await editor.fill("ọnụọgụ = 0\nmgbe (eziokwu) {\n    ọnụọgụ = ọnụọgụ + 1\n}");
  await run.click();
  await expect(page.locator("#playground-status")).toHaveText("Execution stopped after 2 seconds.", { timeout: 5_000 });
  await expect(alert).toContainText("Execution exceeded the playground limit of 2 seconds.");

  await run.click();
  await expect(page.getByRole("button", { name: "Cancel" })).toBeEnabled();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.locator("#playground-status")).toHaveText("Execution cancelled.");
});

test("runs from the keyboard without source uploads or browser storage", async ({ page }) => {
  await page.goto("/playground/");
  const marker = "PRIVATE-PLAYGROUND-MARKER";
  const editor = page.getByLabel("Kwechiri source code");
  await editor.fill(`bipụta("${marker}")`);

  const requests: { method: string; resourceType: string; url: string }[] = [];
  page.on("request", (request) => {
    requests.push({
      method: request.method(),
      resourceType: request.resourceType(),
      url: request.url(),
    });
  });

  await editor.focus();
  await page.keyboard.press("Control+Enter");
  await expect(page.getByRole("log", { name: "Program output" })).toHaveText(marker);
  expect(requests.every((request) => request.method === "GET")).toBe(true);
  expect(requests.every((request) => request.resourceType !== "xhr" && request.resourceType !== "fetch")).toBe(true);
  expect(requests.every((request) => !request.url.includes(marker))).toBe(true);
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});

test("has no automated WCAG A/AA violations", async ({ page }) => {
  await page.goto("/playground/");
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("has no horizontal overflow on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/playground/");
  const layout = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
    controlsOverflow: Array.from(document.querySelectorAll(".playground-actions button"))
      .some((button) => button.getBoundingClientRect().right > window.innerWidth),
  }));
  expect(layout.documentWidth).toBeLessThanOrEqual(layout.viewportWidth);
  expect(layout.controlsOverflow).toBe(false);
});
