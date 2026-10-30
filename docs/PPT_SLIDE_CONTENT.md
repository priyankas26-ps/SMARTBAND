# KidBand Presentation – Slide Content

## Slide 1 – Title
**KidBand: Smart Health Band for Children**  
A parent companion application for wellness visibility, location display and SOS alerts.  
Presented by: Priyanka Rupnar | B.Tech CSE

## Slide 2 – Introduction
- Children may be away from parents during school and outdoor activities.
- A connected wearable concept can bring selected information into one parent dashboard.
- KidBand demonstrates health readings, location and SOS event handling.

## Slide 3 – Problem Statement
- Parents may need a simple way to view wearable status and selected wellness information.
- Location and emergency alert functions are often separate from health information.
- The project explores a unified prototype interface.

## Slide 4 – Objectives
- Display heart rate, SpO₂, temperature and battery.
- Show last-known location on a map.
- Demonstrate SOS alert creation.
- Display health history and parent preferences.

## Slide 5 – Proposed System
- Child wearable concept collects sensor and location data.
- Backend receives and stores readings.
- Parent dashboard presents information and alerts.
- Current software prototype uses simulated readings and sample coordinates.

## Slide 6 – System Architecture
Wearable sensors / SOS button → communication gateway → Express REST API → MongoDB (optional) → React parent dashboard.

## Slide 7 – Technology Stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose (optional)
- Map: Leaflet and OpenStreetMap
- Chart: Recharts

## Slide 8 – Main Modules
- Parent sign-in demo and band connection
- Child dashboard
- Health monitoring
- GPS location map
- SOS alert workflow
- Health history and settings

## Slide 9 – Screens / Demonstration
Show screenshots of: login, connected dashboard, health cards, location map, SOS alert, history and settings. Capture these from the running application.

## Slide 10 – Testing
- API health endpoint responds.
- Latest sample readings refresh periodically.
- Location endpoint returns coordinates.
- SOS endpoint creates an event.
- Frontend pages and navigation load.

## Slide 11 – Limitations and Future Scope
- Current values are simulated; sample location is not live GPS.
- No physical wearable or emergency-service integration is included.
- Future work: BLE pairing, sensor hardware, secure accounts, GPS device integration and validated alert delivery.

## Slide 12 – Conclusion
KidBand demonstrates how a child wearable concept and parent dashboard can bring health information, last-known location and SOS event handling into one application. Thank you.
