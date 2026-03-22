import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import googleIcon from "../assets/images/google.svg";
import { useEffect, useRef } from "react";
import axios from "axios";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const googleInitialized = useRef(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccess(false);
    setError(null);

    try {
      setLoading(true);
      await register(username, password, firstName, lastName, email);
      setSuccess(true);
      navigate("/");
    } catch (error) {
      setError(error.message);
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!window.google || googleInitialized.current) return;

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleCredentialResponse,
    });

    googleInitialized.current = true;
  }, []);

  const handleGoogleSignup = () => {
    alert("Due to technical issues,Google signup is currently unavailable. Please try again later.");
    console.log("Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
    if (!window.google) {
      console.error("Google Identity Services not loaded yet.");
      return;
    }
    window.google.accounts.id.prompt(); 
  };

  const handleGoogleCredentialResponse = async (response) => {
    try {
      const { data } = await axios.post(
        "/api/auth/google",
        { credential: response.credential },
        { withCredentials: true }
      );

      window.location.href = "/profile";
    } catch (err) {
      console.error(
        err?.response?.data?.message || "Google signup failed"
      );
    }
  };

  return (
    <div className="bg-bg min-h-screen flex items-start justify-center px-4 pt-10 pb-10 mb-8">
      <div className="bg-card w-full max-w-6xl border border-border rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div className="relative w-full md:w-1/2 min-h-[260px] md:min-h-[650px]">
          <img
            src="https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1200&q=80"
            alt="Register"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45 flex flex-col justify-end p-6 md:p-10 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Ready to be a DORC?
            </h2>
            <p className="text-sm md:text-base text-white/90 max-w-sm">
              Join our community today and create your account in just a few
              steps.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center">
          <div className="w-full max-w-md mx-auto px-6 py-8 sm:px-8 md:px-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="mb-2">
                <h1 className="text-fg text-left text-3xl font-bold">
                  Create Your Account
                </h1>
                <p className="text-sm text-fg/70 mt-2">
                  Fill in your details to get started.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  type="text"
                  placeholder="First Name"
                  className="p-3 rounded-full bg-bg border border-border text-fg w-full outline-none focus:ring-2 focus:ring-accent/30"
                />

                <input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  type="text"
                  placeholder="Last Name"
                  className="p-3 rounded-full bg-bg border border-border text-fg w-full outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Username"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="p-3 rounded-full bg-bg border border-border text-fg outline-none focus:ring-2 focus:ring-primary/30"
              />

              <button
                disabled={loading}
                type="submit"
                className="bg-accent text-white p-3 px-7 rounded-full font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

              {success && (
                <span className="text-sm text-center text-green-600">
                  Account created successfully
                </span>
              )}

              {error && (
                <span className="text-sm text-center text-red-500">
                  {error}
                </span>
              )}
              <div>
                <p className="text-center">or</p>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignup}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-full border border-border bg-white text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                <img src={googleIcon} alt="Google" className="w-5 h-5" />
                Sign up with Google
              </button>

              <p className="text-sm text-center text-fg/70 mt-2">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-accent font-medium cursor-pointer"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
