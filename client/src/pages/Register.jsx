import { useState } from "react";
import { User, Mail, Lock, Shield } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF"
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/register`,
        form
      );
      navigate("/login");
    } catch {
      setError("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold mb-1 text-center">
          Create Account
        </h1>
        <p className="text-sm text-slate-600 mb-6 text-center">
          Choose your role and get started
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <Input icon={User} name="name" placeholder="Full Name" onChange={handleChange} />
          <Input icon={Mail} name="email" placeholder="Email" onChange={handleChange} />
          <Input icon={Lock} name="password" type="password" placeholder="Password" onChange={handleChange} />

          <div className="mb-5 relative">
            <Shield className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <select
              name="role"
              className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-slate-400"
              onChange={handleChange}
            >
              <option value="STAFF">Staff – Manage sales</option>
              <option value="ADMIN">Admin – Full access</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-2 rounded hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-slate-600 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-slate-900 font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

const Input = ({ icon: Icon, ...props }) => (
  <div className="mb-4 relative">
    <Icon className="absolute left-3 top-2.5 text-slate-400" size={18} />
    <input
      {...props}
      className="w-full pl-10 p-2 border rounded focus:ring-2 focus:ring-slate-400"
      required
    />
  </div>
);

export default Register;
