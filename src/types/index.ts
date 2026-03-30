export interface StudioClass {
  id: string
  user_id: string
  title: string
  description: string
  instructor: string
  starts_at: string
  duration_minutes: number
  capacity: number
  price_cents: number
  location: string
  created_at: string
  deleted_at: string | null
}

export interface Booking {
  id: string
  user_id: string
  class_id: string
  client_name: string
  client_email: string
  status: 'confirmed' | 'cancelled' | 'waitlist'
  paid: boolean
  amount_cents: number
  created_at: string
  deleted_at: string | null
  studio_class?: StudioClass
}

export interface Client {
  id: string
  user_id: string
  name: string
  email: string
  phone: string
  notes: string
  total_bookings: number
  created_at: string
  deleted_at: string | null
}

export interface DashboardStats {
  totalClasses: number
  totalBookings: number
  totalClients: number
  revenueThisMonth: number
}
