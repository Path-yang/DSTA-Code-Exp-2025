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
            "totalScamsDetected": 287,
            "totalScamsReported": 23,
            "totalBlocked": 195,
            "accuracy": 91.2,
            "regionStats": [
                {"region": "Central", "count": 89, "percentage": 31.0},
                {"region": "West", "count": 67, "percentage": 23.3},
                {"region": "East", "count": 58, "percentage": 20.2},
                {"region": "North", "count": 44, "percentage": 15.3},
                {"region": "Northeast", "count": 29, "percentage": 10.1}
            ],
            "timeStats": [
                {"period": "Mon", "count": 34},
                {"period": "Tue", "count": 42},
                {"period": "Wed", "count": 56},
                {"period": "Thu", "count": 38},
                {"period": "Fri", "count": 61},
                {"period": "Sat", "count": 31},
                {"period": "Sun", "count": 25}
            ],
            "scamTypes": [
                {"type": "Phishing", "count": 115, "percentage": 40.1},
                {"type": "Investment", "count": 63, "percentage": 22.0},
                {"type": "Job Scam", "count": 46, "percentage": 16.0},
                {"type": "Romance", "count": 29, "percentage": 10.1},
                {"type": "Parcel", "count": 20, "percentage": 7.0},
                {"type": "Others", "count": 14, "percentage": 4.9}
            ],
            "recentTrends": {
                "direction": "up",
                "percentage": 15.3
            },
            "hourlyActivity": [
                {"hour": "6AM", "count": 8},
                {"hour": "9AM", "count": 23},
                {"hour": "12PM", "count": 41},
                {"hour": "3PM", "count": 38},
                {"hour": "6PM", "count": 52},
                {"hour": "9PM", "count": 67},
                {"hour": "12AM", "count": 34}
            ],
            "topTargets": [
                {"demographic": "Ages 25-34", "count": 78, "percentage": 27.2},
                {"demographic": "Ages 35-44", "count": 65, "percentage": 22.6},
                {"demographic": "Ages 45-54", "count": 54, "percentage": 18.8},
                {"demographic": "Ages 55+", "count": 47, "percentage": 16.4},
                {"demographic": "Ages 18-24", "count": 43, "percentage": 15.0}
            ],
            "preventionStats": {
                "warningsSent": 156,
                "linksBlocked": 195,
                "reportsProcessed": 23,
                "falsePositives": 12
            }
        }
    else:  # month
        analytics_data = {
            "totalScamsDetected": 1834,
            "totalScamsReported": 167,
            "totalBlocked": 1298,
            "accuracy": 88.7,
            "regionStats": [
                {"region": "Central", "count": 612, "percentage": 33.4},
                {"region": "East", "count": 423, "percentage": 23.1},
                {"region": "West", "count": 385, "percentage": 21.0},
                {"region": "North", "count": 257, "percentage": 14.0},
                {"region": "Northeast", "count": 157, "percentage": 8.6}
            ],
            "timeStats": [
                {"period": "Week 1", "count": 423},
                {"period": "Week 2", "count": 467},
                {"period": "Week 3", "count": 512},
                {"period": "Week 4", "count": 432}
            ],
            "scamTypes": [
                {"type": "Investment", "count": 641, "percentage": 34.9},
                {"type": "Phishing", "count": 568, "percentage": 31.0},
                {"type": "Job Scam", "count": 275, "percentage": 15.0},
                {"type": "Romance", "count": 183, "percentage": 10.0},
                {"type": "Parcel", "count": 110, "percentage": 6.0},
                {"type": "Others", "count": 57, "percentage": 3.1}
            ],
            "recentTrends": {
                "direction": "down",
                "percentage": 6.8
            },
            "hourlyActivity": [
                {"hour": "6AM", "count": 89},
                {"hour": "9AM", "count": 201},
                {"hour": "12PM", "count": 298},
                {"hour": "3PM", "count": 267},
                {"hour": "6PM", "count": 334},
                {"hour": "9PM", "count": 412},
                {"hour": "12AM", "count": 233}
            ],
            "topTargets": [
                {"demographic": "Ages 35-44", "count": 459, "percentage": 25.0},
                {"demographic": "Ages 45-54", "count": 403, "percentage": 22.0},
                {"demographic": "Ages 25-34", "count": 367, "percentage": 20.0},
                {"demographic": "Ages 55+", "count": 330, "percentage": 18.0},
                {"demographic": "Ages 18-24", "count": 275, "percentage": 15.0}
            ],
            "preventionStats": {
                "warningsSent": 1023,
                "linksBlocked": 1298,
                "reportsProcessed": 167,
                "falsePositives": 89
            }
        }
    
    return jsonify(analytics_data)

if __name__ == '__main__':
    app.run(debug=True)


