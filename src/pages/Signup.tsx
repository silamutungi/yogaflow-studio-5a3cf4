import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studioName, setStudioName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!studioName.trim()) { setError('Please enter your studio name.'); return }
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (password.length < 8) { setError('Your password must be at least 8 characters.'); return }
    setLoading(true)
    const { error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { studio_name: studioName.trim() } }
    })
    setLoading(false)
    if (authError) { setError('We could not create your account. Please try again.'); return }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="w-full max-w-md">
        <h1 className="font-serif text-4xl font-bold mb-2 text-center" style={{ color: 'var(--color-text)' }}>Open your studio</h1>
        <p className="font-mono text-base text-center mb-8" style={{ color: 'var(--color-text-secondary)' }}>Get set up in under a minute. No credit card needed.</p>
        <form onSubmit={handleSubmit} className="rounded-xl p-8 space-y-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }} noValidate>
          {error && (
            <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 font-mono text-sm" style={{ backgroundColor: '#fef2f2', color: 'var(--color-error)', border: '1px solid var(--color-error)' }}>
              {error}
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label htmlFor="studioName" className="font-mono text-sm font-medium" style={{ color: 'var(--color-text)' }}>Studio name</label>
            <input
              id="studioName" type="text" autoComplete="organization" required
              value={studioName} onChange={(e) => setStudioName(e.target.value)}
              className="font-mono text-base rounded-lg px-4 py-3 min-h-[44px] w-full"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
              placeholder="Sunrise Yoga Studio"
            />
          </div>
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
              id="password" type="password" autoComplete="new-password" required
              value={password} onChange={(e) => setPassword(e.target.value)}
              className="font-mono text-base rounded-lg px-4 py-3 min-h-[44px] w-full"
              style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--color-accent)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--color-border)' }}
              placeholder="Minimum 8 characters"
            />
          </div>
          <button
            type="submit" disabled={loading}
            className="w-full font-mono text-base font-medium rounded-lg px-6 py-3 min-h-[44px] transition-opacity disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
          >
            {loading ? 'Creating studio...' : 'Create studio'}
          </button>
          <p className="font-mono text-sm text-center" style={{ color: 'var(--color-text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="underline" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  )
}
