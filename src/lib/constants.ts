// Fields that are always free
export const FREE_FIELDS = [
  'name', 'sector', 'subsector', 'city', 'region',
  'country', 'legal_form',
]

// Credit cost per business for each paid field
export const FIELD_COSTS: Record<string, number> = {
  phone: 1,
  email: 1,
  address: 1,
  website: 1,
  effectif_label: 2,
  dirigeant_name: 2,
  dirigeant_phone: 4,
  dirigeant_email: 5,
  revenue_label: 5,
}

// Human-readable field labels
export const FIELD_LABELS: Record<string, string> = {
  name: 'Raison sociale',
  sector: 'Secteur',
  subsector: 'Sous-secteur',
  city: 'Ville',
  region: 'Région',
  country: 'Pays',
  legal_form: 'Forme juridique',
  phone: 'Téléphone',
  email: 'E-mail',
  website: 'Site web',
  address: 'Adresse',
  effectif_label: 'Effectif',
  dirigeant_name: 'Nom du dirigeant',
  dirigeant_phone: 'Tél. dirigeant',
  dirigeant_email: 'E-mail dirigeant',
  revenue_label: 'Chiffre d\'affaires',
}

// Fields that can be unlocked (not free)
export const PAID_FIELDS = Object.keys(FIELD_COSTS)

// Ordered list of all fields shown in results table
export const ALL_RESULT_FIELDS = [
  'phone',
  'email',
  'website',
  'address',
  'effectif_label',
  'dirigeant_name',
  'dirigeant_phone',
  'dirigeant_email',
  'revenue_label',
]

export const SECTORS = [
  'BTP & Construction',
  'Technologies de l\'information',
  'Commerce de gros',
  'Import / Export',
  'Transport & Logistique',
  'Industrie agro-alimentaire',
  'Immobilier',
  'Hôtellerie & Restauration',
  'Services financiers',
  'Santé & Pharma',
]

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan',
  'Mohammedia',
  'Salé',
  'Erfoud',
  'Ouarzazate',
]

export const REGIONS = [
  'Casablanca-Settat',
  'Rabat-Salé-Kénitra',
  'Marrakech-Safi',
  'Fès-Meknès',
  'Tanger-Tétouan-Al Hoceïma',
  'Souss-Massa',
  'Oriental',
  'Drâa-Tafilalet',
]

export const EFFECTIF_OPTIONS = [
  '1-9',
  '10-19',
  '20-49',
  '50-99',
  '100-249',
  '250-499',
  '500+',
]

export const REVENUE_OPTIONS = [
  '< 1 MDH',
  '1-5 MDH',
  '5-20 MDH',
  '20-50 MDH',
  '> 50 MDH',
]

// Max results per query
export const MAX_RESULTS = 500
