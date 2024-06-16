import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [creds, setCreds] = useState({email: "", password: ""});
  let navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = "http://localhost:5000/api/auth/login";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: creds.email, password: creds.password }),
    });
    const json = await response.json();
    console.log(json);
    if (json.success) {
        // save the authoken and redirect
        localStorage.setItem('token', json.authToken);
        navigate("/");
    }
    else {
        alert('invalid credentials')
    }
  };

  const onChange = (e) => {
    setCreds({
      ...creds,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <form className="my-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            value={creds.email}
            onChange={onChange}
            name="email"
            id="email"
            aria-describedby="emailHelp"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            value={creds.password}
            onChange={onChange}
            name="password"
            className="form-control"
            id="password"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
}
