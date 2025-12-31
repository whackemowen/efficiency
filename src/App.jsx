import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Calendar, ArrowRight, Lock, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

function App() {
  const [goal, setGoal] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!goal || !apiKey) {
      setError('Please provide both a goal and your OpenAI API key.');
      return;
    }
    setError(null);
    setLoading(true);
    setPlan(null);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are Efficiency AI, an expert planner. Your goal is to take a user's objective and break it down into a highly specific, actionable, and efficient schedule and plan. Format the output with clear headers, bullet points, and timelines."
            },
            {
              role: "user",
              content: `Create a detailed plan and schedule for this goal: ${goal}`
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate plan');
      }

      const data = await response.json();
      const generatedText = data.choices[0].message.content;
      setPlan(generatedText);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav className="navbar glass-panel">
        <div className="nav-content">
          <div className="logo-container">
            <div className="logo-icon">
              <Brain size={24} color="#fff" />
            </div>
            <span className="logo-text">Efficiency<span className="highlight">AI</span></span>
          </div>
          <div className="nav-links">
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">About</a>
          </div>
        </div>
      </nav>

      <main className="main-content">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="hero-section"
        >
          <div className="badge">
            <Sparkles size={14} />
            <span>AI-Powered Productivity</span>
          </div>
          <h1 className="hero-title">
            Master your schedule.<br />
            Achieve your goals.
          </h1>
          <p className="hero-subtitle">
            Enter your main objective, provide your API key, and let our AI architect the perfect roadmap for your success.
          </p>
        </motion.div>

        {/* Interaction Section */}
        <div className="split-layout">

          {/* Input Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="card config-card glass-panel"
          >
            <div className="card-glow"></div>

            <h2 className="card-header">
              <Activity size={20} className="icon-highlight" />
              Configuration
            </h2>

            <div className="form-stack">
              <div className="input-group">
                <label className="label">Your Goal</label>
                <textarea
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Learn Python in 30 days, Run a marathon..."
                  className="input-field textarea-field"
                />
              </div>

              <div className="input-group">
                <label className="label">OpenAI API Key</label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="input-field"
                  />
                  <Lock size={16} className="lock-icon" />
                </div>
                <p className="input-hint">Your key is used locally and never stored.</p>
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <>Processing...</>
                ) : (
                  <>
                    Generate Plan
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {error && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <p>{error}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Results Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="result-container"
          >
            {plan ? (
              <div className="card result-card glass-panel">
                <div className="result-header">
                  <h2 className="card-header">
                    <CheckCircle2 size={20} className="icon-success" />
                    Your Personalized Plan
                  </h2>
                  <button
                    onClick={() => { navigator.clipboard.writeText(plan); }}
                    className="copy-btn"
                  >
                    Copy to clipboard
                  </button>
                </div>
                <div className="markdown-content">
                  {plan}
                </div>
              </div>
            ) : (
              <div className="card placeholder-card glass-panel">
                <div className="placeholder-icon">
                  <Calendar size={32} />
                </div>
                <h3 className="placeholder-title">Ready to plan?</h3>
                <p className="placeholder-text">
                  Enter your goal and API key on the left to generate your custom schedule.
                </p>
              </div>
            )}
          </motion.div>

        </div>
      </main>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Efficiency AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
