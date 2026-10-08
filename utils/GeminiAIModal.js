import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Models are tried in order. If one is overloaded (503), rate limited (429)
// or retired (404), the next one is used. Override with GEMINI_MODEL
// (comma-separated list) without touching code.
const DEFAULT_MODELS = ["gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.5-flash-lite"];
const MODELS = (process.env.GEMINI_MODEL || "")
  .split(",")
  .map((m) => m.trim())
  .filter(Boolean);
const MODEL_CHAIN = MODELS.length ? MODELS : DEFAULT_MODELS;

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
];

const RETRYABLE = /\b(429|500|503|504|404)\b|overloaded|high demand|unavailable|not found|no longer available/i;

/**
 * Generate content with automatic model fallback.
 * @param {string | Array} parts  prompt text, or an array of parts (text + inlineData)
 * @param {{ json?: boolean }} opts  json: ask the model for a JSON-only response
 * @returns {Promise<string>} the response text
 */
export async function generateText(parts, { json = false } = {}) {
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    maxOutputTokens: 8192,
    responseMimeType: json ? "application/json" : "text/plain",
  };

  let lastError;
  for (const modelName of MODEL_CHAIN) {
    // One quick retry per model for transient overload, then move on.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, generationConfig, safetySettings });
        const result = await model.generateContent(parts);
        const text = result.response.text();
        if (text?.trim()) return text;
        throw new Error("Empty response");
      } catch (error) {
        lastError = error;
        console.warn(`[gemini] ${modelName} attempt ${attempt + 1} failed: ${error.message}`);
        if (!RETRYABLE.test(String(error.message)) && error.message !== "Empty response") break;
        if (/404|not found|no longer available/i.test(error.message)) break;
        if (attempt === 0) await new Promise((r) => setTimeout(r, 800));
      }
    }
  }
  throw lastError;
}

/** Strip markdown fences / surrounding prose and parse the model's JSON output. */
export function parseAiJson(responseText) {
  const cleaned = String(responseText)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Fall back to the first {...} or [...] block in the text.
    const start = cleaned.search(/[[{]/);
    const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
    if (start === -1 || end <= start) throw new Error("No JSON found in AI response");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}
