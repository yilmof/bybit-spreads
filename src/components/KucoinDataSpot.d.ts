export interface KucoinSpot {
    code: string
    data: Data
  }
  
  export interface Data {
    time: number
    ticker: Ticker[]
  }
  
  export interface Ticker {
    symbol: string
    symbolName: string
    buy: string
    sell: string
    changeRate: string
    changePrice?: string
    high: string
    low: string
    vol: string
    volValue: string
    last: string
    averagePrice?: string
    takerFeeRate: string
    makerFeeRate: string
    takerCoefficient: string
    makerCoefficient: string
  }