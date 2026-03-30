import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setLoading(false)
    if (authError) { setError("Those credentials didn't match. Please check and try again."); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)' }}>Welcome back</h1>
        <p className="font-mono text-base text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>Sign in to your studio dashboard.</p>
        <form onSubmit={handleSubmit} className="rounded-xl p-8 space-y-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }} noValidate>
          {error && (
            <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-mono text-sm font-medium" style={{ color: 'var(--color-text)' }}>Email address</label>
            <input
              id="email" type="email" autoComplete="email" required
              value={email} onChange={(e) => setEmail(e.target.value)}
              className="font-mono text-base rounded-lg px-4 py-3 min-h-[44px] w-full"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
              placeholder="you@studio.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-mono text-sm font-medium" style={{ color: 'var(--color-text)' }}>Password</label>
            <input
              id="password" type="password" autoComplete="current-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="font-mono text-base rounded-lg px-4 py-3 min-h-[44px] w-full"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full font-mono text-base font-medium rounded-lg px-6 py-3 min-h-[44px] transition-opacity disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="font-mono text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            No account yet?{' '}
            <Link to="/signup" className="underline" style={{ color: 'var(--color-accent)' }}>Create one free</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
