export interface BitgetResponse {
    msg: BitgetDataFutures;
}

export interface BitgetDataFutures {
    code:        string;
    data:        Data[];
    msg:         string;
    requestTime: string;
}

export interface Data {
    askSz:              string;
    baseVolume:         string;
    bestAsk:            string;
    bestBid:            string;
    bidSz:              string;
    chgUtc:             string;
    fundingRate:        string;
    high24h:            string;
    holdingAmount:      string;
    indexPrice:         string;
    last:               string;
    low24h:             string;
    openUtc:            string;
    priceChangePercent: string;
    quoteVolume:        string;
    symbol:             string;
    timestamp:          string;
    usdtVolume:         string;
}
