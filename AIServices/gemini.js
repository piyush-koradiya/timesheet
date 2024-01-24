// node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-pro";
const API_KEY = process.env.GEMINI_API_KEY;
const logger = require('../logger/winston')

async function run(sentence, paraphrase) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const parts = [];

    if (paraphrase) {
      logger.debug(`GEMINI: paraphase without special character: [${sentence}]`);
      parts.push({ text: `paraphase without special character: [${sentence}]` });
    } else {
      logger.debug(`GEMINI: updating grammer for sentence: [${sentence}]`)
      parts.push({ text: `Please correct this sentence for spelling mistakes and grammer only if required to one sentence and without special character:  [${sentence}]` });
    }

    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });

    const response = result.response;
    logger.debug(`GEMINI: response ${response.text()}`);
    return response.text();

  } catch (error) {
      logger.error('🚀 ~ file: gemini.js:63 ~ run ~ error:', error)
      throw new Error(error);
  }
}

module.exports = run;