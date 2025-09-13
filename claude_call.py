import os
import re
from dotenv import load_dotenv
import anthropic
from prompts import char_prompt, word_prompt

load_dotenv()
api_key = os.getenv('ANTHROPIC_KEY')
if not api_key:
    raise ValueError("ANTHROPIC_KEY not found in environment variables. Please add it to your .env file.")


def char_prediction(input_text):
    """
    Predicts the next character for an input text using Anthropic's Haiku model.

    Args:
        input_text (str): A short sentence or text fragment

    Returns:
        list: List of recommended next characters, or empty list if no recommendation
    """
    client = anthropic.Anthropic(api_key=api_key)

    if not input_text or not input_text.strip():
        return []

    words = input_text.strip().split()

    last_word = words[-1]

    if input_text.endswith((' ', '.', '!', '?', ',', ';', ':')):
        return []

    prompt = char_prompt(input_text, last_word)
    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=50,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        result = response.content[0].text.strip()

        if result == "UNCLEAR":
            return []

        if len(result) == 1:
            return [result]
        elif len(result) <= 10:
            chars = re.findall(r'[a-zA-Z0-9]', result)
            return chars[:4]
        else:
            return []

    except Exception as e:
        print(f"Error calling Anthropic API: {e}")
        return []


def word_prediction(input_text, word_list):
    """
    Predicts the next likely word from a list of words for an input text using Anthropic's Haiku model.

    Args:
        input_text (str): A short sentence or text fragment
        word_list (list): List of words to choose from

    Returns:
        list: List of recommended next words, or empty list if no recommendation
    """
    client = anthropic.Anthropic(api_key=api_key)

    if not input_text or not input_text.strip():
        return []

    if not word_list or len(word_list) == 0:
        return []

    # Create word list string for the prompt
    word_options = ", ".join(word_list)

    prompt = word_prompt(input_text, word_options)

    try:
        response = client.messages.create(
            model="claude-3-haiku-20240307",
            max_tokens=50,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        result = response.content[0].text.strip()

        if result == "NONE":
            return []

        predicted_words = []

        words_in_response = [w.strip() for w in result.replace(',', ' ').split()]
        for word in words_in_response:
            if word in word_list:
                predicted_words.append(word)

        return predicted_words[:3]

    except Exception as e:
        print(f"Error calling Anthropic API: {e}")
        return []


if __name__ == "__main__":
    test_cases = ["The cat is sitt"]

    for test in test_cases:
        predictions = char_prediction(test)
        print(f"Input: '{test}'")
        print(f"Predictions: {predictions}")

    test_cases = [("I am going to eat a", ["bus, strawberry, classroom, cat"])]

    for input, words in test_cases:
        predictions = word_prediction(input, words)
        print(f"Input: '{input}'")
        print(f"Predictions: {predictions}")
