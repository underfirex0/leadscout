export type Business = {
  id: string
  name: string
  sector: string
  subsector: string | null
  region: string | null
  city: string
  country: string
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  postal_code: string | null
  effectif_min: number | null
  effectif_max: number | null
  effectif_label: string | null
  dirigeant_name: string | null
  dirigeant_phone: string | null
  dirigeant_email: string | null
  revenue_label: string | null
  legal_form: string | null
  created_at: string
}

export type MaskedBusiness = {
  id: string
  name: string
  sector: string
  subsector: string | null
  region: string | null
  city: string
  country: string
  legal_form: string | null
  phone: string | null
  email: string | null
  website: string | null
  address: string | null
  effectif_label: string | null
  dirigeant_name: string | null
  dirigeant_phone: string | null
  dirigeant_email: string | null
  revenue_label: string | null
  unlocked: Record<string, string>
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  credit_balance: number
  created_at: string
  updated_at: string
}

export type SearchFilters = {
  search?: string
  sector?: string
  city?: string
  region?: string
  effectif_label?: string
}

export type Query = {
  id: string
  user_id: string
  filters: SearchFilters
  fields_requested: string[]
  result_count: number
  credits_spent: number
  status: 'pending' | 'complete' | 'refunded'
  query_name: string | null
  created_at: string
}

export type CreditTransaction = {
  id: string
  user_id: string
  type: 'grant' | 'query' | 'unlock' | 'refund' | 'purchase'
  amount: number
  balance_after: number
  ref_id: string | null
  description: string | null
  created_at: string
}

export type SearchResult = {
  queryId: string
  businesses: MaskedBusiness[]
  totalCount: number
  creditsSpent: number
  newBalance: number
  fieldsRequested: string[]
  filters: SearchFilters
}

export type UnlockResponse = {
  value: string
  creditsSpent: number
  newBalance: number
  alreadyUnlocked: boolean
}

export type EstimateResult = {
  count: number
  costPerBusiness: number
  totalCost: number
  fieldsRequested: string[]
}

// ─── CRM ────────────────────────────────────────────────────
export type CRMStatus =
  | 'to_call'
  | 'in_progress'
  | 'callback'
  | 'interested'
  | 'not_interested'
  | 'converted'
  | 'archived'

export type CRMPriority = 'low' | 'normal' | 'high'

export type CallOutcome =
  | 'no_answer'
  | 'voicemail'
  | 'callback'
  | 'interested'
  | 'not_interested'

export type CRMLead = {
  id: string
  user_id: string
  business_id: string
  query_id: string | null
  status: CRMStatus
  priority: CRMPriority
  notes: string | null
  next_action_at: string | null
  last_contacted_at: string | null
  created_at: string
  updated_at: string
  // Joined
  business?: MaskedBusiness
  call_logs?: CRMCallLog[]
}

export type CRMCallLog = {
  id: string
  lead_id: string
  user_id: string
  outcome: CallOutcome
  notes: string | null
  called_at: string
}

// ─── MEETMASTER ──────────────────────────────────────────────
export type MasterRole =
  | 'DRH' | 'DAF' | 'Directeur des Achats' | 'DG / CEO'
  | 'Directeur Commercial' | 'DSI' | 'Directeur Marketing'
  | 'Directrice des Achats' | 'Directrice des RH' | 'DSI'

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
