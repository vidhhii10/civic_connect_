import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, ShieldCheck } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { AUTHORITY_DEMO_ACCOUNTS } from "../../services/seedData";
import "../../components/authority/Authority.css";

export default function AuthorityLoginScreen() {
  const { login } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const signIn = (accountEmail, accountPassword) => {
    const result = login(accountEmail, accountPassword);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate("/authority/dashboard", { replace: true });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    signIn(email, password);
  };

  const supervisor = AUTHORITY_DEMO_ACCOUNTS.find((account) => account.authorityRole === "supervisor");
  const fieldOfficer = AUTHORITY_DEMO_ACCOUNTS.find((account) => account.authorityRole === "field_officer");

  return (
    <main className="authority-login-page">
      <section className="authority-login-panel">
        <div className="authority-login-brand">
          <span className="authority-login-mark"><Building2 size={20} /></span>
          <div>
            <strong>Civic Connect</strong>
            <span>Authority Portal</span>
          </div>
        </div>
        <div className="authority-login-heading">
          <ShieldCheck size={22} />
          <div>
            <h1>Official Sign In</h1>
            <p>Access your municipal work queue.</p>
          </div>
        </div>

        <form className="authority-login-form" onSubmit={handleSubmit}>
          <label htmlFor="authority-email">Official Email</label>
          <input
            id="authority-email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <label htmlFor="authority-password">Password</label>
          <input
            id="authority-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {error && <p className="authority-login-error" role="alert">{error}</p>}
          <button className="authority-login-submit" type="submit">Login</button>
        </form>

        <div className="authority-demo-logins">
          <span>Demo access</span>
          <button type="button" onClick={() => signIn(supervisor.email, supervisor.password)}>
            Login as Ward Supervisor
          </button>
          <button type="button" onClick={() => signIn(fieldOfficer.email, fieldOfficer.password)}>
            Login as Field Officer
          </button>
        </div>
      </section>
    </main>
  );
}