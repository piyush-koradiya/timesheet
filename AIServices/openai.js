const OpenAI = require('openai');

const logger = require('../logger/winston');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function run(sentence, paraphrase) {
  let completion;
  if (paraphrase) {
    logger.debug(`OPENAI: paraphase without special character: [${sentence}]`);
    completion = await openai.chat.completions.create({
      messages: [{ "role": "user", "content": `paraphase without special character: [${sentence}]` }],
      model: "gpt-3.5-turbo",
    });
  } else {
    logger.debug(`OPENAI: updating grammer for sentence: [${sentence}]`)
    completion = await openai.chat.completions.create({
      messages: [{ "role": "user", "content": `Please correct this sentence for spelling mistakes and grammer only if required to one sentence and without special character:  [${sentence}]` }],
      model: "gpt-3.5-turbo",
    });
  }

  logger.debug(`OPENAI: response ${completion.choices[0].message.content}`);
  return completion.choices[0].message.content;
}

module.exports = run;