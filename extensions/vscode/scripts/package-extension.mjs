import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import yazl from "yazl";

const extensionRoot = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("package.json", extensionRoot), "utf8"));
const outputPath = fileURLToPath(
  new URL(`../${manifest.name}-${manifest.version}.vsix`, import.meta.url),
);
const stableDate = new Date("1980-01-01T00:00:00.000Z");

const xmlEscape = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;");

const extensionManifest = `<?xml version="1.0" encoding="utf-8"?>
<PackageManifest Version="2.0.0" xmlns="http://schemas.microsoft.com/developer/vsx-schema/2011">
  <Metadata>
    <Identity Language="en-US" Id="${xmlEscape(manifest.name)}" Version="${xmlEscape(manifest.version)}" Publisher="${xmlEscape(manifest.publisher)}" />
    <DisplayName>${xmlEscape(manifest.displayName)}</DisplayName>
    <Description xml:space="preserve">${xmlEscape(manifest.description)}</Description>
    <Categories>${xmlEscape(manifest.categories.join(","))}</Categories>
  </Metadata>
  <Installation>
    <InstallationTarget Id="Microsoft.VisualStudio.Code" />
  </Installation>
  <Dependencies />
  <Assets>
    <Asset Type="Microsoft.VisualStudio.Code.Manifest" Path="extension/package.json" Addressable="true" />
  </Assets>
</PackageManifest>
`;

const contentTypes = `<?xml version="1.0" encoding="utf-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="json" ContentType="application/json" />
  <Default Extension="js" ContentType="application/javascript" />
  <Default Extension="md" ContentType="text/markdown" />
  <Default Extension="xml" ContentType="text/xml" />
  <Default Extension="vsixmanifest" ContentType="text/xml" />
</Types>
`;

const bundledFiles = [
  "package.json",
  "README.md",
  "language-configuration.json",
  "syntaxes/kwechiri.tmLanguage.json",
  "dist/extension.js",
];
const rootLicense = new URL("../../../LICENSE", import.meta.url);
const zip = new yazl.ZipFile();

zip.addBuffer(Buffer.from(extensionManifest), "extension.vsixmanifest", {
  mtime: stableDate,
});
zip.addBuffer(Buffer.from(contentTypes), "[Content_Types].xml", {
  mtime: stableDate,
});
for (const file of bundledFiles) {
  zip.addBuffer(
    await readFile(new URL(file, extensionRoot)),
    `extension/${file}`,
    { mtime: stableDate },
  );
}
zip.addBuffer(await readFile(rootLicense), "extension/LICENSE", {
  mtime: stableDate,
});

await new Promise((resolve, reject) => {
  const output = createWriteStream(outputPath);
  output.on("close", resolve);
  output.on("error", reject);
  zip.outputStream.on("error", reject).pipe(output);
  zip.end();
});

console.log(`Packaged ${outputPath}`);
