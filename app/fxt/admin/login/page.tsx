"use client"; // 👈 Add this at the very top

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👈 Use "next/navigation" in App Router
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase"; // Adjust path as needed

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter(); // ✅ Now it works inside a client component

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user) {
        setError("Invalid login credentials.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        setError("User not found in Firestore.");
        return;
      }

      const userData = userDocSnap.data();
      if (userData.admin === true) {
        router.push("/fxt/admin/dashboard"); // ✅ Redirect to the admin dashboard
      } else {
        setError("Access denied. You are not an admin.");
      }
    } catch  {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-white text-2xl mb-4 text-center">Admin Login</h2>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <form onSubmit={handleLogin} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            className="p-3 my-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="p-3 my-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded mt-2"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
