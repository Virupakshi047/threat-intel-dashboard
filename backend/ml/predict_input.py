import pickle
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'threat_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.pkl')

def predict_input():
    try:
        with open(MODEL_PATH, 'rb') as f:
            loaded_model = pickle.load(f)
        with open(VECTORIZER_PATH, 'rb') as f:
            loaded_vectorizer = pickle.load(f)
    except Exception as e:
        print(f"Error loading model/vectorizer: {e}")
        return
    while True:
        user_input = input("\nEnter a cleaned threat description (or type 'exit' to quit): ")
        if user_input.lower() == 'exit':
            break
        X_input = loaded_vectorizer.transform([user_input])
        pred = loaded_model.predict(X_input)[0]
        print(f"Predicted Threat Category: {pred}")

if __name__ == "__main__":
    predict_input() 