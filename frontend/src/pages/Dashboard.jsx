
import React, { useState, useEffect } from 'react';
import {
  Activity,
  Battery,
  Heart,
  MapPin,
  Thermometer,
  Wind,
  ShieldAlert,
  Clock
} from 'lucide-react';

import { api } from '../api';

function Metric({ icon: Icon, label, value, unit, tone }) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={20} />
      </div>

      <span>{label}</span>

      <strong>
        {value}
        <small>{unit}</small>
      </strong>

      <em>Latest reading</em>
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [sos, setSos] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = () => {
    api('/api/readings/latest')
      .then(setData)
      .catch(() => {});
  };

  useEffect(() => {
    load();

    const t = setInterval(load, 5000);

    api('/api/sos')
      .then(setSos)
      .catch(() => {});

    return () => clearInterval(t);
  }, []);

  const sendSOS = async () => {
    setBusy(true);

    try {
      const event = await api('/api/sos', {
        method: 'POST',
        body: JSON.stringify({ childName: 'Arnav' })
      });

      setSos(s => [event, ...s]);
      alert('SOS alert sent successfully!');
    } catch (e) {
      alert('Could not send SOS. Is the backend running?');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">CHILD PROFILE</span>
          <h1>Good evening, Parent</h1>
          <p>Here's Arnav's latest wellbeing snapshot.</p>
        </div>

        <span className="date-chip">
          <Clock size={15} /> Live demo
        </span>
      </div>

      <div className="child-banner">
        <div className="avatar big">A</div>

        <div className="child-info">
          <h2>Arnav</h2>
          <p>
            <span className="dot" /> Connected · Band ID KB1024
          </p>
        </div>

        <div className="banner-battery">
          <Battery />
          <b>{data?.battery ?? 87}%</b>
          <small>Battery</small>
        </div>
      </div>

      <div className="section-title">
        <h2>Health overview</h2>
        <span>Auto refreshes every 5 seconds</span>
      </div>

      <div className="metrics-grid">
        <Metric
          icon={Heart}
          label="Heart rate"
          value={data?.heartRate ?? '--'}
          unit=" bpm"
          tone="pink"
        />

        <Metric
          icon={Wind}
          label="Blood oxygen"
          value={data?.spo2 ?? '--'}
          unit="%"
          tone="blue"
        />

        <Metric
          icon={Thermometer}
          label="Temperature"
          value={data?.temperature ?? '--'}
          unit=" °C"
          tone="orange"
        />

        <Metric
          icon={Activity}
          label="Band status"
          value="Online"
          unit=""
          tone="green"
        />
      </div>

      <div className="dashboard-lower">
        <div className="panel">
          <div className="panel-heading">
            <div>
              <h2>Safety center</h2>
              <p>Send a test alert from the simulated band.</p>
            </div>
            <ShieldAlert />
          </div>

          <div className="sos-area">
            <div className="sos-symbol">SOS</div>

            <div>
              <b>Emergency alert</b>
              <p>
                Simulates the physical SOS button on Arnav's band.
              </p>
            </div>

            <button
              className="sos-button"
              disabled={busy}
              onClick={sendSOS}
            >
              {busy ? 'Sending...' : 'Send SOS alert'}
            </button>
          </div>

          {sos.length > 0 && (
            <div className="alert-list">
              <b>Recent SOS events</b>

              {sos.slice(0, 3).map((x, index) => (
                <p key={x.id || index}>
                  {new Date(x.createdAt).toLocaleString()} · {x.status}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="panel location-preview">
          <div className="panel-heading">
            <div>
              <h2>Last known location</h2>
              <p>GPS location from the demo device</p>
            </div>
            <MapPin />
          </div>

          <div className="map-placeholder">
            <MapPin size={32} />
            <b>Arnav's location</b>
            <small>17.348954, 78.339502</small>
          </div>

          <a href="/location">View location details →</a>
        </div>
      </div>

      <p className="demo-warning">
        Demo note: health readings and SOS are simulated for academic
        demonstration. They are not medical advice or a replacement
        for emergency services.
      </p>
    </>
  );
}
