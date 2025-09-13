#ALL TO BE REPLACED WITH FIONAS PROMPTS


def char_prompt(input_text, recent_word):
    curWordOnlyPrompt = f"""
    You are helping with an assistive technology keyboard that dynamically resizes keys based on letter probability. Your task is to predict the most likely next characters to help users with motor impairments type more efficiently.

**Input:** "{recent_word}"

**Task:** Analyze the input text and provide probability rankings for the next character, accounting for:
- Common English language patterns and vocabulary
- Potential typos in the input (users may have motor difficulties)
- Word completion possibilities
- Sentence structure and grammar
- Punctuation and spacing appropriateness

**Output Format:**
Provide your response as a JSON object with the following structure:
```json
{
  "predictions": [
    {"character": "e", "probability": 0.35},
    {"character": "a", "probability": 0.18},
    {"character": " ", "probability": 0.15},
    {"character": "s", "probability": 0.12}
  ]
}

**Requirements:**

- Use probability values between 0.0 and 1.0
- Only include characters with probability ≥ 0.10 (moderate likelihood or higher)
- Probabilities should sum to approximately 1.0 across all reasonable next characters
- Order predictions from highest to lowest probability
- Include 5 or less characters 
"""

    allWordPrompt = f"""You are helping with an assistive technology keyboard that dynamically resizes keys based on letter probability. Your task is to predict the most likely next characters to help users with motor impairments type more efficiently.

**Previous Context:** "{input_text}"
**Current Word:** "{recent_word}"

**Task:** Analyze both the previous context and current word being typed to provide probability rankings for the next character, accounting for:
- Full sentence/paragraph context and meaning from previous words
- Semantic relationships between previous context and current word completion
- Common English language patterns and vocabulary
- Potential typos (users may have motor difficulties)
- Word completion possibilities for the current word being typed
- Sentence structure, grammar, and semantic context from preceding words
- Punctuation and spacing appropriateness based on sentence flow
- Common word sequences and phrases that follow the established context

**Output Format:**
Provide your response as a JSON object with the following structure:
```json
{
  "predictions": [
    {"character": "e", "probability": 0.35},
    {"character": "a", "probability": 0.18},
    {"character": " ", "probability": 0.15},
    {"character": "s", "probability": 0.12}
  ]
}

**Requirements:**

- Use probability values between 0.0 and 1.0
- Only include characters with probability ≥ 0.10 (moderate likelihood or higher)
- Probabilities should sum to approximately 1.0 across all reasonable next characters
- Order predictions from highest to lowest probability
- Include 5 or less characters 
 """

    return allWordPrompt
    
    

"""
The text appears to end mid-word. Based on the context of the sentence, what is the most likely next character(s) to complete the current word?

Rules:
1. If there's one very obvious next character, return just that character
2. If there are multiple reasonable options (2-4), list them all
3. If it's unclear or could be many different characters, return "UNCLEAR"
4. Only consider single characters, not full words
5. Consider common English words and grammar

Respond with just the character(s) or "UNCLEAR", nothing else. """

def word_prompt(input_text, word_options):
    wordPrompt = f"""You are helping with an assistive technology keyboard that dynamically resizes keys based on letter probability. Your task is to predict the most likely next words to help users with motor impairments type more efficiently. You may only use words from a given list of words. 

**Current text:** "{input_text}"

**Words list:** "{word_options}"

**Instructions:** Analyze both the previous context and current word being typed to provide probability rankings for the next character, accounting for:
- Full sentence/paragraph context and meaning from previous words
- Semantic relationships between previous context and current word completion
- Common English language patterns and vocabulary
- Potential typos (users may have motor difficulties)
- Word completion possibilities for the current word being typed
- Sentence structure, grammar, and semantic context from preceding words
- Punctuation and spacing appropriateness based on sentence flow
- Common word sequences and phrases that follow the established context

**Output format (JSON):**
```json
{
  "predictions": [
    {"word": "the", "confidence": 0.95},
    {"word": "and", "confidence": 0.87},
    {"word": "is", "confidence": 0.75}
  ],
  "context": "brief explanation of reasoning if helpful"
}

**Requirements:**

- Use probability values between 0.0 and 1.0
- Only include characters with probability ≥ 0.10 (moderate likelihood or higher)
- Probabilities should sum to approximately 1.0 across all reasonable next words
- Order predictions from highest to lowest probability
- Include 5 or less words """
    return wordPrompt



"""
From the following list of words, which word(s) would most naturally come next to complete the sentence or phrase?

Available words: {word_options}

Rules:
1. Consider the context and grammar of the sentence
2. Return the most likely word(s) from the list only
3. If multiple words are equally likely, list up to 3 options
4. If none of the words fit well, return "NONE"
5. Only return words that are in the provided list

Respond with just the word(s) from the list or "NONE", nothing else.
"""