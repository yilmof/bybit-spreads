import { useEffect, useState } from 'react';
import { KucoinResponse } from './KucoinDataFutures';
import { KucoinSpot } from './KucoinDataSpot';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { Box } from '@mui/material';
import clsx from 'clsx';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const KucoinGainers = ({ market, theme }: { market: String, theme: String }) => {
    const [rows, setRows] = useState<GridRowsProp>([])

    useDocumentTitle('Kucoin Movers')

    useEffect(() => {
        const fetchData = async () => {
            if(market === 'future') {
                //const response = await fetch('https://api-futures.kucoin.com/api/v1/contracts/active', {
                const response = await fetch('/.netlify/functions/node-fetch', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json() as KucoinResponse

                const rowsRaw: GridValidRowModel[] = []
                
                data.msg.data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "SDTM") {
                        let volume24H = Number(sym.turnoverOf24h)
                        if (volume24H > 50000000) {
                            let gainvolume24H = sym.priceChgPct
                            if (gainvolume24H > 0.03 || gainvolume24H < -0.03) {
                                rowsRaw.push({
                                    id: index, 
                                    col1: sym.symbol, 
                                    col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                                    col3: +(gainvolume24H*100).toFixed(2),
                                    sort: gainvolume24H
                                })
                            }
        
                        }
                        
                    }
                })

                let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])

                setRows(sortedRows)
            } else {
                //const response = await fetch('https://api.kucoin.com/api/v1/market/allTickers', {
                const response = await fetch('/.netlify/functions/node-fetch-spot', {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const data = await response.json() as KucoinSpot

                const rowsRaw: GridValidRowModel[] = []
                
                data.msg.data.ticker.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "SDTM") {
                        let volume24H = Number(sym.volValue)
                        if (volume24H > 50000000) {
                            let gainvolume24H = Number(sym.changeRate)
                            if (gainvolume24H > 0.03 || gainvolume24H < -0.03) {
                                rowsRaw.push({
                                    id: index, 
                                    col1: sym.symbol, 
                                    col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                                    col3: +(gainvolume24H*100).toFixed(2),
                                    sort: gainvolume24H
                                })
                            }
        
                        }
                        
                    }
                })

                let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])

                setRows(sortedRows)
            }
        }

        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, 50000);
        return () => clearInterval(interval);
    }, [market])

    const columns: GridColDef[] = [
        { field: 'col1', headerName: 'Symbol', width: 150, flex: 1 },
        { field: 'col2', headerName: 'Volume', width: 150, flex: 1  },
        { 
            field: 'col3', 
            headerName: '% Gain in 24H', 
            width: 150, 
            flex: 1,
            type: 'number',
            cellClassName: (params: GridCellParams<any>) => {
                return clsx('super-app', {
                    negative: params.value < 0 && params.value > -5,
                    negativeFive: params.value <= -5 && params.value > -10 ,
                    negativeTen: params.value <= -10,
                    positive: params.value > 0 && params.value < 5,
                    positiveFive: params.value >= 5 && params.value < 10,
                    positiveTen: params.value >= 10
                })
            }
        },
        //{ field: 'col4', headerName: 'Spread x Volume', width: 150, flex: 1, sortComparator: netSpreadComparator  }
    ];

    return (
        <div style={{ height: 800, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%', width: '50%', margin: 'auto'}}>
            <div style={{ flexGrow: 1 }}>
                <h4>{'Top Movers in the last 24H (Volume > 50m & Prcnt > 3%)'}</h4>
                <Box
                    sx={{
                        height: 800,
                        width: '100%',
                        '& .super-app.positive': {
                            backgroundColor: '#21b300',
                            color: '#1a3e72',
                        },
                        '& .super-app.positiveFive': {
                            backgroundColor: '#2ae600',
                            color: '#1a3e72',
                        },
                        '& .super-app.positiveTen': {
                            backgroundColor: '#44ff19',
                            color: '#1a3e72',
                        },
                        '& .super-app.negative': {
                            backgroundColor: '#ff4545',
                            color: '#1a3e72',
                        },
                        '& .super-app.negativeFive': {
                            backgroundColor: '#b33030',
                            color: '#1a3e72',
                        },
                        '& .super-app.negativeTen': {
                            backgroundColor: '#661c1c',
                            color: '#1a3e72',
                        }
                        
                    }}
                >
                    {theme === 'dark' ? <DataGrid
                        sx={{ color: '#fff' }}
                        rows={rows} 
                        columns={columns}
                        hideFooterSelectedRowCount
                        /> : 
                        <DataGrid
                        rows={rows} 
                        columns={columns}
                        hideFooterSelectedRowCount
                        />}
                </Box>
            </div>
        </div>
    </div>
    )
}

export default KucoinGainers