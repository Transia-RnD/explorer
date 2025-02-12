export interface IssuedCurrency {
  currency: string
  issuer: string
}

export interface IssuedCurrencyAmount extends IssuedCurrency {
  value: string
}

export type Amount = IssuedCurrencyAmount | string

export type ExplorerAmount = {
  issuer?: string
  currency: string
  amount: number
}
