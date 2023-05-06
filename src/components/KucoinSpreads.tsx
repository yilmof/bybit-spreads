import { useEffect, useState } from 'react'
import { DataGrid, GridRowsProp, GridColDef, GridValidRowModel, GridComparatorFn } from '@mui/x-data-grid';
import _ from 'lodash';
import { Kucoin } from './KucoinDataFutures';
import { KucoinSpot } from './KucoinDataSpot';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const KucoinSpreads = ({ market, theme }: { market: String, theme: String }) => {
    const [rows, setRows] = useState<GridRowsProp>([])
    const [updated, setUpdated] = useState(new Date(Date.now()))
    const [isUpdated, setIsUpdated] = useState(false);

    useDocumentTitle('Kucoin Spreads')

    useEffect(() => {
        const fetchData = async () => {
            if(market === 'future') {
                const response = await fetch('https://api-futures.kucoin.com/api/v1/contracts/active')
                const data = await response.json() as Kucoin

                const rowsRaw: GridValidRowModel[] = []

                data.data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "SDTM") {
                        let volume24H = Number(sym.turnoverOf24h)
    
                        rowsRaw.push({
                            id: index, 
                            col1: sym.symbol, 
                            col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                            sort: volume24H
                        })
                        
                    }
                })
    
                let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])
                
                setRows(sortedRows)
            } else {
                const response = await fetch('https://api.kucoin.com/api/v1/market/allTickers')
                const data = await response.json() as KucoinSpot
    
                const rowsRaw: GridValidRowModel[] = []
    
                data.data.ticker.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "SDTM") {
                        let volume24H = Number(sym.volValue)

                        rowsRaw.push({
                            id: index, 
                            col1: sym.symbol, 
                            col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
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
        { field: 'col2', headerName: 'Volume', width: 150, flex: 1 },
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

export default KucoinSpreads