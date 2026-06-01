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
  // Per-business unlocked fields (à la carte)
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
