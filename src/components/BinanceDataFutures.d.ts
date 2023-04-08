export interface Binance {
    symbol:   string;
    bidPrice: string;
    bidQty:   string;
    askPrice: string;
    askQty:   string;
    time:     number;
}

export interface BinanceVolume {
    symbol:             string;
    priceChange:        string;
    priceChangePercent: string;
    weightedAvgPrice:   string;
    lastPrice:          string;
    lastQty:            string;
    openPrice:          string;
    highPrice:          string;
    lowPrice:           string;
    volume:             string;
    quoteVolume:        string;
    openTime:           number;
    closeTime:          number;
    firstId:            number;
    lastId:             number;
    count:              number;
}
