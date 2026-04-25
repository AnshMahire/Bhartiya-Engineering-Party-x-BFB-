# RESQ - Emergency Response System 🚑

RESQ is a premium, high-performance emergency response platform designed to bridge the gap between citizens and emergency services. Built with a focus on speed, reliability, and human-centric design, RESQ ensures that help is just a single tap (or shake) away.

---

## ✨ Features

### 1. Rapid Activation
*   **SOS Pulse**: A high-visibility, animated SOS button designed for high-stress situations.
*   **Shake-to-Trigger**: Integrated accelerometer support allows users to trigger an emergency by simply shaking their device.

### 2. Intelligent Lifecycle Management
*   **Phase 1: Deep Search**: Advanced radar-style animation while the system identifies the nearest available ambulance and responder.
*   **Phase 2: Live Tracking**: Real-time map integration showing the responder's location, unit ID, and a live ETA (Estimated Time of Arrival).
*   **Phase 3: Safety Compliance**: Detailed arrival summary including hospital destination, trip duration, and case ID for record-keeping.

### 3. Premium UI/UX
*   **Glassmorphism & Micro-animations**: A modern, sleek aesthetic with smooth transitions and interactive feedback.
*   **High-Contrast Controls**: Bold, accessible action buttons for calling dispatchers or responders directly.
*   **Dual-Theme Logic**: Intelligent switching between Light and Dark modes based on the current phase of the emergency.

---

## 🛠️ Tech Stack

### Mobile (Frontend)
*   **Framework**: React Native with Expo SDK 49
*   **Navigation**: State-driven modular architecture
*   **Icons**: FontAwesome5, MaterialIcons, Ionicons (Vector Icons)
*   **Styling**: Premium Vanilla CSS-in-JS

### Backend (Server)
*   **Environment**: Node.js & Express
*   **State Management**: Real-time decision engine for ambulance assignment
*   **API**: RESTful endpoints for emergency lifecycle management

---

## 📂 Project Structure

```text
├── mobile/                 # React Native / Expo Application
│   ├── assets/             # Branding and mock assets
│   ├── components/         # Reusable UI components (SOSButton, ShakeDetector)
│   ├── screens/            # Modular screens (Searching, Tracking, Safety)
│   ├── services/           # API integration and services
│   └── App.js              # Central dispatcher and state manager
│
└── backend/                # Node.js Express Server
    ├── controllers/        # Logical controllers (Emergency, Decision Engine)
    ├── data/               # Mock datasets (Ambulances, Hospitals)
    └── routes/             # API route definitions
```

---

## 🚀 Getting Started

### 1. Setup Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Setup Mobile
```bash
cd mobile
npm install
# Update .env with your local Machine IP
# EXPO_PUBLIC_API_URL=http://<YOUR_IP>:4000
npx expo start
```

---

## 👨‍💻 Development Team
Designed and developed with ❤️ for the **Bhartiya Engineering Party x BFB** Hackathon.
