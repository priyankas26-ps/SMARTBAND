
import React, { useEffect, useState } from 'react';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

import { api } from '../api';

export default function Health() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api('/api/readings/history')
      .then(setData)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="page-heading">
        <div>
          <span className="eyebrow">WELLNESS</span>
          <h1>Health monitoring</h1>
          <p>
            Review the latest readings recorded by KidBand.
          </p>
        </div>
      </div>

      <div className="panel chart-panel">
        <h2>Heart rate trend</h2>
        <p>
          Sample readings across the recent monitoring period.
        </p>

        <div className="chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="recordedAt"
                tickFormatter={(v) =>
                  new Date(v).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                }
              />

              <YAxis />

              <Tooltip
                labelFormatter={(v) =>
                  new Date(v).toLocaleString()
                }
              />

              <Line
                type="monotone"
                dataKey="heartRate"
                stroke="#e45b83"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h2>Health indicators</h2>

        <div className="indicator-list">
          <p>
            <b>Heart rate</b>
            <span>Beats per minute (bpm)</span>
          </p>

          <p>
            <b>SpO₂</b>
            <span>Estimated blood oxygen percentage</span>
          </p>

          <p>
            <b>Temperature</b>
            <span>Body temperature in °C</span>
          </p>

          <p>
            <b>Battery</b>
            <span>Remaining band battery percentage</span>
          </p>
        </div>
      </div>

      <p className="demo-warning">
        All values are simulated sample data. Actual clinical
        monitoring requires validated sensors and medical review.
      </p>
    </>
  );
}
