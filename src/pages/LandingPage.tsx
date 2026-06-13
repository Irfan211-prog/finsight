import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Cloud,
  Layers3,
  LockKeyhole,
  Sparkles,
  WalletCards,
} from "lucide-react";
import "../styles/landing.css";

const featureCards = [
  {
    icon: <WalletCards size={25} />,
    title: "Transaction Engine",
    text: "Record income and expenses with category, date, type, amount, and notes.",
  },
  {
    icon: <BarChart3 size={25} />,
    title: "Visual Money Map",
    text: "See where your money goes using category wise spending charts.",
  },
  {
    icon: <BrainCircuit size={25} />,
    title: "Insight Layer",
    text: "Get rule based observations that turn raw transactions into meaning.",
  },
  {
    icon: <Cloud size={25} />,
    title: "Cloud Persistence",
    text: "Firebase Firestore stores user transactions securely in the cloud.",
  },
];

const steps = [
  "Create your account",
  "Add daily transactions",
  "Filter and analyze",
  "Improve your spending",
];

function LandingPage() {
  return (
    <main className="wow-page">
      <nav className="wow-navbar">
        <Link to="/" className="wow-brand">
          <span className="wow-brand-mark">
            <BadgeIndianRupee size={24} />
          </span>
          <span>FinSight</span>
        </Link>

        <div className="wow-nav-links">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <Link to="/login">Login</Link>
          <Link to="/register" className="wow-nav-cta">
            Start Free
          </Link>
        </div>
      </nav>

      <section className="wow-hero">
        <div className="wow-hero-copy">
          <div className="wow-pill">
            <Sparkles size={16} />
            Mini Fintech Page
          </div>

          <h1>
            Your money.
            <span>Visualized.</span>
            Synced.
          </h1>

          <p>
            A personal finance web application that helps users track income,
            expenses, balance, category spending, and smart insights through a
            clean cloud-powered experience.
          </p>

          <div className="wow-hero-actions">
            <Link to="/register" className="wow-primary-btn">
              Build My Dashboard
              <ArrowRight size={18} />
            </Link>

            <Link to="/login" className="wow-secondary-btn">
              Login to Account
            </Link>
          </div>
        </div>

        <div className="wow-product-stage">
          <div className="wow-stage-ring ring-one"></div>
          <div className="wow-stage-ring ring-two"></div>
          <div className="wow-stage-ring ring-three"></div>

          <div className="wow-dashboard-device">
            <div className="device-header">
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Live Dashboard</p>
            </div>

            <div className="balance-panel">
              <p>Total Balance</p>
              <h2>₹52,840</h2>
              <div className="balance-line">
                <span></span>
              </div>
            </div>

            <div className="finance-grid">
              <div>
                <p>Income</p>
                <strong>₹68,000</strong>
              </div>
              <div>
                <p>Expense</p>
                <strong>₹15,160</strong>
              </div>
            </div>

            <div className="spend-bars">
              <span style={{ height: "38%" }}></span>
              <span style={{ height: "76%" }}></span>
              <span style={{ height: "52%" }}></span>
              <span style={{ height: "90%" }}></span>
              <span style={{ height: "64%" }}></span>
              <span style={{ height: "44%" }}></span>
            </div>
          </div>

          <div className="orbit-card orbit-left">
            <div className="orbit-icon">
              <LockKeyhole size={20} />
            </div>
            <div>
              <strong>Private</strong>
              <span>User-wise Firestore data</span>
            </div>
          </div>

          <div className="orbit-card orbit-right">
            <div className="orbit-icon">
              <BrainCircuit size={20} />
            </div>
            <div>
              <strong>Insight</strong>
              <span>Food is your top expense</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wow-strip">
        <div className="wow-strip-track">
            <span>Income Tracking</span>
            <span>Expense Control</span>
            <span>Category Filters</span>
            <span>Firestore Database</span>
            <span>Smart Insight</span>
            <span>Spending Chart</span>
            <span>Net Balance</span>
            <span>Secure Login</span>

            <span>Income Tracking</span>
            <span>Expense Control</span>
            <span>Category Filters</span>
            <span>Firestore Database</span>
            <span>Smart Insight</span>
            <span>Spending Chart</span>
            <span>Net Balance</span>
            <span>Secure Login</span>
        </div>
        </section>

      <section className="wow-repair-section">
        <div className="repair-copy">
          <p className="section-kicker">Why this feels different</p>
          <h2>
            We wanted to make personal finance
            <span> clear, beautiful, and cloud ready.</span>
          </h2>
        </div>

        <div className="repair-visual">
          <div className="stack-card stack-one">
            <span>01</span>
            <h3>Add</h3>
            <p>Income and expense records</p>
          </div>
          <div className="stack-card stack-two">
            <span>02</span>
            <h3>Analyze</h3>
            <p>Charts, filters, and summaries</p>
          </div>
          <div className="stack-card stack-three">
            <span>03</span>
            <h3>Improve</h3>
            <p>Insight-based spending decisions</p>
          </div>
        </div>
      </section>

      <section className="wow-features" id="features">
        <div className="wow-section-title">
          <p>Dashboard modules</p>
          <h2>The finance stack</h2>
        </div>

        <div className="wow-feature-grid">
          {featureCards.map((card) => (
            <article className="wow-feature-card" key={card.title}>
              <div className="feature-top">
                <div className="feature-icon">{card.icon}</div>
                <Layers3 size={20} />
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-shell" id="workflow">
        <div className="outside-section-heading">
            <p className="section-kicker">Simple flow</p>
        </div>

        <div className="wow-workflow">
            <div className="workflow-left">
            <h2>From login to financial clarity in four steps.</h2>
            <p>
                The app is designed like a real product: users enter through a
                landing page, authenticate, and manage their own cloud saved
                finance data.
            </p>
            </div>

            <div className="workflow-right">
            {steps.map((step, index) => (
                <div className="workflow-step" key={step}>
                <div>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step}</h3>
                </div>
                <CheckCircle2 size={24} />
                </div>
            ))}
            </div>
        </div>
        </section>

      <section className="final-cta-shell">
        <div className="outside-section-heading">
            <p className="section-kicker">Ready to track smarter?</p>
        </div>

        <div className="wow-final-cta">
            <div>
            <h2>Start with a secure account and build your finance profile.</h2>
            </div>

            <Link to="/register" className="wow-primary-btn">
            Create Account
            <ArrowRight size={18} />
            </Link>
        </div>
        </section>
    </main>
  );
}

export default LandingPage;