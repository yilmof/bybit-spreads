import { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridComparatorFn } from '@mui/x-data-grid';
import _ from 'lodash';
import { Binance, BinanceVolume } from './BinanceDataFutures';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const netSpreadComparator: GridComparatorFn<string> = (v1, v2) => {
    const v1float = parseFloat(v1.replace(/[^0-9-.]/g, ''));
    const v2float = parseFloat(v2.replace(/[^0-9-.]/g, ''));
    return v1float - v2float;
}

const BinanceSpreads = ({ market }: { market: String }) => {
    const [rows, setRows] = useState<GridRowsProp>([])
    const [updated, setUpdated] = useState(new Date(Date.now()))
    const [isUpdated, setIsUpdated] = useState(false);

    useDocumentTitle('Binance Spreads')

    useEffect(() => {
        const fetchData = async () => {
            if(market === 'future') {
                const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/bookTicker')
                const data = await response.json() as Binance[]

                const volumeResponse = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr')
                const volumeData = await volumeResponse.json() as BinanceVolume[]
    
                const rowsRaw: GridValidRowModel[] = []

                const volumeDataDict: Record<string, number> = {}
                volumeData.forEach((data) => {
                    volumeDataDict[data.symbol.trim()] = parseFloat(data.quoteVolume)
                })

                data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "USDT" && volumeDataDict.hasOwnProperty(sym.symbol.trim())) {
                        let bid = parseFloat(sym.bidPrice)
                        let ask = parseFloat(sym.askPrice)
                        let spread = ((ask - bid) / bid)*100
                        let volume24H = volumeDataDict[sym.symbol.trim()]
    
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
            } else {
                const response = await fetch('https://api.binance.com/api/v3/ticker/bookTicker')
                const data = await response.json() as Binance[]

                const volumeResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr')
                const volumeData = await volumeResponse.json() as BinanceVolume[]
    
                const rowsRaw: GridValidRowModel[] = []

                const volumeDataDict: Record<string, number> = {}
                volumeData.forEach((data) => {
                    volumeDataDict[data.symbol.trim()] = parseFloat(data.quoteVolume)
                })
    
                data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "USDT" && volumeDataDict.hasOwnProperty(sym.symbol.trim())) {
                        let bid = parseFloat(sym.bidPrice)
                        let ask = parseFloat(sym.askPrice)
                        let spread = ((ask - bid) / bid)*100
                        let volume24H = volumeDataDict[sym.symbol.trim()]

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

export default BinanceSpreads