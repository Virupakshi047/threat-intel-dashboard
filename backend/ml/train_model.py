import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pickle
import os
import warnings
warnings.filterwarnings("ignore")  


DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/cyber_threat_data.csv')
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'threat_model.pkl')
VECTORIZER_PATH = os.path.join(os.path.dirname(__file__), 'tfidf_vectorizer.pkl')


df = pd.read_csv(DATA_PATH)

X = df['Cleaned Threat Description'].astype(str)
y = df['Threat Category'].astype(str)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)


vectorizer = TfidfVectorizer(
    max_features=3000,            
    stop_words='english',         
    ngram_range=(1, 2)            
)
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)


model = LogisticRegression(
    max_iter=1000,
    class_weight='balanced',     
    solver='lbfgs',
    random_state=42
)
model.fit(X_train_tfidf, y_train)


y_pred = model.predict(X_test_tfidf)
print(classification_report(y_test, y_pred))
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")


with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model, f)

with open(VECTORIZER_PATH, 'wb') as f:
    pickle.dump(vectorizer, f)

print(f"Model saved to {MODEL_PATH}")
print(f"Vectorizer saved to {VECTORIZER_PATH}")
