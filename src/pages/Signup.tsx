import { useState } from "react";
// import { getAuth, createUserWithEmailAndPassword,  } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../firebase/authentication"

// const auth = getAuth();

// const defaultFormFields = {
//   email: "",
//   password: ","
// }

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        setError("Passwords did not match."); 
        return;
      }

      // The user will be login upon successful registration.
      await registerUser(name, email, password);
      navigate("/");
    } catch (error:any) {
      if (error) {
        if (error.code === "auth/weak-password") {
          setError("Password must be at least 6 characters.");
        } else if (error.code === "auth/email-already-in-use") {
          setError("Email is already in use.");
        } else {
          setError(error.message || "An error occurred during signup.");
        }
      }
    }
  }

  return (
    <div>
      <form onSubmit={handleSignup}>
      <input
          type="string"
          placeholder="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Signup;