# SigmaShield

SigmaShield is a mobile application that helps users detect and learn about online scams. Powered by AI and community insights, SigmaShield offers real-time URL analysis, educational modules, analytics dashboards, and a community forum.

## Features

- **Scam Detection**: Paste suspicious URLs to detect phishing or scam links with AI-powered confidence scores.
- **Learn**: Explore in-depth information about scams including definitions, common types, identification tips, and avoidance strategies.
- **Analytics**: Visualize total scam detections over time and get a breakdown of scam types.
- **Forum**: Join the community to discuss suspicious links, share experiences, and ask questions.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/SigmaShield.git
   cd SigmaShield
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```
4. Launch the app on:
   - Android emulator
   - iOS simulator
   - Expo Go (Android/iOS)

## Usage

- **Home**: Login or continue as a guest to access the app.
- **Scam Detection**: Enter a URL and tap **Detect**. View results including phishing status, confidence, and keywords.
- **Learn**: Browse educational topics about scams. Tap a topic to read more.
- **Analytics**: View interactive charts of scam detection trends.
- **Forum**: Search, read, and create posts to discuss scam-related topics.

## Project Structure

```
/app
  /_layout.tsx       # App-wide layout and routing
  /(tabs)
    index.tsx        # Home (login) screen
    scam-detection.tsx
    learn.tsx
    analytics.tsx
    forum.tsx
    report-scam.tsx
/components         # Reusable UI components
/constants          # App constants (colors, etc.)
/assets             # Images and fonts
```

## API

The app uses an external endpoint for scam detection:

```
POST https://dsta-code-exp-2025.onrender.com/predict
Body: { "url": "<URL_TO_ANALYZE>" }
Response: {
  "is_phishing": boolean,
  "confidence": number,
  "keywords_found": string[],
  "explanation": string
}
```

## Contributing

Contributions and feedback are welcome! Please open issues or submit pull requests on GitHub.

## License

This project is licensed under the MIT License.
