"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { data, status } = useSession();
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await signIn("credentials", { email, password, redirect: false });
    };
  console.log(data , status);

    return (
      <div>
        <h1>Login</h1>
        <button type="submit" onClick={() => {signIn("google")}}>Sign in</button>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button type="submit">Sign in</button>
        </form>
      </div>
    );
  }
export default LoginPage;
