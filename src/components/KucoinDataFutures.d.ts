export interface KucoinResponse {
    msg: Kucoin;
}

export interface Kucoin {
    code: string;
    data: Data[];
}

export interface Data {
    symbol:                  string;
    rootSymbol:              RootSymbol;
    type:                    Type;
    firstOpenDate:           number;
    expireDate:              number | null;
    settleDate:              number | null;
    baseCurrency:            string;
    quoteCurrency:           QuoteCurrency;
    settleCurrency:          RootSymbol;
    maxOrderQty:             number;
    maxPrice:                number;
    lotSize:                 number;
    tickSize:                number;
    indexPriceTickSize:      number;
    multiplier:              number;
    initialMargin:           number;
    maintainMargin:          number;
    maxRiskLimit:            number;
    minRiskLimit:            number;
    riskStep:                number;
    makerFeeRate:            number;
    takerFeeRate:            number;
    takerFixFee:             number;
    makerFixFee:             number;
    settlementFee:           null;
    isDeleverage:            boolean;
    isQuanto:                boolean;
    isInverse:               boolean;
    markMethod:              MarkMethod;
    fairMethod:              FairMethod | null;
    fundingBaseSymbol:       null | string;
    fundingQuoteSymbol:      FundingQuoteSymbol | null;
    fundingRateSymbol:       null | string;
    indexSymbol:             string;
    settlementSymbol:        SettlementSymbol | null;
    status:                  Status;
    fundingFeeRate:          number | null;
    predictedFundingFeeRate: number | null;
    fundingRateGranularity:  number | null;
    openInterest:            string;
    turnoverOf24h:           number;
    volumeOf24h:             number;
    markPrice:               number;
    indexPrice:              number;
    lastTradePrice:          number;
    nextFundingRateTime:     number | null;
    maxLeverage:             number;
    sourceExchanges:         SourceExchange[];
    premiumsSymbol1M:        string;
    premiumsSymbol8H:        string;
    fundingBaseSymbol1M:     null | string;
    fundingQuoteSymbol1M:    FundingQuoteSymbol1M | null;
    lowPrice:                number;
    highPrice:               number;
    priceChgPct:             number;
    priceChg:                number;
}

export type FairMethod = "FundingRate";

export type FundingQuoteSymbol = ".USDTINT8H" | ".USDINT8H" | ".USDCINT8H";

export type FundingQuoteSymbol1M = ".USDTINT" | ".USDINT" | ".USDCINT";

export type MarkMethod = "FairPrice";

export type QuoteCurrency = "USDT" | "USD" | "USDC";

export type RootSymbol = "USDT" | "XBT" | "ETH" | "DOT" | "XRP" | "USDC";

export type SettlementSymbol = "" | ".BXBT30M";

export type SourceExchange = "huobi" | "Okex" | "Binance" | "Kucoin" | "Poloniex" | "Hitbtc" | "bybit" | "Bitstamp" | "Bittrex" | "Coinbase" | "Gemini" | "Kraken" | "Liquid" | "Gateio" | "Crypto" | "Bitfinex";

export type Status = "Open";

export type Type = "FFWCSX" | "FFICSX";
