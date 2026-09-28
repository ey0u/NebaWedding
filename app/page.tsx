"use client";
import { useEffect, useState } from 'react';
import CardReveal from '@/components/wedding/CardReveal'
import { useLanguage } from '@/contexts/LanguageContext';

export default function Page() {
  const { language } = useLanguage();
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('to');
    
    let enName = 'Honored Guest';
    let amName = 'ክቡር እንግዳ';

    if (token) {
      try {
        const binString = atob(token);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
          bytes[i] = binString.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        const [en, am] = decoded.split('|');
        if (en) enName = en;
        if (am) amName = am;
      } catch (e) {
        console.error("Invalid invitation token");
      }
    }
    
    setGuestName(language === 'am' ? amName : enName);
  }, [language]);

  // Don't render until we have computed the name to avoid hydration mismatch
  if (!guestName) return null;

  return (
      <CardReveal guestName={guestName} />
  )
}
