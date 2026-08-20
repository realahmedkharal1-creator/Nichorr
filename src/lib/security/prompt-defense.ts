export class PromptDefenseGuard {
  static sanitizeExternalContent(rawContent: string): {
    safeContent: string;
    injectionDetected: boolean;
  } {
    if (!rawContent) return { safeContent: "", injectionDetected: false };

    const injectionPatterns = [
      /ignore previous instructions/i,
      /ignore all prior prompts/i,
      /system prompt override/i,
      /you are now an unfiltered ai/i,
      /bypass safety boundaries/i,
    ];

    let injectionDetected = false;
    let safeContent = rawContent;

    for (const pattern of injectionPatterns) {
      if (pattern.test(safeContent)) {
        injectionDetected = true;
        safeContent = safeContent.replace(pattern, "[FILTERED_PROMPT_INJECTION_ATTEMPT]");
      }
    }

    return { safeContent, injectionDetected };
  }
}
