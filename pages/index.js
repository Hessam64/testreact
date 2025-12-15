import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const apiUrl = '/api/backend-ping';

  const callApi = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const data = await res.json();
      setApiResponse(data);
    } catch (err) {
      setError(err.message || 'Unknown error');
      setApiResponse(null);
    } finally {
      setIsLoading(false);
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
          Set <code>BACKEND_API_URL</code> to your Railway endpoint so this Next.js API route can proxy the request.
        </p>
        <button
          onClick={callApi}
          disabled={isLoading}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            borderRadius: '0.5rem',
            border: 'none',
            backgroundColor: '#0070f3',
            color: 'white'
          }}
        >
          {isLoading ? 'Calling API…' : 'Call API'}
        </button>
        {error && (
          <p style={{ color: 'red' }}>
            Error: {error}
          </p>
        )}
        {apiResponse && (
          <pre
            style={{
              background: '#f5f5f5',
              padding: '1rem',
              borderRadius: '0.5rem',
              width: '100%',
              maxWidth: '600px',
              overflow: 'auto'
            }}
          >
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        )}
      </main>
    </>
  );
}
