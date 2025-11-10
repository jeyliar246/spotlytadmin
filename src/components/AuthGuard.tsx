import { FormEvent, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthGuard.css';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { user, isAdmin, isLoading, signInWithMagicLink, error } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (error && error.includes('Supabase credentials')) {
    return (
      <div className="auth-guard__state">
        <div className="auth-guard__card">
          <h2>Configuration Required</h2>
          <p>{error}</p>
          <p>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your environment (for
            example in <code>.env.local</code>) and redeploy.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="auth-guard__state">
        <div className="auth-guard__card">Checking credentials…</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    const handleSubmit = async (event: FormEvent) => {
      event.preventDefault();
      setSubmitting(true);
      setMessage(null);
      try {
        await signInWithMagicLink(email.trim());
        setMessage('Check your email for the magic link. Once you confirm, reload this page.');
      } catch (err: any) {
        setMessage(err.message || 'Unable to send magic link');
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="auth-guard__state">
        <form className="auth-guard__card" onSubmit={handleSubmit}>
          <h2>Spotlyt Admin Access</h2>
          <p>Admins only. Enter your Spotlyt admin email to receive a magic sign-in link.</p>

          <input
            type="email"
            placeholder="admin@spotlyt.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send Magic Link'}
          </button>

          {(error || message) && <div className="auth-guard__message">{message || error}</div>}
        </form>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
