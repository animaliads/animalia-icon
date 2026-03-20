import path from "node:path";
import fs from "node:fs";
import subsetFont from "subset-font";

const SRC_PATH = path.join(__dirname, "../src");

const CHUNK_COUNT = 10;

interface Variant {
  dir: string;
  fontFamily: string;
  fontFileName: string;
  baseClass: string;
  /** Regex to match icon class rules — captures the full selector and the hex codepoint */
  iconRuleRegex: RegExp;
  /** Regex to extract the base class block (from class definition to closing brace) */
  baseClassRegex: RegExp;
}

const variants: Variant[] = [
  {
    dir: "regular",
    fontFamily: "Animalia",
    fontFileName: "Animalia",
    baseClass: ".an",
    iconRuleRegex: /^(\.an-[^:]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)";\s*\}/gm,
    baseClassRegex: /^\.an\s*\{[^}]+\}/ms,
  },
  {
    dir: "fill",
    fontFamily: "Animalia-Fill",
    fontFileName: "Animalia-Fill",
    baseClass: ".an-fill",
    iconRuleRegex:
      /^(\.an-fill\.[^:]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)";\s*\}/gm,
    baseClassRegex: /^\.an-fill\s*\{[^}]+\}/ms,
  },
];

function toHex(n: number): string {
  return n.toString(16).toUpperCase();
}

function buildUnicodeRange(codepoints: number[]): string {
  if (codepoints.length === 0) return "";
  const sorted = [...codepoints].sort((a, b) => a - b);

  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push(
        start === end ? `U+${toHex(start)}` : `U+${toHex(start)}-${toHex(end)}`
      );
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push(
    start === end ? `U+${toHex(start)}` : `U+${toHex(start)}-${toHex(end)}`
  );

  return ranges.join(", ");
}

async function processVariant(variant: Variant) {
  const variantDir = path.join(SRC_PATH, variant.dir);
  const cssPath = path.join(variantDir, "style.css");
  const ttfPath = path.join(variantDir, `${variant.fontFileName}.ttf`);

  const css = fs.readFileSync(cssPath, "utf-8");
  const ttfBuffer = fs.readFileSync(ttfPath);

  // Extract base class block
  const baseMatch = css.match(variant.baseClassRegex);
  if (!baseMatch) {
    throw new Error(`Could not find base class block for ${variant.dir}`);
  }
  const baseClassBlock = baseMatch[0];

  // Extract all icon rules
  const iconRules: { selector: string; codepoint: number; rule: string }[] = [];
  let match: RegExpExecArray | null;
  while ((match = variant.iconRuleRegex.exec(css)) !== null) {
    const selector = match[1];
    const codepoint = parseInt(match[2], 16);
    iconRules.push({
      selector,
      codepoint,
      rule: `${selector}:before {\n  content: "\\${match[2]}";\n}`,
    });
  }

  console.log(`[${variant.dir}] Found ${iconRules.length} icons`);

  // Sort by codepoint
  iconRules.sort((a, b) => a.codepoint - b.codepoint);

  // Split into chunks
  const chunkSize = Math.ceil(iconRules.length / CHUNK_COUNT);
  const chunks: typeof iconRules[] = [];
  for (let i = 0; i < iconRules.length; i += chunkSize) {
    chunks.push(iconRules.slice(i, i + chunkSize));
  }

  console.log(
    `[${variant.dir}] Splitting into ${chunks.length} chunks (~${chunkSize} icons each)`
  );

  // Generate subsets and build @font-face blocks
  const fontFaceBlocks: string[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const codepoints = [...new Set(chunk.map((r) => r.codepoint))];
    const codepointString = String.fromCodePoint(...codepoints);

    const woff2Buffer = await subsetFont(ttfBuffer, codepointString, {
      targetFormat: "woff2",
    });

    const outFileName = `${variant.fontFileName}.${i + 1}.woff2`;
    const outPath = path.join(variantDir, outFileName);
    fs.writeFileSync(outPath, woff2Buffer);

    const sizeKB = (woff2Buffer.length / 1024).toFixed(1);
    console.log(
      `[${variant.dir}] Chunk ${i + 1}: ${chunk.length} icons, ${sizeKB}KB → ${outFileName}`
    );

    const unicodeRange = buildUnicodeRange(codepoints);

    fontFaceBlocks.push(
      `@font-face {\n` +
        `  font-family: "${variant.fontFamily}";\n` +
        `  src: url("./${outFileName}") format("woff2");\n` +
        `  font-weight: normal;\n` +
        `  font-style: normal;\n` +
        `  font-display: block;\n` +
        `  unicode-range: ${unicodeRange};\n` +
        `}`
    );
  }

  // Build the new CSS
  const allIconRules = iconRules.map((r) => r.rule).join("\n");
  const newCss =
    fontFaceBlocks.join("\n\n") +
    "\n\n" +
    baseClassBlock +
    "\n\n" +
    allIconRules +
    "\n";

  fs.writeFileSync(cssPath, newCss);
  console.log(`[${variant.dir}] Wrote ${cssPath}`);
}

async function main() {
  for (const variant of variants) {
    await processVariant(variant);
  }
  console.log("\nDone! All subsets generated.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
