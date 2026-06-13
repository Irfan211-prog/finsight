import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../services/firebase";
import "../styles/login.css";

type LoginForm = {
  email: string;
  password: string;
};

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [forgotOpen, setForgotOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("finsightRememberEmail");

    if (savedEmail) {
      setFormData((prev) => ({
        ...prev,
        email: savedEmail,
      }));

      setRememberMe(true);
    }
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setMessage("");
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, email, password);

      if (rememberMe) {
        localStorage.setItem("finsightRememberEmail", email);
      } else {
        localStorage.removeItem("finsightRememberEmail");
      }

      navigate("/dashboard");
    } catch {
      setMessage("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setResetEmail(formData.email.trim());
    setResetMessage("");
    setMessage("");
    setForgotOpen(true);
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const email = resetEmail.trim();

    if (!email) {
      setResetMessage("Please enter your email to reset password.");
      return;
    }

    try {
      setResetLoading(true);
      setResetMessage("");

      await sendPasswordResetEmail(auth, email);

      setResetMessage("Password reset link sent to your email.");
    } catch {
      setResetMessage("Unable to send reset email. Please check your email.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <main className="login-page">
      <nav className="login-navbar">
        <Link to="/" className="login-brand">
          <span className="login-brand-mark">
            <BadgeIndianRupee size={24} />
          </span>
          <span>FinSight</span>
        </Link>

        <Link to="/register" className="login-top-btn">
          Create Account
        </Link>
      </nav>

      <section className="login-shell">
        <div className="login-left">
          <div className="login-pill">
            <Sparkles size={16} />
            Welcome back
          </div>

          <h1>
            Login to your
            <span>finance dashboard.</span>
          </h1>

          <p>
            Track income, manage expenses, view category spending, and continue
            building better money habits from your secure account.
          </p>

          <div className="login-benefits">
            <div>
              <ShieldCheck size={22} />
              <span>Secure Firebase login</span>
            </div>

            <div>
              <LockKeyhole size={22} />
              <span>User-wise private transactions</span>
            </div>
          </div>
        </div>

        <div className="login-card-wrap">
          <form className="login-card" onSubmit={handleLogin}>
            <div className="login-card-header">
              <div className="login-card-icon">
                <LockKeyhole size={26} />
              </div>

              <div>
                <h2>Sign in</h2>
                <p>Enter your account details below</p>
              </div>
            </div>

            {message && <div className="login-message">{message}</div>}

            <div className="login-field">
              <label>Email address</label>
              <div className="login-input-box">
                <Mail size={19} />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="login-field">
              <label>Password</label>
              <div className="login-input-box">
                <LockKeyhole size={19} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />

                <button
                  type="button"
                  className="password-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button type="button" onClick={openForgotPassword}>
                Forgot password?
              </button>
            </div>

            <button
              className="login-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login to Dashboard"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="login-register-text">
              New to FinSight? <Link to="/register">Create an account</Link>
            </p>
          </form>
        </div>
      </section>

      {forgotOpen && (
        <div className="forgot-overlay">
          <form className="forgot-card" onSubmit={handleForgotPassword}>
            <button
              type="button"
              className="forgot-close-btn"
              onClick={() => setForgotOpen(false)}
              aria-label="Close forgot password popup"
            >
              <X size={20} />
            </button>

            <div className="forgot-icon">
              <Mail size={25} />
            </div>

            <h2>Reset password</h2>

            <p>
              Enter your registered email. Firebase will send a password reset
              link to your inbox.
            </p>

            {resetMessage && (
              <div className="login-message forgot-message">
                {resetMessage}
              </div>
            )}

            <div className="login-field">
              <label>Email address</label>
              <div className="login-input-box">
                <Mail size={19} />
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  value={resetEmail}
                  onChange={(e) => {
                    setResetEmail(e.target.value);
                    setResetMessage("");
                  }}
                />
              </div>
            </div>

            <button
              className="login-submit-btn"
              type="submit"
              disabled={resetLoading}
            >
              {resetLoading ? "Sending link..." : "Send Reset Link"}
              {!resetLoading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      )}
    </main>
  );
}

export default LoginPage;