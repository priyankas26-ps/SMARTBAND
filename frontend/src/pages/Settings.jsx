
import React, { useState } from 'react';

export default function Settings() {
  const [prefs, setPrefs] = useState(
    JSON.parse(
      localStorage.getItem('kidband-settings') ||
      '{"notifications":true,"sosNotifications":true,"locationTracking":true,"healthAlerts":true}'
    )
  );

  const update = (key) => {
    const next = {
      ...prefs,
      [key]: !prefs[key]
    };

    setPrefs(next);

    localStorage.setItem(
      'kidband-settings',
      JSON.stringify(next)
    );
  };

  const items = [
    ['notifications', 'General notifications'],
    ['sosNotifications', 'SOS notifications'],
    ['locationTracking', 'Location tracking'],
    ['healthAlerts', 'Health alerts']
  ];

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage parent app preferences for Arnav's band.</p>
        </div>
      </div>

      <div className="panel settings-panel">
        <h2>Notification preferences</h2>

        {items.map(([key, label]) => (
          <label className="setting-row" key={key}>
            <span>
              {label}
              <small>Control this feature in the demo app</small>
            </span>

            <input
              type="checkbox"
              checked={!!prefs[key]}
              onChange={() => update(key)}
            />
          </label>
        ))}
      </div>

      <div className="panel">
        <h2>Connected device</h2>

        <div className="device-row">
          <span className="device-icon">⌚</span>

          <div>
            <b>KidBand KB1024</b>
            <small>Assigned child: Arnav</small>
          </div>

          <span className="status-pill">
            <span className="dot" />
            Connected
          </span>
        </div>
      </div>
    </>
  );
}
