#ALL TO BE REPLACED WITH FIONAS PROMPTS


def char_prompt(input_text):

    prompt = f"""You are helping to create a keyboard that dynamically resizes keys based on letter probability.
Your task is to predict the most likely next characters so we can make them bigger on our keyboard.

**Previous Context:** "{input_text}"

**Task:** Analyze both the previous context and current word being typed (at end of the context) to provide confidence values for the next character. For each of the 5 most likely characters, assign a confidence score from 0-1 representing how confident you are that the following character is the next one to be typed.
- If you are very unconfident about the next character, your confidences should be low
- It is fully acceptable to return an empty list if you are unconfident about the next character
- The "delete" key and "space" key are valid choices to list
Do this using:
- Word completion possibilities for the current word being typed
- Full sentence/paragraph context and meaning from previous words
- Semantic relationships between previous context and current word completion
- Common English language patterns and vocabulary
- Sentence structure, grammar, and semantic context from preceding words
- Punctuation and spacing appropriateness based on sentence flow
- Common word sequences and phrases that follow the established context

**Example:**
Previous Context: "I need to go to the"
Current Word: "sto"

Expected Output (Python Array):
```python array of tuples
[
    ("r", 0.80),
    ("p", 0.10),
]

This is because "store" or "storage" are very likely to follow. "Stop" is also a possibility, but it is not as likely.


**Example 2:**
Previous Context: "I am going to eat a"
Current Word: ""

Expected Output (Python Array):
```python array of tuples
[]

This is because there is no clear next character to predict.


**Requirements:**

- Use confidence values between 0.0 and 1.0
- Order predictions from highest to lowest probability
- Include 5 or fewer characters
- You must return a python array of tuples with (character, confidence)

 """

    return prompt




def word_prompt(input_text, word_options):
    prompt = f"""You are helping to create a talker that dynamically resizes keys based on letter probability. Each key has one of the word in the word_options array, which you will be provided with.
Your task is to predict the most likely next words so we can make them bigger on our talker.

**Current text:** "{input_text}"

**word_options:** "{word_options}"

**Instructions:** Analyze the previous context word options being presented to provide probability rankings for the next word.
- If you are very unconfident about the next word, your confidences should be low
- It is fully acceptable to return an empty list if you are fully unconfident about the next word
Account for:
- Full sentence/paragraph context and meaning from previous words
- Semantic relationships between previous context and current word completion
- Common English language patterns and vocabulary
- Potential typos (users may have motor difficulties)
- Which of the words might make sense in the context of the preceding context/paragraph
- Sentence structure, grammar, and semantic context from preceding words
- Punctuation and spacing appropriateness based on sentence flow
- Common word sequences and phrases that follow the established context

**Output format (Python Array):**
word_options: ["football", "cookie", "pizza", "chair", "window"]
input_text: "For dessert, I am going to eat a"

Expected Output (Python Array):
```python array of tuples
[
    ("cookie", 0.90),
    ("pizza", 0.40),
]

This is because "cookie" is quite likely to follow given the preceding context, but pizza is a food and there is a possibility that a human could eat pizza for dessert.


word_options: ["football", "cookie", "pizza", "chair", "window"]
input_text: "When I grow up, I want to be a "

Expected Output (Python Array):
```python array of tuples
[
    ("football", 0.70),
    ("cookie", 0.70),
    ("pizza", 0.70),
    ("chair", 0.70),
    ("window", 0.70),
]

This is because any of these options are actually possible. You could be a football coach, cookie baker... etc


**Requirements:**

- Use condifence values between 0.0 and 1.0
- Order predictions from highest to lowest probability
- Include 5 or fewer words
- You must return a python array of tuples with (word, confidence)
"""
    return prompt
