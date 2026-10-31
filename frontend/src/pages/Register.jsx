import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            await API.post("/auth/register", {
                name,
                email,
                password
            });

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/");
            }, 1500);

        } catch (error) {
            setError(
                error.response?.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <br />

                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        minLength="6"
                        required
                    />
                </div>

                <br />

                <button type="submit">Register</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <p>
                Already have an account? <Link to="/">Login here</Link>
            </p>
        </div>
    );
}

export default Register;