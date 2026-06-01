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