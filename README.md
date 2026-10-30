# KidBand – Smart Health Band for Children

A college-project prototype containing a React parent dashboard and an Express/MongoDB API. The prototype demonstrates health readings, GPS location display, health history, device connection and SOS alerts.

## Project structure

- `frontend/` – React + Vite parent dashboard
- `backend/` – Express API and optional MongoDB persistence
- `docs/` – project report and presentation files

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Community Server (optional; the API can run in demo in-memory mode without MongoDB)

## Run the project

Open two terminals in VS Code.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, if `cp` does not work, use `Copy-Item .env.example .env`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

Demo login: `parent@kidband.demo`  
Password: `kidband123`  
Band ID: `KB1024`

## API endpoints

- `GET /api/health` – API status
- `GET /api/readings/latest` – latest simulated health reading
- `GET /api/readings/history` – recent readings
- `GET /api/location` – last known coordinates
- `PUT /api/location` – update coordinates
- `POST /api/sos` – create an SOS event
- `GET /api/sos` – list SOS events
- `PATCH /api/sos/:id/resolve` – resolve an SOS event

## Important academic prototype note

The app currently uses **simulated sensor values** and a **sample GPS coordinate**. It does not connect to a physical wearable, Bluetooth sensor, cellular modem, or emergency-response service. The demo SOS button creates an event in the parent dashboard; it does not contact emergency services. The login screen is a demonstration flow, not production authentication. Do not present simulated values as real medical measurements.

## Suggested demonstration

1. Start backend and frontend.
2. Sign in using the demo credentials.
3. Connect band `KB1024`.
4. Show live-refreshing demo health cards.
5. Open Location to show the sample map pin.
6. Press Send SOS alert and show the event.
7. Open Health, History and Settings.
