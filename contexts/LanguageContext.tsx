"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import en from "../locales/en.json";
import am from "../locales/am.json";

export type Language = "en" | "am";
export type Dictionary = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const dictionaries = {
  en,
  am,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const value = {
    language,
    setLanguage,
    t: dictionaries[language],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
