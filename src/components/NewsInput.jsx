import React, { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#2ECC71", "#FF4B4B"]; // Green for REAL, Red for FAKE

export default function NewsInput() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    if (!text.trim() && !title.trim()) {
      alert("⚠️ Please enter news text or title!");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("https://rvmhp7-5000.csb.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, text }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert("❌ Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "40px",
        gap: "30px",
        flexWrap: "wrap",
        background: "linear-gradient(135deg, #f6f9fc, #e9f3ff)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Left Section - Input */}
      <div
        style={{
          flex: "1",
          minWidth: "380px",
          backgroundColor: "#ffffff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "25px",
            color: "#007bff",
          }}
        >
          📰 Fake News Detector
        </h2>

        {/* Title Input */}
        <label style={{ fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
          🧾 Title (Optional)
        </label>
        <input
          type="text"
          placeholder="Enter the news title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px",
            marginBottom: "20px",
            borderRadius: "12px",
            border: "2px solid #e0e0e0",
            fontSize: "16px",
            outline: "none",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #007bff")}
          onBlur={(e) => (e.target.style.border = "2px solid #e0e0e0")}
        />

        {/* News Input */}
        <label style={{ fontWeight: "600", color: "#333", display: "block", marginBottom: "8px" }}>
          📰 News Content
        </label>
        <textarea
          placeholder="Paste or type the news article here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            height: "180px",
            padding: "14px 16px",
            borderRadius: "12px",
            border: "2px solid #e0e0e0",
            fontSize: "16px",
            resize: "none",
            outline: "none",
            transition: "all 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.border = "2px solid #007bff")}
          onBlur={(e) => (e.target.style.border = "2px solid #e0e0e0")}
        />

        {/* Check Button */}
        <button
          onClick={handleCheck}
          style={{
            width: "100%",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "14px",
            borderRadius: "12px",
            marginTop: "25px",
            cursor: "pointer",
            fontSize: "17px",
            fontWeight: "600",
            letterSpacing: "0.5px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
          disabled={loading}
        >
          {loading ? "🔍 Analyzing..." : "Check News"}
        </button>
      </div>

      {/* Right Section - Result */}
      <div
        style={{
          flex: "1",
          minWidth: "380px",
          backgroundColor: "#ffffff",
          padding: "35px",
          borderRadius: "18px",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: "28px",
            fontWeight: "700",
            marginBottom: "25px",
            color: "#007bff",
          }}
        >
          📊 Result
        </h2>

        {result ? (
          <div style={{ textAlign: "center" }}>
            <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>
              Result:{" "}
              <span
                style={{
                  color: result.prediction === "REAL" ? "#2ecc71" : "#ff4b4b",
                  fontWeight: "700",
                }}
              >
                {result.prediction}
              </span>
            </h3>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "40px",
                margin: "20px 0",
                fontSize: "17px",
              }}
            >
              <div>
                <strong>✅ Real:</strong> {Math.round(result.probabilities.REAL * 100)}%
              </div>
              <div>
                <strong>❌ Fake:</strong> {Math.round(result.probabilities.FAKE * 100)}%
              </div>
            </div>

            {/* Chart */}
            <PieChart width={300} height={250} style={{ margin: "auto" }}>
              <Pie
                data={[
                  { name: "REAL", value: result.probabilities.REAL },
                  { name: "FAKE", value: result.probabilities.FAKE },
                ]}
                cx="50%"
                cy="50%"
                outerRadius={90}
                dataKey="value"
              >
                {/* Red for FAKE, Green for REAL */}
                <Cell key="real" fill="#2ECC71" />
                <Cell key="fake" fill="#FF4B4B" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>

            {/* Cleaned Text with Highlights */}
            <div
              style={{
                marginTop: "20px",
                padding: "15px",
                backgroundColor: "#f8f9fa",
                borderRadius: "10px",
                textAlign: "left",
                lineHeight: "1.6",
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                maxHeight: "220px",
                overflowY: "auto",
              }}
            >
              <strong>🧹 Cleaned Text:</strong>
              <br />
              {result.cleaned_text.split(" ").map((word, index) => {
                const fakeWords = result.important_words?.fake.map((w) => w[0]) || [];
                const realWords = result.important_words?.real.map((w) => w[0]) || [];

                let colorClass = "#555";
                if (fakeWords.includes(word)) colorClass = "#ff4b4b";
                if (realWords.includes(word)) colorClass = "#2ecc71";

                return (
                  <span
                    key={index}
                    style={{
                      color: colorClass,
                      fontWeight: fakeWords.includes(word) || realWords.includes(word) ? "600" : "400",
                      marginRight: "5px",
                    }}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        ) : (
          <p style={{ color: "#777", textAlign: "center" }}>
            🪄 Enter your news and click "Check News" to see the result.
          </p>
        )}
      </div>
    </div>
  );
}
