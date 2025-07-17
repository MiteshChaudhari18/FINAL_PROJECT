import React, { useState } from "react";

export default function InviteButton() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (res.ok) {
      alert(`Invitation sent to ${email}`);
      setEmail("");
      setOpen(false);
    } else {
      alert(`Failed to send invite`);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        className="bg-white border border-gray-300 px-3 py-1 rounded shadow text-black hover:bg-gray-50"
        onClick={() => setOpen(!open)}
      >
        🤝 Invite People
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow p-4 z-10 w-80">
          <label className="block mb-2 font-semibold text-sm">
            Invite by Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="border px-2 py-1 w-full mb-1 rounded"
          />
          {error && (
            <p className="text-red-600 text-sm mb-2">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Send Invite
            </button>
            <button
              onClick={() => setOpen(false)}
              className="border px-3 py-1 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
