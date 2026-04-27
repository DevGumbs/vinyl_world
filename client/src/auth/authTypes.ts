export type AuthUser = {
  id: string
  email: string
  username: string
  city: string
  state: string
  /** Custom display name; null means use default "{username}'s collection" */
  collectionName?: string | null
}

