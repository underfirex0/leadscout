// ─── MEETMASTER ──────────────────────────────────────────────
export type Master = {
  id: string
  user_id: string | null
  full_name: string
  display_name: string
  role: string
  company_name: string | null
  show_company: boolean
  company_sector: string | null
  company_size: string | null
  city: string | null
  bio: string | null
  expertise: string[]
  topics: string[]
  linkedin_url: string | null
  price_per_meeting: number
  payout_per_meeting: number
  max_meetings_per_month: number
  meetings_completed: number
  average_rating: number | null
  is_verified: boolean
  is_active: boolean
  application_status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export type MeetingStatus =
  | 'pending' | 'accepted' | 'completed'
  | 'cancelled_buyer' | 'cancelled_master' | 'rejected'

export type MeetingRequest = {
  id: string
  buyer_id: string
  master_id: string
  status: MeetingStatus
  topic: string
  context: string | null
  buyer_company: string | null
  buyer_role: string | null
  preferred_date_1: string | null
  preferred_date_2: string | null
  preferred_date_3: string | null
  confirmed_date: string | null
  meeting_link: string | null
  duration_minutes: number
  amount_buyer: number
  amount_master: number
  payment_status: 'pending' | 'invoiced' | 'paid' | 'payout_sent'
  rejection_reason: string | null
  buyer_feedback: string | null
  buyer_rating: number | null
  master_feedback: string | null
  master_rating: number | null
  created_at: string
  updated_at: string
  master?: Master
  buyer_profile?: Profile
}
