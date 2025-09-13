#ALL TO BE REPLACED WITH FIONAS PROMPTS


def char_prompt(input_text, recent_word):
    return f"""Given this text fragment: "{input_text}" and the last word: "{recent_word}",

The text appears to end mid-word. Based on the context of the sentence, what is the most likely next character(s) to complete the current word?

Rules:
1. If there's one very obvious next character, return just that character
2. If there are multiple reasonable options (2-4), list them all
3. If it's unclear or could be many different characters, return "UNCLEAR"
4. Only consider single characters, not full words
5. Consider common English words and grammar

Respond with just the character(s) or "UNCLEAR", nothing else."""

def word_prompt(input_text, word_options):
    return f"""Given this text fragment: "{input_text}"

From the following list of words, which word(s) would most naturally come next to complete the sentence or phrase?

Available words: {word_options}

Rules:
1. Consider the context and grammar of the sentence
2. Return the most likely word(s) from the list only
3. If multiple words are equally likely, list up to 3 options
4. If none of the words fit well, return "NONE"
5. Only return words that are in the provided list

Respond with just the word(s) from the list or "NONE", nothing else."""
