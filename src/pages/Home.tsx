import { useNavigate } from 'react-router-dom'

const HERO_URL = 'https://gudiuktjzynkjvtqmuvi.supabase.co/storage/v1/object/public/hero-images/af92572c-3bad-4f7b-a9f7-659048288ee3-hero.png'

const features = [
  { emoji: '📅', title: 'Class Scheduling', body: 'Create recurring or one-off classes. Set capacity, pricing, and instructor in seconds.' },
  { emoji: '👥', title: 'Client Management', body: 'Keep every client profile, booking history, and contact detail in one organised place.' },
  { emoji: '💳', title: 'Payment Tracking', body: 'Record payments per booking. See monthly revenue at a glance with no spreadsheet needed.' },
  { emoji: '🔔', title: 'Booking Confirmations', body: 'Clients receive instant confirmation. You see every booking update in real time.' },
  { emoji: '📊', title: 'Studio Analytics', body: 'Understand which classes fill fastest, who your loyal clients are, and how revenue trends.' },
  { emoji: '🧘', title: 'Staff & Instructors', body: 'Assign instructors to classes and manage your team from one simple dashboard.' }
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <>
      <title>YogaFlow Studio — Class Booking & Studio Management</title>
      <section
        style={{
          backgroundImage: `url(${HERO_URL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
        className="relative min-h-screen flex items-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 text-center">
          <h1 className="font-serif text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            Your studio, fully booked.
          </h1>
          <p className="font-mono text-xl md:text-2xl text-white/85 mb-10 max-w-2xl mx-auto" style={{ lineHeight: '1.6' }}>
            Schedule classes, manage clients, and track payments — all in one calm, focused workspace.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/signup')}
              className="font-mono text-base font-medium px-8 py-4 rounded-lg min-h-[44px] min-w-[160px] transition-transform active:scale-[0.97] hover:opacity-90"
              style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
            >
              Start free
            </button>
            <button
              onClick={() => navigate('/login')}
              className="font-mono text-base font-medium px-8 py-4 rounded-lg min-h-[44px] min-w-[160px] border-2 transition-colors hover:bg-white/10"
              style={{ borderColor: '#ffffff', color: '#ffffff' }}
            >
              Sign in
            </button>
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--color-bg)' }} className="py-20 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-4" style={{ color: 'var(--color-text)' }}>
            Everything your studio needs
          </h2>
          <p className="font-mono text-lg text-center mb-16" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Built specifically for yoga studios — not adapted from a generic booking tool.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-8"
                style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
              >
                <div className="text-4xl mb-4 text-center">{f.emoji}</div>
                <h3 className="font-serif text-xl font-semibold mb-2 text-center" style={{ color: 'var(--color-text)' }}>{f.title}</h3>
                <p className="font-mono text-base text-center" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ backgroundColor: 'var(--color-bg-muted)' }} className="py-20 md:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Ready to fill your classes?
          </h2>
          <p className="font-mono text-lg mb-10" style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
            Join studio owners who spend less time on admin and more time teaching.
          </p>
          <button
            onClick={() => navigate('/signup')}
            className="font-mono text-base font-medium px-10 py-4 rounded-lg min-h-[44px] min-w-[180px] transition-transform active:scale-[0.97] hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', color: '#ffffff' }}
          >
            Get started free
          </button>
        </div>
      </section>
    </>
  )
}
