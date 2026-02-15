import requests
import json

BASE_URL = 'http://127.0.0.1:5000'

def test_transcribe():
    # 1. Get Answer Sheets
    print("Fetching answer sheets...")
    try:
        resp = requests.get(f"{BASE_URL}/api/upload/files?type=answer")
        files = resp.json().get('files', [])
    except Exception as e:
        print(f"Error fetching files: {e}")
        return

    if not files:
        print("No answer sheets found. Please upload one first.")
        return

    file_id = files[0]['id']
    print(f"Using Answer Sheet ID: {file_id}")

    # 2. Transcribe Request (Simulating full page or region)
    payload = {
        'answersheetId': file_id,
        'page': 0,
        'coordinates': {
            'x': 0.1,
            'y': 0.1,
            'width': 0.5,
            'height': 0.2
        }
    }
    
    print(f"Sending transcribe request: {payload}")
    try:
        resp = requests.post(f"{BASE_URL}/api/evaluate/transcribe", json=payload)
        print(f"Status Code: {resp.status_code}")
        print("Response:", resp.text)
    except Exception as e:
        print(f"Error sending request: {e}")

if __name__ == "__main__":
    test_transcribe()
