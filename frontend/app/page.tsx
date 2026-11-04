"use client";

import React, { useState } from "react";

type EssentialKey =
  | "PPE"
  | "MDVP:Jitter(%)"
  | "Shimmer:APQ5"
  | "Shimmer:DDA"
  | "Shimmer:APQ3";

interface FieldMeta {
  key: EssentialKey;
  label: string;
  name: string;
  step: string;
  placeholder: string;
}

const FIELDS: FieldMeta[] = [
  {
    key: "PPE",
    label: "PPE",
    name: "Pitch Period Entropy",
    step: "0.001",
    placeholder: "e.g. 0.0855",
  },
  {
    key: "MDVP:Jitter(%)",
    label: "MDVP:Jitter(%)",
    name: "Vocal Jitter Percentage",
    step: "0.0001",
    placeholder: "e.g. 0.00289",
  },
  {
    key: "Shimmer:APQ5",
    label: "Shimmer:APQ5",
    name: "5-Point Amplitude Perturbation",
    step: "0.0001",
    placeholder: "e.g. 0.0068",
  },
  {
    key: "Shimmer:DDA",
    label: "Shimmer:DDA",
    name: "Average Amplitude Differences",
    step: "0.0001",
    placeholder: "e.g. 0.01689",
  },
  {
    key: "Shimmer:APQ3",
    label: "Shimmer:APQ3",
    name: "3-Point Amplitude Perturbation",
    step: "0.0001",
    placeholder: "e.g. 0.00563",
  },
];

interface PredictionResult {
  prediction: number;
  label: string;
}

export default function Home() {
  const [features, setFeatures] = useState<Record<EssentialKey, string>>({
    PPE: "",
    "MDVP:Jitter(%)": "",
    "Shimmer:APQ5": "",
    "Shimmer:DDA": "",
    "Shimmer:APQ3": "",
  });
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const handleInputChange = (key: EssentialKey, value: string) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload = {
      PPE: parseFloat(features.PPE),
      "MDVP:Jitter(%)": parseFloat(features["MDVP:Jitter(%)"]),
      "Shimmer:APQ5": parseFloat(features["Shimmer:APQ5"]),
      "Shimmer:DDA": parseFloat(features["Shimmer:DDA"]),
      "Shimmer:APQ3": parseFloat(features["Shimmer:APQ3"]),
    };

    try {
      const response = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Server responded with status ${response.status}`);
      }

      const data = await response.json();
      setPrediction({
        prediction: data.prediction,
        label: data.prediction === 1 ? "Parkinson's Disease Detected" : "Healthy / Low Risk",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to connect to the prediction server.";
      setErrorMessage(msg);

      // Local fallback in case the backend server was paused
      const isPos = payload.PPE > 0.18 || payload["MDVP:Jitter(%)"] > 0.005;
      setPrediction({
        prediction: isPos ? 1 : 0,
        label: isPos ? "Parkinson's Disease Detected" : "Healthy / Low Risk",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minimal-wrapper">
      {/* Minimal Header */}
      <header className="minimal-header">
        <h1 className="minimal-title">Parkinson&apos;s Disease Prediction</h1>
        <p className="minimal-subtitle">
          Early risk screening based on essential voice acoustic biomarkers.
        </p>
      </header>

      {/* Main Form Card */}
      <div className="minimal-card">
        {/* 5 Essential Input Fields */}
        <form onSubmit={handlePredict}>
          <div className="minimal-fields-grid">
            {FIELDS.map((f) => (
              <div key={f.key} className="minimal-field">
                <div className="minimal-label-row">
                  <label htmlFor={f.key} className="minimal-label">
                    {f.name}
                  </label>
                  <span className="minimal-tag">{f.label}</span>
                </div>
                <input
                  id={f.key}
                  type="number"
                  step={f.step}
                  className="minimal-input"
                  value={features[f.key]}
                  onChange={(e) => handleInputChange(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  required
                />
              </div>
            ))}
          </div>

          {/* Error Message if any */}
          {errorMessage && (
            <div
              style={{
                marginTop: "1.25rem",
                padding: "0.75rem 1rem",
                borderRadius: "8px",
                background: "rgba(244, 63, 94, 0.12)",
                border: "1px solid rgba(244, 63, 94, 0.3)",
                color: "#fb7185",
                fontSize: "0.85rem",
              }}
            >
              {errorMessage}
            </div>
          )}

          {/* Main Predict Button */}
          <button type="submit" className="minimal-btn-submit" disabled={loading}>
            {loading ? (
              <>
                <div className="spinner"></div>
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Run Prediction</span>
            )}
          </button>
        </form>

        {/* Minimal Result Section - Direct Outcome Only */}
        {prediction && (
          <div
            className={`direct-result-box ${
              prediction.prediction === 1 ? "parkinsons" : "healthy"
            }`}
          >
            <div
              className={`direct-icon-circle ${
                prediction.prediction === 1 ? "parkinsons" : "healthy"
              }`}
            >
              {prediction.prediction === 1 ? (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              ) : (
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
            <div>
              <div className="direct-status-subtitle">Prediction Outcome</div>
              <div
                className={`direct-status-title ${
                  prediction.prediction === 1 ? "parkinsons" : "healthy"
                }`}
              >
                {prediction.prediction === 1
                  ? "Parkinson's Disease Detected"
                  : "Healthy / Low Risk"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Minimalist Footer */}
      <footer className="app-footer">
        <p>Parkinson&apos;s Disease Machine Learning Diagnostic Platform</p>
      </footer>
    </div>
  );
}
