const axios = require("axios");
require("dotenv").config();

const cerebrasKey = process.env.CEREBRAS_KEY;
if (!cerebrasKey) {
  throw new Error(
    "CEREBRAS_KEY not found in environment variables. Please add it to your .env file."
  );
}

const charPrompt = `You are helping to create a keyboard that dynamically resizes keys based on letter probability.
Your task is to predict the most likely next characters so we can make them bigger on our keyboard.

**Task:** Analyze both the previous context and current word being typed (at end of the context) to provide confidence values for the next character. For each of the 5 most likely characters, assign a confidence score from 0-1 representing how confident you are that the following character is the next one to be typed.
- If you are very unconfident about the next character, your confidences should be low
- It is fully acceptable to return an empty list if you are unconfident about the next character
- The "backspace" key (call with BACKSPACE) and "space" key (call with SPACE) are valid choices to list if you think we are at the end of a word or there is a typo
Do this using:
- Word completion possibilities for the current word being typed
- Full sentence/paragraph context and meaning from previous words
- Semantic relationships between previous context and current word completion
- Common English language patterns and vocabulary
- Grammar regarding tenses (past, present, future)
- Sentence structure, grammar, and semantic context from preceding words
- Punctuation and spacing appropriateness based on sentence flow
- Common word sequences and phrases that follow the established context

**Example:**
Previous Context: "I need to go to the"
Current Word: "sto"

Expected Output (Python Array): [("r", 0.80), ("p", 0.10)]

This is because "store" or "storage" are very likely to follow. "Stop" is also a possibility, but it is not as likely.


**Example 2:**
Previous Context: "I am going to eat a "
Current Word: ""

Expected Output (Python Array): []

This is because there is no clear next character to predict.

**Example 3:**
Previous Context: "I am going to eat an "
Current Word: ""

Expected Output (Python Array): [("a", 0.80), ("e", 0.80), ("i", 0.80), ("o", 0.80), ("u", 0.80),]

This is because a vowel is likely to come next

**Requirements:**

- Use confidence values between 0.0 and 1.0
- Order predictions from highest to lowest probability
- Include 5 or fewer characters. Do not include characters you do not think are likely. It is completely fine to only list one or two options if you are only confident in one or two options.
- You must return ONLY a python array of tuples with (character, confidence) or an empty python array []
- DO NOT include any explanatory text, comments, or markdown formatting
- DO NOT start with "Based on" or any other explanation
- Your response must start with [ and end with ]
- Backspace is represented as "BACKSPACE" and space is represented as "SPACE", not " "
- Example valid responses: [("i", 0.8), ("n", 0.2)] or []

`;

async function charPrediction(inputText) {
  if (!inputText || !inputText.trim()) {
    return [];
  }

  if (
    inputText.endsWith(" ") ||
    inputText.endsWith(".") ||
    inputText.endsWith("!") ||
    inputText.endsWith("?") ||
    inputText.endsWith(",") ||
    inputText.endsWith(";") ||
    inputText.endsWith(":")
  ) {
    return [];
  }

  try {
    const startTime = Date.now();

    const response = await axios.post(
      "https://api.cerebras.ai/v1/chat/completions",
      {
        messages: [
          {
            role: "system",
            content: charPrompt,
          },
          {
            role: "user",
            content: `Previous Context: ${inputText}`,
          },
        ],
        model: "gpt-oss-120b",
        stream: false,
        max_completion_tokens: 5000,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${cerebrasKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const endTime = Date.now();
    console.log("Time taken: ", endTime - startTime, "ms");

    const result = response.data.choices[0].message.content.trim();
    console.log("the result is: ", result);

    try {
      // Parse the Python array format: [("char", 0.8), ("char2", 0.6)]
      const parsedResult = JSON.parse(
        result.replace(/\(/g, "[").replace(/\)/g, "]")
      );

      const jsonResult = [];
      for (const [char, confidence] of parsedResult) {
        if (/[a-zA-Z]/.test(char) || char === "BACKSPACE" || char === "SPACE") {
          jsonResult.push({ character: char, confidence: confidence });
        }
      }

      return jsonResult;
    } catch (parseError) {
      console.error("Error parsing result:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error calling Cerebras API:", error);
    return [];
  }
}

module.exports = {
  charPrediction,
};
