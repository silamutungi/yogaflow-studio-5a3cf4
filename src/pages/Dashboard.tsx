import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { type StudioClass, type Booking, type Client } from '../types'

type Tab = 'classes' | 'bookings' | 'clients'

function formatCurrency(cents: number) {
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(cents / 100)
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))
}

export default function Dashboard() {
  const [tab, setTab] = useState<Tab>('classes')
  const [classes, setClasses] = useState<StudioClass[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showClassForm, setShowClassForm] = useState(false)
  const [classForm, setClassForm] = useState({ title: '', instructor: '', starts_at: '', duration_minutes: '60', capacity: '10', price_cents: '0', location: '', description: '' })
  const [classFormLoading, setClassFormLoading] = useState(false)
  const [classFormError, setClassFormError] = useState('')

  async function fetchData() {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const [{ data: cls }, { data: bks }, { data: cts }] = await Promise.all([
        supabase.from('studio_classes').select('*').eq('user_id', user.id).is('deleted_at', null).order('starts_at', { ascending: true }),
        supabase.from('bookings').select('*, studio_class:studio_classes(title,starts_at)').eq('user_id', user.id).is('deleted_at', null).order('created_at', { ascending: false }),
        supabase.from('clients').select('*').eq('user_id', user.id).is('deleted_at', null).order('name', { ascending: true })
      ])
      setClasses(cls ?? [])
      setBookings(bks ?? [])
      setClients(cts ?? [])
    } catch {
      setError('We could not load your studio data. Please refresh and try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  async function handleCreateClass(e: FormEvent) {
    e.preventDefault()
    setClassFormError('')
    if (!classForm.title.trim() || !classForm.starts_at || !classForm.instructor.trim()) {
      setClassFormError('Please fill in the class name, instructor, and start date.')
      return
    }
    setClassFormLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setClassFormError('Session expired. Please sign in again.'); setClassFormLoading(false); return }
    const { error: insertError } = await supabase.from('studio_classes').insert({
      user_id: user.id,
      title: classForm.title.trim(),
      instructor: classForm.instructor.trim(),
      starts_at: classForm.starts_at,
      duration_minutes: parseInt(classForm.duration_minutes) || 60,
      capacity: parseInt(classForm.capacity) || 10,
      price_cents: Math.round(parseFloat(classForm.price_cents) * 100) || 0,
      location: classForm.location.trim(),
      description: classForm.description.trim()
    })
    setClassFormLoading(false)
    if (insertError) { setClassFormError('Could not save the class. Please try again.'); return }
    setShowClassForm(false)
    setClassForm({ title: '', instructor: '', starts_at: '', duration_minutes: '60', capacity: '10', price_cents: '0', location: '', description: '' })
    fetchData()
  }

  async function handleCancelClass(id: string) {
    if (!window.confirm('Cancel this class? This cannot be undone.')) return
    await supabase.from('studio_classes').update({ deleted_at: new Date().toISOString() }).eq('id', id)
    fetchData()
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: 'classes', label: 'Classes' },
    { key: 'bookings', label: 'Bookings' },
    { key: 'clients', label: 'Clients' }
  ]

  const monthRevenue = bookings.filter(b => b.paid && new Date(b.created_at).getMonth() === new Date().getMonth()).reduce((s, b) => s + b.amount_cents, 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>Studio Dashboard</h1>
        <p className="font-mono text-base" style={{ color: 'var(--color-text-secondary)' }}>Manage your classes, bookings, and clients.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[{ label: 'Classes', value: classes.length }, { label: 'Bookings', value: bookings.length }, { label: 'Clients', value: clients.length }, { label: 'Revenue (month)', value: formatCurrency(monthRevenue) }].map(s => (
          <div key={s.label} className="rounded-xl p-6" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
            <p className="font-mono text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--color-text-secondary)' }}>{s.label}</p>
            <p className="font-serif text-3xl font-bold" style={{ color: 'var(--color-text)' }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="font-mono text-sm font-medium px-4 py-3 min-h-[44px] transition-colors"
            style={{
              color: tab === t.key ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              borderBottom: tab === t.key ? '2px solid var(--color-accent)' : '2px solid transparent'
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--color-bg-muted)' }} />)}
        </div>
      )}

      {!loading && error && (
        <div role="alert" aria-live="polite" className="rounded-xl p-6 text-center" style={{ backgroundColor: '#fef2f2', border: '1px solid var(--color-error)' }}>
          <p className="font-mono text-base mb-4" style={{ color: 'var(--color-error)' }}>{error}</p>
          <button onClick={fetchData} className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px]" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>Try again</button>
        </div>
      )}

      {!loading && !error && tab === 'classes' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--color-text)' }}>Upcoming Classes</h2>
            <button onClick={() => setShowClassForm(true)} className="font-mono text-sm font-medium px-5 py-2 rounded-lg min-h-[44px]" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>+ Add class</button>
          </div>

          {showClassForm && (
            <form onSubmit={handleCreateClass} className="rounded-xl p-8 mb-8 space-y-4" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>New class</h3>
              {classFormError && <div role="alert" aria-live="polite" className="rounded-lg px-4 py-3 font-mono text-sm" style={{ color: 'var(--color-error)', border: '1px solid var(--color-error)', backgroundColor: '#fef2f2' }}>{classFormError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[{ id: 'title', label: 'Class name', placeholder: 'Morning Vinyasa', key: 'title' }, { id: 'instructor', label: 'Instructor', placeholder: 'Jane Smith', key: 'instructor' }, { id: 'location', label: 'Location', placeholder: 'Studio A', key: 'location' }].map(f => (
                  <div key={f.id} className="flex flex-col gap-1">
                    <label htmlFor={f.id} className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>{f.label}</label>
                    <input id={f.id} type="text" placeholder={f.placeholder} value={classForm[f.key as keyof typeof classForm]} onChange={e => setClassForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2 min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} />
                  </div>
                ))}
                <div className="flex flex-col gap-1">
                  <label htmlFor="starts_at" className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>Start date & time</label>
                  <input id="starts_at" type="datetime-local" value={classForm.starts_at} onChange={e => setClassForm(prev => ({ ...prev, starts_at: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2 min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="duration" className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>Duration (minutes)</label>
                  <input id="duration" type="number" min="15" max="240" value={classForm.duration_minutes} onChange={e => setClassForm(prev => ({ ...prev, duration_minutes: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2 min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="capacity" className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>Max capacity</label>
                  <input id="capacity" type="number" min="1" value={classForm.capacity} onChange={e => setClassForm(prev => ({ ...prev, capacity: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2 min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="price" className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>Price (USD)</label>
                  <input id="price" type="number" min="0" step="0.01" value={classForm.price_cents} onChange={e => setClassForm(prev => ({ ...prev, price_cents: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2 min-h-[44px]" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none' }} />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="description" className="font-mono text-sm" style={{ color: 'var(--color-text)' }}>Description</label>
                <textarea id="description" rows={2} value={classForm.description} onChange={e => setClassForm(prev => ({ ...prev, description: e.target.value }))} className="font-mono text-base rounded-lg px-4 py-2" style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-bg)', color: 'var(--color-text)', outline: 'none', resize: 'vertical' }} placeholder="A flowing sequence to start the day..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={classFormLoading} className="font-mono text-sm font-medium px-6 py-2 rounded-lg min-h-[44px] disabled:opacity-60" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>{classFormLoading ? 'Saving...' : 'Save class'}</button>
                <button type="button" onClick={() => setShowClassForm(false)} className="font-mono text-sm px-6 py-2 rounded-lg min-h-[44px]" style={{ border: '1px solid var(--color-border)', color: 'var(--color-text)' }}>Cancel</button>
              </div>
            </form>
          )}

          {classes.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ border: '2px dashed var(--color-border)' }}>
              <div className="text-4xl mb-4">📅</div>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No classes scheduled</h3>
              <p className="font-mono text-base mb-6" style={{ color: 'var(--color-text-secondary)' }}>Add your first class to start accepting bookings.</p>
              <button onClick={() => setShowClassForm(true)} className="font-mono text-sm font-medium px-5 py-2 rounded-lg min-h-[44px]" style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}>Schedule a class</button>
            </div>
          ) : (
            <div className="space-y-4">
              {classes.map(c => (
                <div key={c.id} className="rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="font-serif text-lg font-semibold" style={{ color: 'var(--color-text)' }}>{c.title}</p>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(c.starts_at)} &middot; {c.duration_minutes}min &middot; {c.instructor}</p>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{c.location} &middot; Capacity: {c.capacity} &middot; {formatCurrency(c.price_cents)}</p>
                  </div>
                  <button onClick={() => handleCancelClass(c.id)} className="font-mono text-sm px-4 py-2 rounded-lg min-h-[44px]" style={{ border: '1px solid var(--color-error)', color: 'var(--color-error)' }}>Cancel class</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && tab === 'bookings' && (
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>All Bookings</h2>
          {bookings.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ border: '2px dashed var(--color-border)' }}>
              <div className="text-4xl mb-4">🧘</div>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No bookings yet</h3>
              <p className="font-mono text-base" style={{ color: 'var(--color-text-secondary)' }}>Once clients book your classes, they will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b.id} className="rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="font-mono text-base font-medium" style={{ color: 'var(--color-text)' }}>{b.client_name} &mdash; {b.client_email}</p>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{b.studio_class?.title ?? 'Class'} &middot; {formatDate(b.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm px-3 py-1 rounded-full" style={{ backgroundColor: b.paid ? '#dcfce7' : '#fef9c3', color: b.paid ? '#166534' : '#854d0e' }}>{b.paid ? 'Paid' : 'Unpaid'}</span>
                    <span className="font-mono text-sm px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-bg-muted)', color: 'var(--color-text-secondary)' }}>{b.status}</span>
                    <span className="font-mono text-sm font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(b.amount_cents)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && !error && tab === 'clients' && (
        <div>
          <h2 className="font-serif text-2xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>Clients</h2>
          {clients.length === 0 ? (
            <div className="rounded-xl p-12 text-center" style={{ border: '2px dashed var(--color-border)' }}>
              <div className="text-4xl mb-4">👥</div>
              <h3 className="font-serif text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>No clients yet</h3>
              <p className="font-mono text-base" style={{ color: 'var(--color-text-secondary)' }}>Clients are added automatically when they book a class.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clients.map(c => (
                <div key={c.id} className="rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3" style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}>
                  <div>
                    <p className="font-mono text-base font-medium" style={{ color: 'var(--color-text)' }}>{c.name}</p>
                    <p className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{c.email}{c.phone ? ` · ${c.phone}` : ''}</p>
                    {c.notes && <p className="font-mono text-sm italic" style={{ color: 'var(--color-text-secondary)' }}>{c.notes}</p>}
                  </div>
                  <span className="font-mono text-sm" style={{ color: 'var(--color-text-secondary)' }}>{c.total_bookings} booking{c.total_bookings !== 1 ? 's' : ''}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
