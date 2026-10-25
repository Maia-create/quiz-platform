import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const rules = [
    { text: "მინიმუმ 8 სიმბოლო", ok: form.password.length >= 8 },
    { text: "დიდი ლათინური ასო (A-Z)", ok: /[A-Z]/.test(form.password) },
    { text: "პატარა ლათინური ასო (a-z)", ok: /[a-z]/.test(form.password) },
    { text: "ციფრი (0-9)", ok: /\d/.test(form.password) },
    {
      text: "სპეციალური სიმბოლო (!@#$%...)",
      ok: /[^\p{L}\p{N}\s]/u.test(form.password),
    },
  ];
  const strong = rules.every((r) => r.ok);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!strong) {
      setError("პაროლი არ აკმაყოფილებს მოთხოვნებს");
      return;
    }

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
    const result = await register(fullName, form.email, form.password);
    if (result.ok) navigate("/");
    else setError(result.error);
  };

  return (
    <div>
      <h2>რეგისტრაცია</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          name="firstName"
          placeholder="სახელი"
          value={form.firstName}
          onChange={handleChange}
          required
        />
        <input
          name="lastName"
          placeholder="გვარი"
          value={form.lastName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="ელფოსტა"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="პაროლი"
          value={form.password}
          onChange={handleChange}
          required
        />

        <ul className="rules">
          {rules.map((r) => (
            <li key={r.text} className={r.ok ? "ok" : ""}>
              {r.ok ? "✓" : "○"} {r.text}
            </li>
          ))}
        </ul>

        {error && <p className="error">{error}</p>}
        <button type="submit">რეგისტრაცია</button>
      </form>
      <p>
        უკვე გაქვთ ანგარიში? <Link to="/login">შესვლა</Link>
      </p>
    </div>
  );
}

export default Register;