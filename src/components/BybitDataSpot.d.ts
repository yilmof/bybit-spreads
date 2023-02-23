export interface BybitDataSpot {
    retCode: number;
    retMsg:  string;
    result:  Result;
}

export interface Result {
    category: string;
    list:     List[];
}

export interface List {
    symbol:         string;
    bid1Price:      string;
    bid1Size:       string;
    ask1Price:      string;
    ask1Size:       string;
    lastPrice:      string;
    prevPrice24h:   string;
    price24hPcnt:   string;
    highPrice24h:   string;
    lowPrice24h:    string;
    turnover24h:    string;
    volume24h:      string;
    usdIndexPrice?: string;
}
