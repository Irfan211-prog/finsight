import { useState } from "react";
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
  UserRound,
} from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import "../styles/login.css";
import "../styles/register.css";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill all the fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        createdAt: serverTimestamp(),
      });

      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        const firebaseError = err as { code?: string };

        if (firebaseError.code === "auth/email-already-in-use") {
          setError("This email is already registered. Please login instead.");
        } else if (firebaseError.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else {
          setError("Unable to create account. Please try again.");
        }
      } else {
        setError("Unable to create account. Please try again.");
      }
    } finally {
      setLoading(false);
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

        <Link to="/login" className="login-top-btn">
          Login
        </Link>
      </nav>

      <section className="login-shell register-shell">
        <div className="login-left">
          <div className="login-pill">
            <Sparkles size={16} />
            Start your journey
          </div>

          <h1>
            Create your
            <span>finance account.</span>
          </h1>

          <p>
            Build your personal finance profile, save your transactions
            securely, and track income, expenses, balance, and smart insights in
            one clean dashboard.
          </p>

          <div className="login-benefits">
            <div>
              <ShieldCheck size={22} />
              <span>Cloud saved finance data</span>
            </div>

            <div>
              <LockKeyhole size={22} />
              <span>Private user-wise dashboard</span>
            </div>
          </div>
        </div>

        <div className="login-card-wrap">
          <form className="login-card register-card" onSubmit={handleRegister}>
            <div className="login-card-header">
              <div className="login-card-icon">
                <UserRound size={26} />
              </div>

              <div>
                <h2>Create account</h2>
                <p>Enter your details to get started</p>
              </div>
            </div>

            {error && <div className="login-message">{error}</div>}

            <div className="login-field">
              <label>Full name</label>
              <div className="login-input-box">
                <UserRound size={19} />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

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

            <div className="register-password-grid">
              <div className="login-field">
                <label>Password</label>
                <div className="login-input-box">
                  <LockKeyhole size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <div className="login-field">
                <label>Confirm password</label>
                <div className="login-input-box">
                  <LockKeyhole size={19} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="password-eye"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              className="login-submit-btn register-submit-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create My Dashboard"}
              {!loading && <ArrowRight size={18} />}
            </button>

            <p className="login-register-text">
              Already have an account? <Link to="/login">Login here</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}

export default RegisterPage;