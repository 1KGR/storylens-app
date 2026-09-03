// pdfjs-dist is large; only load it when a PDF actually needs parsing.
async function loadPdfjs() {
  const pdfjsLib = await import("pdfjs-dist");
  const pdfWorkerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
  return pdfjsLib;
}

export interface ParsedScene {
  heading: string;
  index: number;
}

export interface ParsedScreenplay {
  fileName: string;
  fileType: "pdf" | "docx" | "txt" | "pasted";
  text: string;
  pageCount: number | null;
  charCount: number;
  scenes: ParsedScene[];
  characters: string[];
}

const SLUGLINE_RE = /^\s*(INT|EXT|INT\.?\/EXT|I\/E)[.\s]/i;

function detectScenes(text: string): ParsedScene[] {
  const lines = text.split(/\r?\n/);
  const scenes: ParsedScene[] = [];
  lines.forEach((line) => {
    if (SLUGLINE_RE.test(line.trim())) {
      scenes.push({ heading: line.trim().slice(0, 80), index: scenes.length + 1 });
    }
  });
  return scenes;
}

function detectCharacters(text: string): string[] {
  const lines = text.split(/\r?\n/);
  const counts = new Map<string, number>();
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.length > 30 || line.length < 2) continue;
    if (SLUGLINE_RE.test(line)) continue;
    // A screenplay character cue is (close to) all-caps, not punctuation-heavy,
    // and doesn't look like a scene heading or a shout in dialogue.
    const letters = line.replace(/[^A-Za-z]/g, "");
    if (!letters) continue;
    const isUpper = letters === letters.toUpperCase() && /[A-Z]/.test(letters);
    if (!isUpper) continue;
    if (/\d{2,}/.test(line)) continue;
    const name = line.replace(/\s*\(.*?\)\s*$/, "").trim(); // strip "(V.O.)" etc.
    if (name.split(" ").length > 4) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([name]) => name);
}

function buildResult(fileName: string, fileType: ParsedScreenplay["fileType"], text: string, pageCount: number | null): ParsedScreenplay {
  return {
    fileName,
    fileType,
    text,
    pageCount,
    charCount: text.length,
    scenes: detectScenes(text),
    characters: detectCharacters(text),
  };
}

async function parsePdf(file: File): Promise<ParsedScreenplay> {
  const pdfjsLib = await loadPdfjs();
  const buf = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buf }).promise;
  const pageTexts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items.map((it) => ("str" in it ? it.str : "")).join(" ");
    pageTexts.push(pageText);
  }
  return buildResult(file.name, "pdf", pageTexts.join("\n"), doc.numPages);
}

async function parseDocx(file: File): Promise<ParsedScreenplay> {
  const mammoth = await import("mammoth/mammoth.browser");
  const buf = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer: buf });
  return buildResult(file.name, "docx", value, null);
}

async function parseTxt(file: File): Promise<ParsedScreenplay> {
  const text = await file.text();
  return buildResult(file.name, "txt", text, null);
}

export async function parseScreenplayFile(file: File): Promise<ParsedScreenplay> {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return parsePdf(file);
  if (ext === "docx") return parseDocx(file);
  if (ext === "txt") return parseTxt(file);
  // Fall back to reading as plain text for anything else the user drops in.
  return parseTxt(file);
}

export function parsePastedText(text: string): ParsedScreenplay {
  return buildResult("Pasted text", "pasted", text, null);
}
