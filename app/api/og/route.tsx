import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get('to');
    
    let enName = 'Honored Guest';
    if (to) {
      try {
        const binString = atob(to);
        const bytes = new Uint8Array(binString.length);
        for (let i = 0; i < binString.length; i++) {
          bytes[i] = binString.charCodeAt(i);
        }
        const decoded = new TextDecoder().decode(bytes);
        const [en] = decoded.split('|');
        if (en) enName = en;
      } catch (e) {
        // ignore decoding errors
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#170607',
            position: 'relative',
          }}
        >
          {/* Background image or pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.15,
            }}
          >
             <img src={new URL('/images/ornament-branch.png', req.url).toString()} style={{ width: 800, height: 800, objectFit: 'contain' }} />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FBF7EF',
              padding: '60px 80px',
              borderRadius: '24px',
              border: '2px solid #8E6D34',
              boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
              zIndex: 10,
              width: '80%',
              maxWidth: '900px',
            }}
          >
            <div style={{ display: 'flex', color: '#8E6D34', fontSize: '24px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '20px' }}>
              The Wedding Of
            </div>
            
            <div style={{ display: 'flex', color: '#170607', fontSize: '72px', fontWeight: 'bold', fontFamily: 'serif', marginBottom: '10px' }}>
              Nebiyu & Hewan
            </div>
            
            <div style={{ display: 'flex', width: '80px', height: '2px', backgroundColor: '#D8B96A', margin: '30px 0' }} />
            
            <div style={{ display: 'flex', color: '#5c4722', fontSize: '28px', marginBottom: '16px' }}>
              Specially invited:
            </div>
            
            <div style={{ display: 'flex', color: '#170607', fontSize: '56px', fontWeight: 'bold', fontStyle: 'italic', fontFamily: 'serif' }}>
              {enName}
            </div>
          </div>
          
          {/* A wax seal element to make it look like an envelope */}
          <div
            style={{
              position: 'absolute',
              bottom: '10%',
              right: '10%',
              display: 'flex',
              zIndex: 20,
            }}
          >
            <img src={new URL('/images/wax-seal.png', req.url).toString()} style={{ width: 180, height: 180 }} />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
