import { useState, useEffect } from "react";

export default function LogIn(props) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3500/login`, {
      method: "POST",
      body: JSON.stringify({
        // What exactly should we send?
        username: e.target.username.value,
        password: e.target.password.value,
      }),
      headers: { "Content-Type": "application/json" },
    });

    const loginRes = await res.json();
    if (loginRes.login) {
      console.log('Server accepted username and password');
      props.setLoggingIn(false)
    }
    console.log(loginRes);
  };

  return (
    <div className="logInRel">
      <form onSubmit={handleSubmit}>
        <div className="logInAbs">
          <input
            type="text"
            id="username"
            name="username"
            className="username"
            placeholder="Username"
            required
          />
          <input
            type="password"
            id="password"
            name="password"
            className="password"
            placeholder="Password"
            required
          />
          <div className="logInButtonContainer">
            <input type="submit" className="logInButton" value="Log In" />
          </div>
        </div>
      </form>
    </div>
  );
}
