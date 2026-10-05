import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Loader2,
  X,
  KeyRound
} from "lucide-react";
import confetti from "canvas-confetti";
import { useUser } from "../context/UserContext";
import { useIssues } from "../context/IssueContext";
import "./LoginScreen.css";

export default function LoginScreen({ initialMode = "login" }) {
  const navigate = useNavigate();
  const { login, signup } = useUser();
  const { issues } = useIssues();

  // Welcome screen → Authentication screen
  const [showAuth, setShowAuth] = useState(
    initialMode === "signup"
  );

  // Login / Signup mode
  const [mode, setMode] = useState(initialMode);

  // Login fields
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Signup fields
  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpAddress, setSignUpAddress] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] =
    useState("");
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formAlert, setFormAlert] = useState(null);

  // Forgot password
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [isForgotSubmitting, setIsForgotSubmitting] =
    useState(false);

  // ============================================================
  // Switch between Login and Signup
  // ============================================================

  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setErrors({});
    setFormAlert(null);
  };

  // ============================================================
  // Login Validation
  // ============================================================

  const validateLoginForm = () => {
    const newErrors = {};
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      newErrors.identifier =
        "Email address or username is required.";
    } else if (trimmedIdentifier.includes("@")) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedIdentifier)) {
        newErrors.identifier =
          "Please enter a valid email address.";
      }
    } else if (trimmedIdentifier.length < 3) {
      newErrors.identifier =
        "Username must be at least 3 characters long.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // Signup Validation
  // ============================================================

  const validateSignUpForm = () => {
    const newErrors = {};

    if (!signUpName.trim()) {
      newErrors.signUpName = "Full name is required.";
    } else if (signUpName.trim().length < 2) {
      newErrors.signUpName =
        "Name must be at least 2 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!signUpEmail.trim()) {
      newErrors.signUpEmail =
        "Email address is required.";
    } else if (!emailRegex.test(signUpEmail.trim())) {
      newErrors.signUpEmail =
        "Please enter a valid email address.";
    }

    if (signUpPhone.trim()) {
      const cleanPhone = signUpPhone.replace(/\D/g, "");

      if (cleanPhone.length < 7 || cleanPhone.length > 15) {
        newErrors.signUpPhone =
          "Please enter a valid phone number.";
      }
    }

    if (!signUpPassword) {
      newErrors.signUpPassword =
        "Password is required.";
    } else if (signUpPassword.length < 6) {
      newErrors.signUpPassword =
        "Password must be at least 6 characters.";
    }

    if (!signUpConfirmPassword) {
      newErrors.signUpConfirmPassword =
        "Please confirm your password.";
    } else if (
      signUpPassword !== signUpConfirmPassword
    ) {
      newErrors.signUpConfirmPassword =
        "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // ============================================================
  // Login Submit
  // ============================================================

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setFormAlert(null);

    if (!validateLoginForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(identifier.trim(), password);

      setIsSubmitting(false);

      if (result.success) {
        setFormAlert({
          type: "success",
          message: `Welcome back, ${
            result.user.name.split(" ")[0]
          }! Redirecting to Civic Connect...`
        });

        setTimeout(() => {
          navigate("/home");
        }, 600);
      } else {
        setFormAlert({
          type: "error",
          message:
            result.error ||
            "Unable to sign in. Please verify your credentials."
        });
      }
    }, 450);
  };

  // ============================================================
  // Signup Submit
  // ============================================================

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    setFormAlert(null);

    if (!validateSignUpForm()) {
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = signup({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        contact: signUpPhone.trim(),
        address: signUpAddress.trim(),
        role: "Active Citizen"
      });

      setIsSubmitting(false);

      if (result.success) {
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: {
              y: 0.7
            }
          });
        } catch (error) {
          // Confetti is only a visual effect.
        }

        setFormAlert({
          type: "success",
          message: `Citizen profile created! Welcome, ${
            result.user.name
          }. Redirecting...`
        });

        setTimeout(() => {
          navigate("/home");
        }, 900);
      } else {
        setFormAlert({
          type: "error",
          message:
            result.error ||
            "Failed to register citizen account."
        });
      }
    }, 500);
  };

  // ============================================================
  // Forgot Password
  // ============================================================

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    setForgotError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !forgotEmail.trim() ||
      !emailRegex.test(forgotEmail.trim())
    ) {
      setForgotError(
        "Please enter a valid registered email address."
      );
      return;
    }

    setIsForgotSubmitting(true);

    setTimeout(() => {
      setIsForgotSubmitting(false);
      setForgotSubmitted(true);
    }, 500);
  };

  // ============================================================
  // Statistics
  // ============================================================

  const totalCount = issues.length;

  const resolvedCount = issues.filter(
    (issue) =>
      issue.status === "Completed" ||
      issue.status === "Resolved"
  ).length;

  // ============================================================
  // JSX
  // ============================================================

  return (
    <div className="login-page-root">

      {/* ==========================================================
          TOP BAR
          ========================================================== */}

      <header className="login-top-bar">

        <div className="login-top-spacer" />

        <div className="login-brand-badge">
          <img
            src="/logo.svg"
            alt="Civic Connect"
            className="login-logo-mini"
          />

          <span className="login-brand-text">
            Civic Connect
          </span>
        </div>

        <div className="login-top-spacer" />

      </header>

      {/* ==========================================================
          MAIN CONTENT
          ========================================================== */}

      <main className="login-main-wrapper">

        <div className="login-single-view">

          {/* ======================================================
              SCREEN 1 — CITIZEN WELCOME
              ====================================================== */}

          {!showAuth ? (

            <div className="welcome-screen">

              <div className="welcome-showcase-panel">

                <div className="showcase-glow-backdrop" />

                <div className="showcase-content">

                  {/* Brand Header */}
                  <div className="showcase-brand-header">

                    <div className="showcase-logo-ring">

                      <img
                        src="/logo.svg"
                        alt="Civic Connect Logo"
                        className="showcase-logo-img"
                      />

                    </div>

                    <div>

                      <div className="showcase-tag">

                        <Sparkles size={13} />

                        <span>
                          MUMBAI CITIZEN INITIATIVE
                        </span>

                      </div>

                      <h1 className="showcase-title">
                        Civic Connect
                      </h1>

                    </div>

                  </div>

                  {/* Description */}
                  <p className="showcase-tagline">
                    Report municipal issues, track road &
                    streetlight repairs in real-time, and
                    collaborate directly with ward authorities.
                  </p>

                  {/* Mumbai Skyline */}
                  <div className="showcase-skyline-preview">

                    <img
                      src="/skyline-hero.jpg"
                      alt="Mumbai Skyline"
                      className="showcase-skyline-img"
                    />

                    <div className="showcase-skyline-overlay">

                      <span className="showcase-quote">
                        "Transforming Mumbai one neighborhood
                        at a time."
                      </span>

                    </div>

                  </div>

                  {/* Features */}
                  <div className="showcase-features-list">

                    {/* Feature 1 */}
                    <div className="showcase-feature-item">

                      <div className="feature-icon-box">
                        <MapPin size={18} />
                      </div>

                      <div className="feature-text">

                        <h4 className="feature-title">
                          Geo-Tagged Grievances
                        </h4>

                        <p className="feature-desc">
                          Accurate GPS pinpointing for potholes,
                          drainage, and streetlights.
                        </p>

                      </div>

                    </div>

                    {/* Feature 2 */}
                    <div className="showcase-feature-item">

                      <div className="feature-icon-box">
                        <Building2 size={18} />
                      </div>

                      <div className="feature-text">

                        <h4 className="feature-title">
                          Municipal Ward Link
                        </h4>

                        <p className="feature-desc">
                          Routed straight to BMC sub-engineers
                          and sanitation officers.
                        </p>

                      </div>

                    </div>

                    {/* Feature 3 */}
                    <div className="showcase-feature-item">

                      <div className="feature-icon-box">
                        <CheckCircle2 size={18} />
                      </div>

                      <div className="feature-text">

                        <h4 className="feature-title">
                          Transparent Resolution
                        </h4>

                        <p className="feature-desc">
                          Step-by-step progress tracking with
                          photographic proof of fixes.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Statistics */}
                  <div className="showcase-stats-bar">

                    <div className="showcase-stat-block">

                      <span className="showcase-stat-value">
                        {totalCount}+
                      </span>

                      <span className="showcase-stat-label">
                        Issues Logged
                      </span>

                    </div>

                    <div className="showcase-stat-divider" />

                    <div className="showcase-stat-block">

                      <span className="showcase-stat-value">
                        {resolvedCount}
                      </span>

                      <span className="showcase-stat-label">
                        Resolved
                      </span>

                    </div>

                    <div className="showcase-stat-divider" />

                    <div className="showcase-stat-block">

                      <span className="showcase-stat-value">
                        24/7
                      </span>

                      <span className="showcase-stat-label">
                        Citizen Access
                      </span>

                    </div>

                  </div>

                  {/* Continue Button */}
                  <button
                    type="button"
                    className="welcome-continue-btn"
                    onClick={() => setShowAuth(true)}
                  >

                    <span>
                      Continue to Citizen Portal
                    </span>

                    <ArrowRight size={19} />

                  </button>

                </div>

              </div>

            </div>

          ) : (

            /* ====================================================
               SCREEN 2 — LOGIN / REGISTER
               ==================================================== */

            <div className="login-card-container">

              <div className="login-card">

                {/* Card Header */}
                <div className="login-card-header">

                  <div className="card-badge">

                    <ShieldCheck
                      size={13}
                      color="#38bdf8"
                    />

                    <span>
                      OFFICIAL CITIZEN PORTAL
                    </span>

                  </div>

                  <h2 className="login-card-title">
                    {mode === "login"
                      ? "Welcome Back"
                      : "Create Citizen Account"}
                  </h2>

                  <p className="login-card-subtitle">
                    {mode === "login"
                      ? "Sign in to submit grievances, check repair updates, and track local civic progress."
                      : "Join your fellow Mumbai residents to report issues and improve public services."}
                  </p>

                </div>

                {/* Login / Register Tabs */}
                <div
                  className="auth-tabs"
                  role="tablist"
                >

                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "login"}
                    className={`auth-tab-btn ${
                      mode === "login"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleModeSwitch("login")
                    }
                  >

                    <LogIn size={16} />

                    <span>
                      Sign In
                    </span>

                  </button>

                  <button
                    type="button"
                    role="tab"
                    aria-selected={mode === "signup"}
                    className={`auth-tab-btn ${
                      mode === "signup"
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      handleModeSwitch("signup")
                    }
                  >

                    <User size={16} />

                    <span>
                      Register
                    </span>

                  </button>

                </div>

                {/* Alert */}
                {formAlert && (

                  <div
                    className={`auth-alert ${
                      formAlert.type === "error"
                        ? "auth-alert-error"
                        : "auth-alert-success"
                    }`}
                    role="alert"
                  >

                    {formAlert.type === "error" ? (

                      <AlertCircle
                        size={18}
                        className="alert-icon"
                      />

                    ) : (

                      <CheckCircle2
                        size={18}
                        className="alert-icon"
                      />

                    )}

                    <span className="alert-text">
                      {formAlert.message}
                    </span>

                    <button
                      type="button"
                      className="alert-dismiss"
                      onClick={() =>
                        setFormAlert(null)
                      }
                      aria-label="Dismiss alert"
                    >
                      <X size={14} />
                    </button>

                  </div>

                )}

                {/* ==================================================
                    LOGIN FORM
                    ================================================== */}

                {mode === "login" ? (

                  <form
                    onSubmit={handleLoginSubmit}
                    className="auth-form"
                    noValidate
                  >

                    {/* Email / Username */}
                    <div className="form-group-modern">

                      <label
                        htmlFor="login-identifier"
                        className="form-label-modern"
                      >

                        Email Address or Username

                        <span className="req-star">
                          *
                        </span>

                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          errors.identifier
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Mail
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="login-identifier"
                          type="text"
                          autoComplete="username"
                          placeholder="Enter your email or username"
                          value={identifier}
                          onChange={(e) => {

                            setIdentifier(
                              e.target.value
                            );

                            if (errors.identifier) {

                              setErrors((previous) => ({
                                ...previous,
                                identifier: null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                      </div>

                      {errors.identifier && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.identifier}

                        </span>

                      )}

                    </div>

                    {/* Password */}
                    <div className="form-group-modern">

                      <div className="password-label-row">

                        <label
                          htmlFor="login-password"
                          className="form-label-modern"
                        >

                          Password

                          <span className="req-star">
                            *
                          </span>

                        </label>

                        <button
                          type="button"
                          className="forgot-password-link"
                          onClick={() => {

                            setShowForgotModal(true);
                            setForgotSubmitted(false);
                            setForgotError("");

                            setForgotEmail(
                              identifier.includes("@")
                                ? identifier
                                : ""
                            );

                          }}
                        >
                          Forgot Password?
                        </button>

                      </div>

                      <div
                        className={`input-wrapper-modern ${
                          errors.password
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Lock
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="login-password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => {

                            setPassword(
                              e.target.value
                            );

                            if (errors.password) {

                              setErrors((previous) => ({
                                ...previous,
                                password: null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >

                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}

                        </button>

                      </div>

                      {errors.password && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.password}

                        </span>

                      )}

                    </div>

                    {/* Remember Me */}
                    <div className="auth-options-row">

                      <label className="checkbox-container">

                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) =>
                            setRememberMe(
                              e.target.checked
                            )
                          }
                        />

                        <span className="checkbox-custom" />

                        <span className="checkbox-label">
                          Remember this device
                        </span>

                      </label>

                    </div>

                    {/* Login Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block auth-submit-btn"
                      disabled={isSubmitting}
                    >

                      {isSubmitting ? (

                        <>
                          <Loader2
                            size={18}
                            className="spin-icon"
                          />

                          <span>
                            Verifying Credentials...
                          </span>
                        </>

                      ) : (

                        <>
                          <LogIn size={18} />

                          <span>
                            Sign In to Civic Connect
                          </span>
                        </>

                      )}

                    </button>

                  </form>

                ) : (

                  /* ==================================================
                     SIGNUP FORM
                     ================================================== */

                  <form
                    onSubmit={handleSignUpSubmit}
                    className="auth-form"
                    noValidate
                  >

                    {/* Full Name */}
                    <div className="form-group-modern">

                      <label
                        htmlFor="signup-name"
                        className="form-label-modern"
                      >

                        Full Name

                        <span className="req-star">
                          *
                        </span>

                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          errors.signUpName
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <User
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="signup-name"
                          type="text"
                          placeholder="e.g. Diya Mehta"
                          value={signUpName}
                          onChange={(e) => {

                            setSignUpName(
                              e.target.value
                            );

                            if (errors.signUpName) {

                              setErrors((previous) => ({
                                ...previous,
                                signUpName: null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                      </div>

                      {errors.signUpName && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.signUpName}

                        </span>

                      )}

                    </div>

                    {/* Email */}
                    <div className="form-group-modern">

                      <label
                        htmlFor="signup-email"
                        className="form-label-modern"
                      >

                        Email Address

                        <span className="req-star">
                          *
                        </span>

                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          errors.signUpEmail
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Mail
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="signup-email"
                          type="email"
                          placeholder="diya.mehta@example.com"
                          value={signUpEmail}
                          onChange={(e) => {

                            setSignUpEmail(
                              e.target.value
                            );

                            if (errors.signUpEmail) {

                              setErrors((previous) => ({
                                ...previous,
                                signUpEmail: null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                      </div>

                      {errors.signUpEmail && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.signUpEmail}

                        </span>

                      )}

                    </div>

                    {/* Phone + Locality */}
                    <div className="form-row-dual">

                      {/* Phone */}
                      <div className="form-group-modern">

                        <label
                          htmlFor="signup-phone"
                          className="form-label-modern"
                        >
                          Contact Number
                        </label>

                        <div
                          className={`input-wrapper-modern ${
                            errors.signUpPhone
                              ? "has-error"
                              : ""
                          }`}
                        >

                          <Phone
                            size={17}
                            className="input-icon-left"
                          />

                          <input
                            id="signup-phone"
                            type="tel"
                            placeholder="9819001122"
                            value={signUpPhone}
                            onChange={(e) => {

                              setSignUpPhone(
                                e.target.value
                              );

                              if (
                                errors.signUpPhone
                              ) {

                                setErrors(
                                  (previous) => ({
                                    ...previous,
                                    signUpPhone: null
                                  })
                                );

                              }

                            }}
                            className="form-input-modern"
                          />

                        </div>

                        {errors.signUpPhone && (

                          <span className="field-error-text">

                            <AlertCircle size={13} />

                            {errors.signUpPhone}

                          </span>

                        )}

                      </div>

                      {/* Locality */}
                      <div className="form-group-modern">

                        <label
                          htmlFor="signup-address"
                          className="form-label-modern"
                        >
                          Locality / Ward
                        </label>

                        <div className="input-wrapper-modern">

                          <MapPin
                            size={17}
                            className="input-icon-left"
                          />

                          <input
                            id="signup-address"
                            type="text"
                            placeholder="Bandra West, Mumbai"
                            value={signUpAddress}
                            onChange={(e) =>
                              setSignUpAddress(
                                e.target.value
                              )
                            }
                            className="form-input-modern"
                          />

                        </div>

                      </div>

                    </div>

                    {/* Create Password */}
                    <div className="form-group-modern">

                      <label
                        htmlFor="signup-password"
                        className="form-label-modern"
                      >

                        Create Password

                        <span className="req-star">
                          *
                        </span>

                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          errors.signUpPassword
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Lock
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="signup-password"
                          type={
                            showPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="At least 6 characters"
                          value={signUpPassword}
                          onChange={(e) => {

                            setSignUpPassword(
                              e.target.value
                            );

                            if (
                              errors.signUpPassword
                            ) {

                              setErrors((previous) => ({
                                ...previous,
                                signUpPassword: null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() =>
                            setShowPassword(
                              !showPassword
                            )
                          }
                          aria-label={
                            showPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >

                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}

                        </button>

                      </div>

                      {errors.signUpPassword && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.signUpPassword}

                        </span>

                      )}

                    </div>

                    {/* Confirm Password */}
                    <div className="form-group-modern">

                      <label
                        htmlFor="signup-confirm-password"
                        className="form-label-modern"
                      >

                        Confirm Password

                        <span className="req-star">
                          *
                        </span>

                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          errors.signUpConfirmPassword
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Lock
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="signup-confirm-password"
                          type={
                            showConfirmPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Re-type password"
                          value={
                            signUpConfirmPassword
                          }
                          onChange={(e) => {

                            setSignUpConfirmPassword(
                              e.target.value
                            );

                            if (
                              errors.signUpConfirmPassword
                            ) {

                              setErrors((previous) => ({
                                ...previous,
                                signUpConfirmPassword:
                                  null
                              }));

                            }

                          }}
                          className="form-input-modern"
                        />

                        <button
                          type="button"
                          className="password-toggle-btn"
                          onClick={() =>
                            setShowConfirmPassword(
                              !showConfirmPassword
                            )
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Hide password"
                              : "Show password"
                          }
                        >

                          {showConfirmPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}

                        </button>

                      </div>

                      {errors.signUpConfirmPassword && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {errors.signUpConfirmPassword}

                        </span>

                      )}

                    </div>

                    {/* Register Button */}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block auth-submit-btn"
                      disabled={isSubmitting}
                    >

                      {isSubmitting ? (

                        <>
                          <Loader2
                            size={18}
                            className="spin-icon"
                          />

                          <span>
                            Registering Profile...
                          </span>
                        </>

                      ) : (

                        <>
                          <ArrowRight size={18} />

                          <span>
                            Register & Get Started
                          </span>
                        </>

                      )}

                    </button>

                  </form>
                )}

                {/* Footer */}
                <div className="login-card-footer">

                  {mode === "login" ? (

                    <p className="auth-switch-text">

                      Don't have an account?{" "}

                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() =>
                          handleModeSwitch("signup")
                        }
                      >
                        Sign Up
                      </button>

                    </p>

                  ) : (

                    <p className="auth-switch-text">

                      Already registered?{" "}

                      <button
                        type="button"
                        className="auth-switch-btn"
                        onClick={() =>
                          handleModeSwitch("login")
                        }
                      >
                        Sign In
                      </button>

                    </p>

                  )}

                  <div className="login-trust-notice">

                    <ShieldCheck
                      size={14}
                    />

                    <span>
                      Secured by Municipal Civic Services
                      • SSL Encrypted
                    </span>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>

      </main>

      {/* ==========================================================
          FORGOT PASSWORD MODAL
          ========================================================== */}

      {showForgotModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowForgotModal(false)
          }
        >

          <div
            className="modal-container forgot-modal-box"
            onClick={(e) =>
              e.stopPropagation()
            }
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-title"
          >

            <button
              className="modal-close-btn"
              onClick={() =>
                setShowForgotModal(false)
              }
              aria-label="Close dialog"
            >
              <X size={18} color="#ffffff" />
            </button>

            <div className="forgot-modal-body">

              <div className="forgot-icon-ring">

                <KeyRound
                  size={26}
                  color="#38bdf8"
                />

              </div>

              <h3
                id="forgot-title"
                className="forgot-modal-title"
              >
                Reset Account Password
              </h3>

              {!forgotSubmitted ? (

                <>
                  <p className="forgot-modal-desc">
                    Enter your registered citizen email.
                    We will send a secure 6-digit recovery
                    code to restore your account.
                  </p>

                  <form
                    onSubmit={handleForgotSubmit}
                    className="forgot-form"
                    noValidate
                  >

                    <div className="form-group-modern">

                      <label
                        htmlFor="forgot-email"
                        className="form-label-modern"
                      >
                        Registered Email Address
                      </label>

                      <div
                        className={`input-wrapper-modern ${
                          forgotError
                            ? "has-error"
                            : ""
                        }`}
                      >

                        <Mail
                          size={18}
                          className="input-icon-left"
                        />

                        <input
                          id="forgot-email"
                          type="email"
                          placeholder="Enter your registered email"
                          value={forgotEmail}
                          onChange={(e) => {

                            setForgotEmail(
                              e.target.value
                            );

                            setForgotError("");

                          }}
                          className="form-input-modern"
                          autoFocus
                        />

                      </div>

                      {forgotError && (

                        <span className="field-error-text">

                          <AlertCircle size={13} />

                          {forgotError}

                        </span>

                      )}

                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block auth-submit-btn"
                      disabled={isForgotSubmitting}
                    >

                      {isForgotSubmitting ? (

                        <>
                          <Loader2
                            size={18}
                            className="spin-icon"
                          />

                          <span>
                            Sending Recovery Link...
                          </span>
                        </>

                      ) : (

                        <span>
                          Send Recovery Code
                        </span>

                      )}

                    </button>

                  </form>
                </>

              ) : (

                <div className="forgot-success-view">

                  <div className="success-pill">

                    <CheckCircle2
                      size={16}
                      color="#10b981"
                    />

                    <span>
                      Recovery Code Sent
                    </span>

                  </div>

                  <p className="forgot-modal-desc">
                    We've sent a 6-digit verification
                    code to{" "}
                    <strong>
                      {forgotEmail}
                    </strong>
                    . Follow the instructions in the
                    email to set a new password.
                  </p>

                  <button
                    type="button"
                    className="btn btn-primary btn-block"
                    onClick={() =>
                      setShowForgotModal(false)
                    }
                  >
                    Return to Sign In
                  </button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}