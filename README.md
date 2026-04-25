**RESQ** is a high-performance, multi-modal emergency dispatch platform designed to minimize response times during critical incidents. By integrating **AI Voice Recognition**, **Shake-to-Trigger** mechanics, and a **Live-Tracking Simulation**, RESQ provides a robust safety net for users in high-stress situations.

---

## ⚡ Core Pillars

### 1. Multi-Modal Emergency Triggers
*   **The Pulse SOS**: A high-fidelity, animated central button for immediate manual activation.
*   **Shake-to-Trigger**: Background accelerometer monitoring that detects high-G shaking events to launch an emergency request without looking at the screen.
*   **AI Voice Assistant**: integrated `@react-native-voice/voice` processing that listens for keywords like *"Help"*, *"SOS"*, or *"Emergency"*.

### 2. The Safety Shield (Slide-to-Cancel)
To prevent false alarms from automated triggers (Voice/Shake), RESQ introduces the **Safety Shield Overlay**.
*   **5-Second Intelligent Countdown**: High-contrast visual and audio feedback via `expo-speech`.
*   **Gesture-Based Cancellation**: A physical "Slide to Cancel" interaction that requires intentional movement, ensuring the system only proceeds with legitimate emergencies.

### 3. Dynamic Life-Cycle Tracking
*   **Searching**: Radar-style simulation to locate the nearest responder.
*   **Live Tracking**: A map-centric dashboard showing responder unit ID, driver rating (John Doe, Unit 402), and real-time ETA updates.
*   **Safety Compliance**: Post-arrival summary including Hospital Destination (City General Hospital) and unique Case IDs for record-keeping.

---

## 🏗️ Technical Architecture

### Frontend (Mobile)
- **Framework**: Expo (React Native) SDK 49
- **Animations**: Reanimated & Native Animated API for pulsing effects and high-performance overlays.
- **Sensors**: `expo-sensors` (Accelerometer) for shake detection.
- **Speech**: `expo-speech` (TTS) for accessibility and emergency status vocalization.
- **State Management**: React Hooks with a custom `useVoiceSOS` dispatcher.

### Backend (Server)
- **Stack**: Node.js & Express
- **Engine**: Smart Assignment Engine for connecting patients to optimal Hospital/Ambulance pairs.
- **Real-Time**: Polling-based state synchronization for live-updates on mobile.

---

## 📂 Project Structure

```text
├── mobile/                      # React Native (Expo) Patient App
│   ├── components/              # Reusable UI Components
│   │   ├── CancelSlider.js      # Slide-to-Cancel gesture logic
│   │   ├── SOSButton.js         # Central Pulse SOS button
│   │   ├── SOSCountdownOverlay.js # Full-screen safety timer
│   │   ├── ShakeDetector.js     # Accelerometer monitoring
│   │   └── VoiceSOSButton.js    # AI Voice Assistant mic UI
│   ├── hooks/                   # Custom React Hooks
│   │   └── useVoiceSOS.js       # Voice recognition & keywords logic
│   ├── screens/                 # Application Screens
│   │   ├── OnboardingScreen.js  # Splash & Permissions
│   │   ├── HomeScreen.js        # Main SOS Dashboard
│   │   ├── SearchingScreen.js   # Radar search animation
│   │   ├── TrackingScreen.js    # Live map & driver tracking
│   │   └── SafetyComplianceScreen.js # Arrival & summary screen
│   ├── services/                # API Helpers
│   │   └── api.js               # Axios instance & endpoints
│   ├── App.js                   # Application Entry & State Manager
│   └── .env                     # Environment variables (Backend IP)
│
├── backend/                     # Node.js Express Server
│   ├── controllers/             # Business Logic & Decision Engine
│   ├── data/                    # Mock JSON sets (Ambulances, Hospitals)
│   ├── routes/                  # Express Router definitions
│   ├── utils/                   # Shared utility functions
│   └── server.js                # Server entry point
│
└── web/                         # Admin Dashboard (Optional/Future)
```

---

## 🚀 Deployment & Installation

### Prerequisite: Configuration
1. Obtain your local machine IP address (`ipconfig` or `ifconfig`).
2. Update `mobile/.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://<YOUR_IP>:4000
   ```

### 1. Start Service Layer
```bash
cd backend
npm install
npm run dev
```

### 2. Launch Patient App
```bash
cd mobile
npm install
npx expo start
```

---

## 📝 Demo Stability Note (Hackathon Ready)
The app includes a **`DEMO_MODE`** flag in `useVoiceSOS.js`. This is enabled by default to ensure stable presentations. If enabled, the voice assistant will simulate detection 4 seconds after activation, allowing you to showcase the **Safety Shield** and **Slide-to-Cancel** features reliably without dependency on microphone environmental noise.

---

## ✨ Developed For
**Bhartiya Engineering Party x BFB Hackathon**  
*Designing technology that saves lives.*
