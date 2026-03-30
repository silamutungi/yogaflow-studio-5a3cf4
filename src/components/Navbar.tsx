import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { type User } from '@supabase/supabase-js'

export default function Navbar() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <nav className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#0e0d0b', borderBottom: '1px solid #2a2925' }}>
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between" style={{ minHeight: '64px' }}>
        <Link to="/" className="font-serif text-xl font-bold" style={{ color: '#f2efe8', textDecoration: 'none' }}>YogaFlow</Link>
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link to="/dashboard" className="font-mono text-sm" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Dashboard</Link>
              <span className="font-mono text-sm" style={{ color: '#7a7870' }}>{user.email}</span>
              <button onClick={handleLogout} className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px]" style={{ border: '1px solid #3a3830', color: '#c8c4bc' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Sign in</Link>
              <Link to="/signup" className="font-mono text-sm font-medium px-4 py-2 rounded-lg min-h-[44px] inline-flex items-center" style={{ backgroundColor: '#8ab88f', color: '#0e0d0b', textDecoration: 'none' }}>Get started</Link>
            </>
          )}
        </div>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 min-h-[44px] min-w-[44px] items-center justify-center"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{ color: '#c8c4bc' }}
        >
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-4" style={{ backgroundColor: '#0e0d0b' }}>
          {user ? (
            <>
              <Link to="/dashboard" className="font-mono text-sm py-2" style={{ color: '#c8c4bc', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="font-mono text-sm text-left py-2 min-h-[44px]" style={{ color: '#c8c4bc' }}>Sign out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="font-mono text-sm py-2" style={{ color: '#c8c4bc', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/signup" className="font-mono text-sm py-2" style={{ color: '#8ab88f', textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
