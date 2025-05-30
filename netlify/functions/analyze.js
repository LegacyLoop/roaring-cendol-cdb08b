const OpenAI = require("openai");

exports.handler = async function (event, context) {
  // Enable CORS for all origins
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Validate API key exists
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });

    // Parse request body
    const { imageBase64, prompt } = JSON.parse(event.body || '{}');
    
    if (!imageBase64) {
      throw new Error("No image data provided");
    }

    // Call OpenAI API with proper model name
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // Fixed the typo from "gpot-4oo"
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt || `Analyze this estate item and provide a JSON response with the following structure:
{
  "name": "Item name",
  "category": "Category (Furniture, Collectibles, Jewelry, etc.)",
  "description": "Detailed description including condition and notable features",
  "condition": "Condition assessment (Excellent, Good, Fair, Poor)",
  "age": "Estimated age or era",
  "estimated_value": "Price range like $50-$75",
  "confidence": "0.85",
  "market_demand": "High/Medium/Low",
  "selling_tips": "Brief advice for selling this item"
}`
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.3,
    });

    const result = response.choices[0].message.content;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        result: result,
        usage: response.usage 
      }),
    };

  } catch (err) {
    console.error("OpenAI API Error:", err);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: err.message || "Failed to analyze image",
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
      }),
    };
  }
};
