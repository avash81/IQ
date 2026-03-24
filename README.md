# IQTest Pro — Free IQ Test Online

The world's most accurate free IQ test online. Age-normalized scoring, 5 cognitive domains, instant results, and free certificate. No registration required.

## 📊 Project Overview

IQTest Pro is a scientifically-grounded online IQ assessment platform. It uses modern psychometric theories, specifically **Item Response Theory (IRT)**, to provide accurate, age-normalized IQ scores across five major cognitive domains.

- **[Project Report (Status & Features)](./PROJECT_REPORT.md)**
- **[Developer Guide (Architecture & Workflow)](./DEVELOPER.md)**

## 🚀 Features

- **Age-Normalized Scoring:** Accurate results based on your age group.
- **5 Cognitive Domains:** Measures Verbal, Numeric, Logic, Spatial, and Pattern recognition.
- **Instant Results:** Get your IQ score and percentile immediately after completion.
- **Free Certificate:** Download a professional PDF certificate of your achievement.
- **Adaptive Testing:** Uses Item Response Theory (IRT) for precise measurement.
- **Guest Access:** Take the test without mandatory registration.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS 4.0, Framer Motion
- **Backend:** Express (Node.js)
- **Database:** Firebase Firestore
- **Authentication:** Firebase Authentication
- **Charts:** Recharts
- **PDF Generation:** jsPDF, html2canvas

## 💻 Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd iqtest-pro
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file based on `.env.example` and add your Firebase configuration and other necessary keys.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Deployment

This application is designed to be deployed on Google Cloud Run or any other containerized platform.

## 📄 License

MIT License
