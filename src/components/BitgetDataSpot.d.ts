export interface BitgetResponseSpot {
    msg: BitgetDataSpot;
}

export interface BitgetDataSpot {
    code:        string;
    data:        Data[];
    msg:         string;
    requestTime: string;
}

export interface Data {
    askSz:     string;
    baseVol:   string;
    bidSz:     string;
    buyOne:    string;
    change:    string;
    changeUtc: string;
    close:     string;
    high24h:   string;
    low24h:    string;
    openUtc0:  string;
    quoteVol:  string;
    sellOne:   string;
    symbol:    string;
    ts:        string;
    usdtVol:   string;
}
