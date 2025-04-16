require('dotenv').config()
const ai =require("openai");
const OpenAI =ai.OpenAI
const promote = require("./promote")
const client = new OpenAI({
  apiKey: process.env.OPENAIKEY,
  baseURL:  process.env.OPENAPIURL,
  });


async function generate(promote) {
    const stream = await client.chat.completions.create({
        id: process.env.GPTID,
        model: "gpt-4o",
        messages: [
            promote
        ],
        venice_parameters: {
            include_venice_system_prompt: false,
          },
      });

      try{
        return JSON.parse(stream.choices[0].message.content)
      }catch(e)
      {
        return stream.choices[0].message.content
      }
}

async function chat(msg) {
    return await generate(
        {
            role: "user",
            content: `${promote.promote.init}${msg}`,
          }
    )
}

module.exports = {
    chat
}