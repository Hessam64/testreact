import { useEffect, useState } from 'react';
import Head from 'next/head';
import { supabase } from '../lib/supabaseClient';

export default function Home() {
  const [pingResponse, setPingResponse] = useState(null);
  const [pingIsLoading, setPingIsLoading] = useState(false);
  const [pingError, setPingError] = useState(null);
  const [helloName, setHelloName] = useState('');
  const [helloResponse, setHelloResponse] = useState(null);
  const [helloIsLoading, setHelloIsLoading] = useState(false);
  const [helloError, setHelloError] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [businessesIsLoading, setBusinessesIsLoading] = useState(false);
  const [businessesError, setBusinessesError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(null);
  const [authIsLoading, setAuthIsLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let ignore = false;
    supabase.auth.getSession().then(({ data }) => {
      if (!ignore) {
        setSession(data.session);
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
    });

    return () => {
      ignore = true;
      subscription.unsubscribe();
    };
  }, []);

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

  const loadBusinesses = async () => {
    if (!session?.access_token) {
      setBusinessesError('Please log in to Supabase first.');
      return;
    }

    setBusinessesIsLoading(true);
    setBusinessesError(null);

    try {
      const res = await fetch('/api/businesses', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Request failed with status ${res.status}`);
      }

      setBusinesses(data?.businesses || []);
    } catch (err) {
      setBusinessesError(err.message || 'Unknown error');
      setBusinesses([]);
    } finally {
      setBusinessesIsLoading(false);
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
            <h2>Supabase Login</h2>
            <p style={{ marginBottom: '0.5rem' }}>
              Log in with your Supabase user so the API calls include your JWT (required for RLS policies).
            </p>

            {session ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div>
                  Signed in as <strong>{session.user?.email}</strong>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={authIsLoading}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#ef4444',
                    color: 'white',
                    cursor: authIsLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {authIsLoading ? 'Signing out…' : 'Sign out'}
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleLogin}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@example.com"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc'
                  }}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ccc'
                  }}
                />
                <button
                  type="submit"
                  disabled={authIsLoading}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: '#6366f1',
                    color: 'white',
                    cursor: authIsLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {authIsLoading ? 'Signing in…' : 'Sign in'}
                </button>
              </form>
            )}
            {authError && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>{authError}</p>
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

          <div
            style={{
              border: '1px solid #eaeaea',
              borderRadius: '0.75rem',
              padding: '1rem',
              background: 'white'
            }}
          >
            <h2>Load businesses from Supabase</h2>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              Clicking below triggers Next.js → Railway → Supabase to fetch rows from the <code>Businesses</code> table.
            </p>
            <button
              onClick={loadBusinesses}
              disabled={businessesIsLoading}
              style={{
                padding: '0.75rem 1.5rem',
                fontSize: '1rem',
                cursor: businessesIsLoading ? 'not-allowed' : 'pointer',
                borderRadius: '0.5rem',
                border: 'none',
                backgroundColor: '#f97316',
                color: 'white'
              }}
            >
              {businessesIsLoading ? 'Loading…' : 'Fetch businesses'}
            </button>
            {businessesError && (
              <p style={{ color: 'red', marginTop: '0.5rem' }}>
                Error: {businessesError}
              </p>
            )}
            {businesses.length > 0 && (
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  marginTop: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}
              >
                {businesses.map((business) => (
                  <li
                    key={business.id}
                    style={{
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      padding: '0.75rem'
                    }}
                  >
                    <strong>{business.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                      Created: {new Date(business.created_at).toLocaleString()}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {business.id}</div>
                  </li>
                ))}
              </ul>
            )}
            {!businessesIsLoading && !businessesError && businesses.length === 0 && (
              <p style={{ marginTop: '0.75rem', color: '#6b7280' }}>
                No businesses loaded yet.
              </p>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setAuthError('Email and password are required');
      return;
    }

    setAuthIsLoading(true);
    setAuthError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      setAuthError(error.message);
    } else {
      setSession(data.session);
      setEmail('');
      setPassword('');
    }

    setAuthIsLoading(false);
  };

  const handleLogout = async () => {
    setAuthIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setAuthIsLoading(false);
  };
