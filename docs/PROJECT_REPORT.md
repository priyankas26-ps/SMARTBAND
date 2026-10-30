# KidBand – Smart Health Band for Children

## Abstract
KidBand is a prototype child-wellness monitoring system designed to demonstrate how a wearable band and a parent-facing application could work together. The application presents sample heart-rate, blood-oxygen, temperature and battery readings, a last-known location, health history and an SOS alert workflow. The prototype is intended for academic demonstration and uses simulated sensor data rather than a certified medical device.

## 1. Introduction
Children may spend time at school, tuition centres and outdoor activities away from their parents. A connected wearable concept can help a parent view selected wellness information and a child's last reported location. KidBand demonstrates a possible architecture consisting of a wearable device, a communication layer, a backend API and a parent dashboard.

## 2. Problem Statement
Parents may not have a convenient unified view of a child's wearable status, wellness readings and location. The project explores a simple dashboard that organizes these functions and demonstrates an SOS notification workflow.

## 3. Objectives
- Demonstrate a parent dashboard for a child profile and connected band.
- Display heart rate, SpO₂, temperature and battery information.
- Display a last-known GPS position on a map.
- Demonstrate an SOS event workflow.
- Store and display sample health-reading history.
- Provide basic notification and tracking preferences.

## 4. Existing System and Proposed System
Existing products may provide separate health, location or communication functions. KidBand proposes a unified prototype interface. The current implementation simulates sensor and GPS data so the software workflow can be demonstrated without wearable hardware.

## 5. System Architecture
The proposed architecture has four layers:
1. Wearable layer – a future physical band with sensors, GPS and an SOS button.
2. Communication layer – a future Bluetooth or network gateway that sends readings to the server.
3. Backend layer – Express REST API with optional MongoDB storage.
4. Parent application – React dashboard displaying readings, location, history and SOS events.

## 6. Technologies Used
- React and Vite for the frontend.
- JavaScript, HTML and CSS for application logic and presentation.
- Node.js and Express for REST APIs.
- MongoDB and Mongoose for optional reading persistence.
- Leaflet and OpenStreetMap tiles for map display.
- Recharts for a sample heart-rate trend chart.

## 7. Modules
### 7.1 Parent access
A demonstration sign-in screen gives access to the parent dashboard. Production use would require secure registration, password hashing, token-based sessions and access controls.
### 7.2 Band connection
The prototype uses device ID KB1024 to demonstrate a connected-band state.
### 7.3 Health monitoring
The dashboard shows heart rate, blood oxygen, temperature and battery. The backend periodically generates sample readings.
### 7.4 Location tracking
The location page displays a sample coordinate on an interactive map. Real tracking would require a GPS-enabled device and a secure data channel.
### 7.5 SOS alert
The dashboard button simulates the physical SOS button and creates an event visible in the parent application. A production design would need reliable delivery, acknowledgement and escalation.
### 7.6 History and settings
The history page lists recent sample readings. The settings page stores notification and tracking preferences in browser local storage.

## 8. Implementation and Testing
Start the backend on port 5000 and the frontend on port 5173. Test the API health endpoint, latest readings, location, history and SOS event creation. In the browser, verify sign-in, band connection, navigation, map display and settings toggles. MongoDB persistence is optional; the backend can run with in-memory demo data when MongoDB is unavailable.

## 9. Limitations
- Readings are simulated and are not medical measurements.
- GPS coordinates are a sample location, not live tracking.
- The demo sign-in is not production authentication.
- The SOS workflow is an application demonstration and does not contact emergency services.
- Physical hardware, sensor calibration, connectivity and battery testing are outside this software prototype.

## 10. Future Scope
- Integrate a microcontroller and validated sensors.
- Add Bluetooth Low Energy communication and secure device pairing.
- Implement GPS reporting with consent and privacy controls.
- Add secure parent accounts, role-based authorization and encrypted transport.
- Add configurable alert thresholds and delivery acknowledgements.
- Conduct usability, reliability and hardware validation tests.

## 11. Conclusion
KidBand demonstrates a unified parent-facing interface for a child wearable concept. The prototype combines health cards, a map, history and SOS event handling in one application. It provides a foundation for future hardware integration and security improvements.
