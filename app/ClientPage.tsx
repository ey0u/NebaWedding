"use client";
import { useState, useEffect } from 'react';
import CardReveal from '@/components/wedding/CardReveal'
import { useLanguage } from '@/contexts/LanguageContext';

export default function ClientPage({ initialEn, initialAm }: { initialEn: string, initialAm: string }) {
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <CardReveal guestName={language === 'am' ? initialAm : initialEn} />;
}
