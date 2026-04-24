export type RecordRow = {
  id: string
  albumTitle: string
  artistName: string
  year: number
  genre: string
  coverImg: string | null
  vinylCondition: string
  isForTrade: boolean
  ownerUsername: string
  /** Present on trade listing payloads from GET /api/records/trades */
  tradeCommentCount?: number
}

export type TradeListingComment = {
  id: string
  recordId: string
  authorUsername: string
  body: string
  createdAt: string
}

