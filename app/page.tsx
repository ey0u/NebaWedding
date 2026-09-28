import type { Metadata } from 'next';
import ClientPage from './ClientPage';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const params = await searchParams;
  const to = typeof params.to === 'string' ? params.to : '';
  
  return {
    openGraph: {
      images: [
        {
          url: `/api/og${to ? `?to=${to}` : ''}`,
          width: 1200,
          height: 630,
          alt: "Wedding Invitation",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/api/og${to ? `?to=${to}` : ''}`],
    }
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const params = await searchParams;
  const to = typeof params.to === 'string' ? params.to : '';
  
  let enName = 'Honored Guest';
  let amName = 'ክቡር እንግዳ';

  if (to) {
    try {
      const binString = atob(to);
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

  return <ClientPage initialEn={enName} initialAm={amName} />;
}
