import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ backgroundColor: '#0e0d0b', borderTop: '1px solid #2a2925' }}>
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-mono text-sm" style={{ color: '#7a7870' }}>
          &copy; {year} YogaFlow Studio. All rights reserved.
        </p>
        <nav className="flex items-center gap-6" aria-label="Footer navigation">
          <Link to="/privacy" className="font-mono text-sm" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link to="/terms" className="font-mono text-sm" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="mailto:hello@yogaflow.studio" className="font-mono text-sm" style={{ color: '#c8c4bc', textDecoration: 'none' }}>Contact</a>
        </nav>
      </div>
    </footer>
  )
}
