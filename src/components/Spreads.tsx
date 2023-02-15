import { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridComparatorFn } from '@mui/x-data-grid';
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

const netSpreadComparator: GridComparatorFn<string> = (v1, v2) => {
    const v1float = parseFloat(v1.replace(/[^0-9-.]/g, ''));
    const v2float = parseFloat(v2.replace(/[^0-9-.]/g, ''));
    return v1float - v2float;
}

function Spreads() {
    const [rows, setRows] = useState<GridRowsProp>([])
    const [updated, setUpdated] = useState(new Date(Date.now()))

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
        const interval = setInterval(() => {
            fetchData()
            setUpdated(new Date(Date.now()) )
        }, 10000);
        return () => clearInterval(interval);
    }, [])

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Symbol', width: 150, flex: 1 },
        { field: 'col2', headerName: 'Spread', width: 150, flex: 1  },
        { field: 'col3', headerName: 'Volume', width: 150, flex: 1 },
        { field: 'col4', headerName: 'Spread x Volume', width: 150, flex: 1, sortComparator: netSpreadComparator  }
    ];

    return (
    // <div style={{ 
    //     height: 800, 
    //     width: '35%', 
    //     margin: 'auto' }}>
    //         <h4>Last updated: {updated.toLocaleTimeString()}</h4>
    //         <DataGrid 
    //             rows={rows} 
    //             columns={columns}
    //             hideFooterSelectedRowCount
    //             />
    // </div>
    <div style={{ height: 800, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%', width: '50%', margin: 'auto'}}>
            <div style={{ flexGrow: 1 }}>
                <h4>Last updated: {updated.toLocaleTimeString()}</h4>
                <DataGrid
                    rows={rows} 
                    columns={columns}
                    hideFooterSelectedRowCount
                    />
            </div>
        </div>
    </div>
    )
}

export default Spreads