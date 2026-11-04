/**
 * Read server secrets at request time.
 * Prefer bracket access so Next/webpack cannot inline a missing build-time value.
 */
export function getOpenAIApiKey(): string | undefined {
  const key = process.env["OPENAI_API_KEY"]?.trim();
  return key ? key : undefined;
}

export function getOpenAIVisionModel(): string {
  return process.env["OPENAI_VISION_MODEL"]?.trim() || "gpt-4o";
}

export function isOpenAIConfigured(): boolean {
  return Boolean(getOpenAIApiKey());
}
