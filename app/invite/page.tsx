"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Check, Lock } from "lucide-react";

export default function InviteGenerator() {
  const [isMounted, setIsMounted] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [passcode, setPasscode] = useState("");

  const [enName, setEnName] = useState("");
  const [amName, setAmName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Create a highly compressed, safe Base64 token
  const createToken = () => {
    if (!enName && !amName) return "";
    try {
      const combined = `${enName.trim()}|${amName.trim()}`;
      const bytes = new TextEncoder().encode(combined);
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join("");
      return btoa(binString);
    } catch {
      return "";
    }
  };

  const generatedUrl = isMounted 
    ? `${window.location.origin}/?to=${encodeURIComponent(createToken())}`
    : "";

  const handleCopy = async () => {
    if (!enName && !amName) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "N&H2026!") {
      setUnlocked(true);
    } else {
      alert("Incorrect passcode");
    }
  };

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#FBF7EF] flex flex-col items-center justify-center p-6 text-[#170607]">
        <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-[#D8B96A]/20">
          <div className="flex justify-center mb-4 text-[#8E6D34]">
            <Lock size={32} />
          </div>
          <h1 className="font-serif text-2xl mb-2 text-center text-[#3B090E]">Restricted Area</h1>
          <p className="text-center text-sm text-[#170607]/60 mb-6">
            Enter the admin passcode to access the invitation generator.
          </p>
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Passcode"
              className="w-full border border-[#D8B96A]/40 rounded-lg p-3 mb-4 focus:outline-none focus:border-[#8E6D34] bg-[#FBF7EF]/50 text-center"
            />
            <button
              type="submit"
              className="w-full bg-[#3B090E] text-[#FBF7EF] py-3 rounded-xl hover:bg-[#170607] transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7EF] flex flex-col items-center justify-center p-6 text-[#170607]">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#D8B96A]/20">
        <h1 className="font-serif text-3xl mb-2 text-center text-[#3B090E]">Create Invitation</h1>
        <p className="text-center text-sm text-[#170607]/60 mb-8">
          Generate a personalized link for your guest.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#8E6D34]">
              Guest Name (English)
            </label>
            <input
              type="text"
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              placeholder="e.g. M.R Nebiyu Yirgalem"
              className="w-full border border-[#D8B96A]/40 rounded-lg p-3 focus:outline-none focus:border-[#8E6D34] bg-[#FBF7EF]/50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-[#8E6D34]">
              የተጋባዝ ስም (አማርኛ)
            </label>
            <input
              type="text"
              value={amName}
              onChange={(e) => setAmName(e.target.value)}
              placeholder="e.g. አ/ቶ ነቢዩ ይርጋለም"
              className="w-full border border-[#D8B96A]/40 rounded-lg p-3 focus:outline-none focus:border-[#8E6D34] bg-[#FBF7EF]/50 font-serif"
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="text-xs text-center text-[#170607]/40 mb-2 truncate px-4">
            {enName || amName ? generatedUrl : "Fill in names to generate link"}
          </div>
          <button
            onClick={handleCopy}
            disabled={!enName && !amName}
            className="w-full flex items-center justify-center gap-2 bg-[#3B090E] text-[#FBF7EF] py-3 rounded-xl hover:bg-[#170607] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {copied ? <Check size={18} /> : <LinkIcon size={18} />}
            {copied ? "Link Copied!" : "Copy Invitation Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
