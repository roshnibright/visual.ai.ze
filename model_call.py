import os
import re
import ast
import json
import string
from dotenv import load_dotenv
import anthropic
from prompts import char_prompt, word_prompt
import time
from cerebras.cloud.sdk import Cerebras



load_dotenv()
api_key = os.getenv('ANTHROPIC_KEY')
cerebras_key = os.getenv('CEREBRAS_KEY')
if not api_key:
    raise ValueError("ANTHROPIC_KEY not found in environment variables. Please add it to your .env file.")
if not cerebras_key:
    raise ValueError("CEREBRAS_KEY not found in environment variables. Please add it to your .env file.")

def char_prediction(input_text):
    """
    Predicts the next character for an input text using Anthropic's Haiku model.

    Args:
        input_text (str): A short sentence or text fragment

    Returns:
        list: List of recommended next characters, or empty list if no recommendation
    """
    client = Cerebras(api_key=cerebras_key)

    if not input_text or not input_text.strip():
        return []

    if input_text.endswith((' ', '.', '!', '?', ',', ';', ':')):
        return []
    try:
        x = time.time()
        completion_create_response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": char_prompt
                },
                {
                    "role": "user",
                    "content": f"Previous Context: {input_text}"
                },
            ],
            model="gpt-oss-120b",
            stream=False,
            max_completion_tokens=5000,
            temperature=.2,
        )

        y = time.time()
        print("Time taken: ", y - x)

        result = completion_create_response.choices[0].message.content.strip()
        print("the result is: ", result)

        try:
            parsed_result = ast.literal_eval(result)

            json_result = []
            for char, confidence in parsed_result:
                if char in string.ascii_letters or char in {"BACKSPACE", "SPACE"}:
                    json_result.append({"character": char, "confidence": confidence})

            return json.dumps(json_result)
        except:
            return json.dumps([])

    except Exception as e:
        print(f"Error calling Anthropic API: {e}")
        return json.dumps([])


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

    word_options = ", ".join(word_list)

    prompt = word_prompt(input_text, word_options)

    try:
        response = client.messages.create(
            model="gpt-oss-120b",
            max_tokens=20,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )


        result = response.content[0].text.strip()
        print(result)

        try:
            parsed_result = ast.literal_eval(result)

            json_result = []
            for word, confidence in parsed_result:
                if word in word_list:
                    json_result.append({"word": word, "confidence": confidence})

            return json.dumps(json_result)
        except:
            return json.dumps([])

    except Exception as e:
        print(f"Error calling Anthropic API: {e}")
        return []



if __name__ == "__main__":

    test_cases = ["Yesterday when I came home from school I a"]

    for test in test_cases:
        predictions = char_prediction(test)
        print(f"Input: '{test}'")
        print(f"Predictions: {predictions}")
        """

    test_cases = [("I am going to eat a", ["bus", "strawberry", "classroom", "chair"])]

    for input, words in test_cases:
        predictions = word_prediction(input, words)
        print(f"Input: '{input}'")
        print(f"Predictions: {predictions}")
"""
