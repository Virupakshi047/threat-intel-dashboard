import sys
import pickle
import os
import json

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'threat_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.pkl')

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No description provided"}))
        sys.exit(1)
    description = sys.argv[1]
    try:
        with open(MODEL_PATH, 'rb') as f:
            model = pickle.load(f)
        with open(VECTORIZER_PATH, 'rb') as f:
            vectorizer = pickle.load(f)
        X_input = vectorizer.transform([description])
        pred = model.predict(X_input)[0]
        print(json.dumps({"predicted_category": pred}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main() 