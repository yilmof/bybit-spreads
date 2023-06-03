import { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridComparatorFn } from '@mui/x-data-grid';
import _ from 'lodash';
import { BitgetResponse } from './BitgetDataFutures';
import { BitgetResponseSpot } from './BitgetDataSpot';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const netSpreadComparator: GridComparatorFn<string> = (v1, v2) => {
    const v1float = parseFloat(v1.replace(/[^0-9-.]/g, ''));
    const v2float = parseFloat(v2.replace(/[^0-9-.]/g, ''));
    return v1float - v2float;
}

const BitgetSpreads = ({ market, theme }: { market: String, theme: String }) => {
    const [rows, setRows] = useState<GridRowsProp>([])
    const [updated, setUpdated] = useState(new Date(Date.now()))
    const [isUpdated, setIsUpdated] = useState(false);

    useDocumentTitle('Bitget Spreads')

    useEffect(() => {
        const fetchData = async () => {
            if(market === 'future') {
                //const response = await fetch('https://api.bitget.com/api/mix/v1/market/tickers?productType=umcbl')
                const response = await fetch('/.netlify/functions/fetch-bitget-futures', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json() as BitgetResponse

                const rowsRaw: GridValidRowModel[] = []

                data.msg.data.forEach((sym, index) => {
                    let bid = parseFloat(sym.bestBid)
                    let ask = parseFloat(sym.bestAsk)
                    let spread = ((ask - bid) / bid)*100
                    let volume24H = parseFloat(sym.usdtVolume)

                    let netSpread = (spread/100) * volume24H

                    let symbol = sym.symbol.split("_")

                    rowsRaw.push({
                        id: index, 
                        col1: symbol[0],
                        col2: +spread.toFixed(4),
                        col3: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                        col4: netSpread.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                        sort: volume24H
                    })
                    
                }
                )
    
                let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])
                
                setRows(sortedRows)
            } else {
                //const response = await fetch('https://api.bitget.com/api/spot/v1/market/tickers')
                const response = await fetch('/.netlify/functions/fetch-bitget-spot', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json() as BitgetResponseSpot
    
                const rowsRaw: GridValidRowModel[] = []
    
                data.msg.data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "USDT") {
                        let bid = parseFloat(sym.buyOne)
                        let ask = parseFloat(sym.sellOne)
                        let spread = ((ask - bid) / bid)*100
                        let volume24H = parseFloat(sym.usdtVol)

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
                
                console.log(`rows length: ${sortedRows.length}`)

                setRows(sortedRows)
            }
        }

        fetchData()
        const interval = setInterval(() => {
            fetchData()
            setUpdated(new Date(Date.now()))
            setIsUpdated(true);
            setTimeout(() => {
                setIsUpdated(false);
            }, 2000);
        }, 10000);
        return () => clearInterval(interval);
    }, [market])

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Symbol', width: 150, flex: 1 },
        { field: 'col2', headerName: 'Spread', width: 150, flex: 1  },
        { field: 'col3', headerName: 'Volume', width: 150, flex: 1 },
        { field: 'col4', headerName: 'Spread x Volume', width: 150, flex: 1, sortComparator: netSpreadComparator  }
    ];

    return (
    <div style={{ height: 800, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%', width: '50%', margin: 'auto'}}>
            <div style={{ flexGrow: 1 }}>
                <h4>Last updated: <span style={{
                    display: 'inline-block',
                    backgroundColor: isUpdated ? 'silver' : 'transparent',
                    transition: 'background-color 2s ease'
                }}>{updated.toLocaleTimeString()}</span></h4>
                {theme === 'dark' ? <DataGrid
                    sx={{ color: '#fff'}}
                    rows={rows} 
                    columns={columns}
                    hideFooterSelectedRowCount
                    /> : <DataGrid
                    rows={rows} 
                    columns={columns}
                    hideFooterSelectedRowCount
                    />}
            </div>
        </div>
    </div>
    )
}

export default BitgetSpreads