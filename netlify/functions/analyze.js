const OpenAI = require("openai");
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.handler = async function (event) {
  try {
    const { imageBase64, prompt } = JSON.parse(event.body);

    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        { role: "user", content: prompt },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 600,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.choices[0].message.content }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
