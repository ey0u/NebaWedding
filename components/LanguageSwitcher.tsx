"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const toggleLang = (lang: "en" | "am") => {
    setLanguage(lang);
    setOpen(false);
  };

  return (
    <div className="fixed top-6 left-6 z-[100] flex flex-col items-start">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#170607]/80 backdrop-blur-md border border-[#8E6D34]/30 flex items-center justify-center text-[#E5CD91] shadow-lg transition-transform hover:scale-105 active:scale-95"
        aria-label="Switch Language"
      >
        <Globe size={18} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 left-0 mt-2 p-2 rounded-xl bg-[#170607]/90 backdrop-blur-xl border border-[#8E6D34]/30 shadow-2xl flex flex-col gap-1 min-w-[120px]"
          >
            <button
              onClick={() => toggleLang("en")}
              className={`px-4 py-2 text-sm text-left rounded-lg transition-colors ${
                language === "en"
                  ? "bg-[#8E6D34]/20 text-[#E5CD91] font-medium"
                  : "text-[#E5CD91]/70 hover:bg-[#8E6D34]/10 hover:text-[#E5CD91]"
              }`}
            >
              English
            </button>
            <button
              onClick={() => toggleLang("am")}
              className={`px-4 py-2 text-sm text-left rounded-lg transition-colors ${
                language === "am"
                  ? "bg-[#8E6D34]/20 text-[#E5CD91] font-medium"
                  : "text-[#E5CD91]/70 hover:bg-[#8E6D34]/10 hover:text-[#E5CD91]"
              }`}
            >
              አማርኛ
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
