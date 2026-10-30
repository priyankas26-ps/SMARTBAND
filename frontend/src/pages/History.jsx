
import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function History() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api('/api/readings/history')
      .then(setRows)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">RECORDS</span>
          <h1>Health history</h1>
          <p>Recent sample readings stored by the system.</p>
        </div>
      </div>

      <div className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Heart rate</th>
                <th>SpO₂</th>
                <th>Temperature</th>
                <th>Battery</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr key={r._id || i}>
                  <td>
                    {new Date(r.recordedAt).toLocaleString()}
                  </td>
                  <td>{r.heartRate} bpm</td>
                  <td>{r.spo2}%</td>
                  <td>{r.temperature} °C</td>
                  <td>{r.battery}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!rows.length && (
          <p>No readings yet. Start the backend and refresh.</p>
        )}
      </div>
    </>
  );
}
