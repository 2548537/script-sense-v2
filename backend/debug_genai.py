import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

print(f"google-generativeai version: {genai.__version__}")

api_key = os.getenv('GEMINI_API_KEY')
if not api_key:
    print("API Key not found in environment")
else:
    print(f"API Key found: {api_key[:5]}...")
    genai.configure(api_key=api_key)
    
    print("\nChecking for gemini-1.5-flash:")
    found = False
    for m in genai.list_models():
        if 'gemini-1.5-flash' in m.name:
            print(f"FOUND: {m.name}")
            found = True
    
    if not found:
        print("NOT FOUND: gemini-1.5-flash")
        print("Available models:")
        for m in genai.list_models():
            print(m.name)
