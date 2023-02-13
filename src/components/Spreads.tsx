import { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import _ from 'lodash';

export interface BybitData {
    retCode:    number;
    retMsg:     string;
    result:     Result;
    retExtInfo: RetEXTInfo;
    time:       number;
}

export interface Result {
    category: string;
    list:     List[];
}

export interface List {
    symbol:                 string;
    lastPrice:              string;
    indexPrice:             string;
    markPrice:              string;
    prevPrice24h:           string;
    price24hPcnt:           string;
    highPrice24h:           string;
    lowPrice24h:            string;
    prevPrice1h:            string;
    openInterest:           string;
    openInterestValue:      string;
    turnover24h:            string;
    volume24h:              string;
    fundingRate:            string;
    nextFundingTime:        string;
    predictedDeliveryPrice: string;
    basisRate:              string;
    deliveryFeeRate:        string;
    deliveryTime:           string;
    ask1Size:               string;
    bid1Price:              string;
    ask1Price:              string;
    bid1Size:               string;
}

export interface RetEXTInfo {
}

export interface SymbolData {
    symbol: string
    spreadPercentage: number
    volume24H: number
}


function Spreads() {
    const [rows, setRows] = useState<GridRowsProp>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear')
            const data = await response.json() as BybitData


            const rowsRaw: GridValidRowModel[] = []

            data.result.list.forEach((sym, index) => {
                if (sym.symbol.slice(-4) === "USDT") {
                    let bid = parseFloat(sym.bid1Price)
                    let ask = parseFloat(sym.ask1Price)
                    let spread = ((ask - bid) / bid)*100

                    let volume24H = parseFloat(sym.turnover24h)

                    let netSpread = (spread/100) * volume24H

                    rowsRaw.push({
                        id: index, 
                        col1: sym.symbol, 
                        col2: +spread.toFixed(4), 
                        col3: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                        col4: netSpread.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                        sort: volume24H
                    })
                    
                }
            })

            let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])
            
            setRows(sortedRows)

        }

        fetchData()
    }, [])

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Symbol', width: 150 },
        { field: 'col2', headerName: 'Spread', width: 150 },
        { field: 'col3', headerName: 'Volume', width: 150},
        { field: 'col4', headerName: 'Spread x Volume', width: 150 }
    ];

    return (
    <div style={{ 
        height: 800, 
        width: '35%', 
        margin: 'auto' }}>
            <DataGrid 
                rows={rows} 
                columns={columns}
                hideFooterSelectedRowCount
                />
    </div>
    )
}

export default Spreads