import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [pingResponse, setPingResponse] = useState(null);
  const [pingIsLoading, setPingIsLoading] = useState(false);
  const [pingError, setPingError] = useState(null);
  const [helloName, setHelloName] = useState('');
  const [helloResponse, setHelloResponse] = useState(null);
  const [helloIsLoading, setHelloIsLoading] = useState(false);
  const [helloError, setHelloError] = useState(null);

  const callPing = async () => {
    setPingIsLoading(true);
    setPingError(null);

    try {
      const res = await fetch('/api/backend-ping');

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setPingResponse(data);
    } catch (err) {
      setPingError(err.message || 'Unknown error');
      setPingResponse(null);
    } finally {
      setPingIsLoading(false);
    }
  };

  const callHello = async () => {
    if (!helloName.trim()) {
      setHelloError('Please enter a name');
      return;
    }

    setHelloIsLoading(true);
    setHelloError(null);

    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: helloName })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      setHelloResponse(data);
    } catch (err) {
      setHelloError(err.message || 'Unknown error');
      setHelloResponse(null);
    } finally {
      setHelloIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Bizyaab CORS Tester</title>
      </Head>
      <main style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        gap: '1rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      }}>
        <h1>Next.js + Railway API CORS test</h1>
        <p>
          Set <code>BACKEND_API_BASE_URL</code> (or the legacy <code>BACKEND_API_URL</code>) so these server routes know how to reach your Railway backend.
        </p>

        <section
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            width: '100%',
            maxWidth: '600px'
          }}
        >
          <div
            style={{
              border: '1px solid #eaeaea',
              borderRadius: '0.75rem',
              padding: '1rem',
              background: 'white'
            }}
          >
            <h2>Ping the backend</h2>
            <button
              onClick={callPing}
              disabled={pingIsLoading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: pingIsLoading ? 'not-allowed' : 'pointer',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#0070f3',
                color: 'white'
              }}
            >
              {pingIsLoading ? 'Calling API…' : 'Call /api/ping'}
            </button>
            {pingError && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>
                Error: {pingError}
              </p>
            )}
            {pingResponse && (
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  width: '100%',
                  overflow: 'auto',
                  marginTop: '0.75rem'
                }}
              >
                {JSON.stringify(pingResponse, null, 2)}
              </pre>
            )}
          </div>

          <div
            style={{
              border: '1px solid #eaeaea',
              borderRadius: '0.75rem',
              padding: '1rem',
              background: 'white'
            }}
          >
            <h2>Personalized hello</h2>
            <p style={{ margin: '0 0 0.5rem 0' }}>Type a name, Next.js will hit <code>/api/hello</code>, and the backend will greet you.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={helloName}
                onChange={(event) => setHelloName(event.target.value)}
                placeholder="Jane Doe"
                style={{
                  flex: '1 1 200px',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #ccc',
                  fontSize: '1rem'
                }}
              />
              <button
                onClick={callHello}
                disabled={helloIsLoading}
                style={{
                  padding: '0.75rem 1.25rem',
                  fontSize: '1rem',
                  cursor: helloIsLoading ? 'not-allowed' : 'pointer',
                  borderRadius: '0.5rem',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: 'white'
                }}
              >
                {helloIsLoading ? 'Sending…' : 'Send name'}
              </button>
            </div>
            {helloError && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>
                Error: {helloError}
              </p>
            )}
            {helloResponse && (
              <pre
                style={{
                  background: '#f5f5f5',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  width: '100%',
                  overflow: 'auto',
                  marginTop: '0.75rem'
                }}
              >
                {JSON.stringify(helloResponse, null, 2)}
              </pre>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
