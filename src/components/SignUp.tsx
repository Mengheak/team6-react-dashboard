import { useState, type FormEvent } from 'react';
import { createUserWithEmailAndPassword, type AuthError } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useDeviceControl } from '../hooks/useDeviceControl';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { controlDevice } = useDeviceControl()

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      const actor = auth.currentUser?.email;
      await createUserWithEmailAndPassword(auth, email, password);
      controlDevice("Created new user " + email, actor as string);
      controlDevice("Has logged in as " + email, actor as string);

      setSuccess(true);
    } catch (err) {
      const authError = err as AuthError;
      const msg: Record<string, string> = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/invalid-email': 'Invalid email address.',
        'auth/weak-password': 'Password is too weak.',
      };
      setError(msg[authError.code] ?? authError.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
      : password.length < 10 || !/[^a-zA-Z0-9]/.test(password) ? 2
        : 3;
  const strengthLabel = ['', 'WEAK', 'FAIR', 'STRONG'];
  const strengthColor = ['', '#f87171', '#f59e0b', '#34d399'];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#060b14',
      backgroundImage: 'radial-gradient(ellipse at 30% 20%, #0d1f3c 0%, transparent 55%), radial-gradient(ellipse at 75% 80%, #120d2e 0%, transparent 55%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'JetBrains Mono', monospace",
      padding: '24px',
    }} className='w-full'>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        .su-input {
          width: 100%;
          background: #0a1628;
          border: 1px solid #1e293b;
          border-radius: 10px;
          padding: 12px 14px;
          color: #e2e8f0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .su-input:focus {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px #a78bfa18;
        }
        .su-input::placeholder { color: #334155; }
        .su-btn {
          width: 100%;
          padding: 13px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(135deg, #7c3aed, #a78bfa);
          color: #fff;
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.2em;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.1s, box-shadow 0.2s;
          box-shadow: 0 0 20px #a78bfa44;
          position: relative;
          overflow: hidden;
        }
        .su-btn:hover:not(:disabled) { opacity: 0.9; box-shadow: 0 0 32px #a78bfa66; transform: translateY(-1px); }
        .su-btn:active:not(:disabled) { transform: translateY(0); }
        .su-btn:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '400px' }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '36px', justifyContent: 'center' }}>
          <svg viewBox="0 0 32 32" width="32" height="32">
            <polygon points="16,2 28,9 28,23 16,30 4,23 4,9" fill="none" stroke="#a78bfa" strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 6px #a78bfaaa)' }} />
            <polygon points="16,8 22,11.5 22,20.5 16,24 10,20.5 10,11.5" fill="#a78bfa22" />
            <circle cx="16" cy="16" r="3" fill="#a78bfa" style={{ filter: 'drop-shadow(0 0 4px #a78bfa)' }} />
          </svg>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '0.15em' }}>
              ENV<span style={{ color: '#a78bfa' }}>_</span>SYS
            </div>
            <div style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.2em' }}>MONITOR v2</div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #0c1322 100%)',
          border: '1px solid #1e293b',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 0 40px #a78bfa18, inset 0 1px 0 #ffffff08',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Corner glow */}
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '160px', height: '160px', borderRadius: '0 0 0 100%',
            background: '#a78bfa', opacity: 0.04, pointerEvents: 'none',
          }} />

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.3em', marginBottom: '4px' }}>
              ACCESS CONTROL
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.01em' }}>
              CREATE<span style={{ color: '#a78bfa' }}>_</span>ACCOUNT
            </h1>
          </div>

          {success ? (
            <div style={{
              padding: '24px', borderRadius: '12px',
              background: '#34d39912', border: '1px solid #34d39933',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>✓</div>
              <div style={{ color: '#34d399', fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em' }}>
                ACCOUNT CREATED
              </div>
              <div style={{ color: '#64748b', fontSize: '11px', marginTop: '6px' }}>
                Redirecting to dashboard...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Email */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.3em' }}>
                  EMAIL_ADDRESS
                </label>
                <input
                  className="su-input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.3em' }}>
                  PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="su-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(v => !v)}
                    style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#475569', fontSize: '12px', padding: '2px',
                    }}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>

                {/* Strength bar */}
                {password.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                    <div style={{ display: 'flex', gap: '3px', flex: 1 }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          background: strength >= i ? strengthColor[strength] : '#1e293b',
                          transition: 'background 0.3s',
                          boxShadow: strength >= i ? `0 0 6px ${strengthColor[strength]}` : 'none',
                        }} />
                      ))}
                    </div>
                    <span style={{ fontSize: '9px', fontWeight: 700, color: strengthColor[strength], letterSpacing: '0.15em' }}>
                      {strengthLabel[strength]}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '9px', color: '#475569', letterSpacing: '0.3em' }}>
                  CONFIRM_PASSWORD
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    className="su-input"
                    type={showPass ? 'text' : 'password'}
                    placeholder="Repeat password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    style={{
                      borderColor: confirm && confirm !== password ? '#f8717144' : undefined,
                      paddingRight: '32px',
                    }}
                  />
                  {confirm && (
                    <span style={{
                      position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                      fontSize: '13px',
                    }}>
                      {confirm === password ? '✓' : '✕'}
                    </span>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  padding: '10px 14px', borderRadius: '8px',
                  background: '#f8717112', border: '1px solid #f8717133',
                  color: '#f87171', fontSize: '11px', letterSpacing: '0.05em',
                }}>
                  ⚠ {error}
                </div>
              )}

              {/* Submit */}
              <button className="su-btn" type="submit" disabled={loading} style={{ marginTop: '4px' }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span style={{
                      width: '12px', height: '12px', borderRadius: '50%',
                      border: '2px solid #ffffff44', borderTopColor: '#fff',
                      display: 'inline-block', animation: 'spin 0.7s linear infinite',
                    }} />
                    CREATING...
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                  </span>
                ) : 'CREATE ACCOUNT →'}
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '4px 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
                <span style={{ fontSize: '9px', color: '#334155', letterSpacing: '0.2em' }}>OR</span>
                <div style={{ flex: 1, height: '1px', background: '#1e293b' }} />
              </div>

              {/* Sign in link */}
              <p style={{ textAlign: 'center', fontSize: '11px', color: '#475569', margin: 0 }}>
                Already have an account?{' '}
                <a href="/login" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none', letterSpacing: '0.05em' }}>
                  SIGN IN
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '9px', color: '#1e293b', letterSpacing: '0.2em' }}>
          ENV_SYS · SECURE AUTH · NODE #ENV-01
        </p>
      </div>
    </div>
  );
};

export default SignUp;