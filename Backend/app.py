import pickle
from feature_extraction import extract_features
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

with open("phishing_model.pkl", "rb") as f:
    model = pickle.load(f)

test_url = "http://google.com"


@app.route('/predict', methods=['POST'])
def predict():
    url = request.json.get("url")
    if not url:
        return jsonify({'error': 'No URL provided'}), 400
    features = extract_features(url)
    print(features)
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0]
    confidence = max(probability)
    return jsonify({'result': "Phising" if int(prediction) == 1 else "Not Phishing", 'confidence' : round(confidence * 100 , 2)})

@app.route('/analytics', methods=['GET'])
def get_analytics():
    period = request.args.get('period', 'week')
    
    # Mock data for demonstration - in production, this would query a real database
    if period == 'week':
        analytics_data = {
            "totalScamsDetected": 1247,
            "totalScamsReported": 89,
            "regionStats": [
                {"region": "Central", "count": 456, "percentage": 36.6},
                {"region": "East", "count": 298, "percentage": 23.9},
                {"region": "West", "count": 267, "percentage": 21.4},
                {"region": "North", "count": 156, "percentage": 12.5},
                {"region": "Northeast", "count": 70, "percentage": 5.6}
            ],
            "timeStats": [
                {"period": "Mon", "count": 178},
                {"period": "Tue", "count": 165},
                {"period": "Wed", "count": 201},
                {"period": "Thu", "count": 189},
                {"period": "Fri", "count": 234},
                {"period": "Sat", "count": 156},
                {"period": "Sun", "count": 124}
            ],
            "scamTypes": [
                {"type": "Phishing", "count": 498, "percentage": 39.9},
                {"type": "Investment", "count": 312, "percentage": 25.0},
                {"type": "Job Scam", "count": 187, "percentage": 15.0},
                {"type": "Romance", "count": 125, "percentage": 10.0},
                {"type": "Parcel", "count": 87, "percentage": 7.0},
                {"type": "Others", "count": 38, "percentage": 3.1}
            ],
            "recentTrends": {
                "direction": "up",
                "percentage": 12.5
            }
        }
    else:  # month
        analytics_data = {
            "totalScamsDetected": 4892,
            "totalScamsReported": 342,
            "regionStats": [
                {"region": "Central", "count": 1789, "percentage": 36.6},
                {"region": "East", "count": 1169, "percentage": 23.9},
                {"region": "West", "count": 1047, "percentage": 21.4},
                {"region": "North", "count": 611, "percentage": 12.5},
                {"region": "Northeast", "count": 276, "percentage": 5.6}
            ],
            "timeStats": [
                {"period": "Week 1", "count": 1234},
                {"period": "Week 2", "count": 1156},
                {"period": "Week 3", "count": 1298},
                {"period": "Week 4", "count": 1204}
            ],
            "scamTypes": [
                {"type": "Phishing", "count": 1952, "percentage": 39.9},
                {"type": "Investment", "count": 1223, "percentage": 25.0},
                {"type": "Job Scam", "count": 734, "percentage": 15.0},
                {"type": "Romance", "count": 489, "percentage": 10.0},
                {"type": "Parcel", "count": 341, "percentage": 7.0},
                {"type": "Others", "count": 153, "percentage": 3.1}
            ],
            "recentTrends": {
                "direction": "down",
                "percentage": 8.2
            }
        }
    
    return jsonify(analytics_data)

if __name__ == '__main__':
    app.run(debug=True)


