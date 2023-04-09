import { useEffect, useState } from 'react';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { Box } from '@mui/material';
import clsx from 'clsx';
import { BinanceVolume } from './BinanceDataFutures';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const BinanceGainers = ({ market }: { market: String }) => {
    const [rows, setRows] = useState<GridRowsProp>([])

    useDocumentTitle('Binance movers')

    useEffect(() => {
        const fetchData = async () => {
            if(market === 'future') {
                const response = await fetch('https://fapi.binance.com/fapi/v1/ticker/24hr')
                const data = await response.json() as BinanceVolume[]

                const rowsRaw: GridValidRowModel[] = []
                
                data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "USDT") {
                        let volume24H = parseFloat(sym.quoteVolume)
                        if (volume24H > 50000000) {
                            let gainvolume24H = parseFloat(sym.priceChangePercent)
                            if (gainvolume24H > 3 || gainvolume24H < -3) {
                                rowsRaw.push({
                                    id: index, 
                                    col1: sym.symbol, 
                                    col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                                    col3: +gainvolume24H.toFixed(2),
                                    sort: gainvolume24H
                                })
                            }
        
                        }
                        
                    }
                })

                let sortedRows = _.orderBy(rowsRaw, ['sort'], ['desc'])

                setRows(sortedRows)
            } else {
                const response = await fetch('https://api.binance.com/api/v3/ticker/24hr')
                const data = await response.json() as BinanceVolume[]

                const rowsRaw: GridValidRowModel[] = []
                
                data.forEach((sym, index) => {
                    if (sym.symbol.slice(-4) === "USDT") {
                        let volume24H = parseFloat(sym.quoteVolume)
                        if (volume24H > 50000000) {
                            let gainvolume24H = parseFloat(sym.priceChangePercent)
                            if (gainvolume24H > 3 || gainvolume24H < -3) {
                                rowsRaw.push({
                                    id: index, 
                                    col1: sym.symbol, 
                                    col2: volume24H.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), 
                                    col3: +gainvolume24H.toFixed(2),
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
                    <DataGrid
                        rows={rows} 
                        columns={columns}
                        hideFooterSelectedRowCount
                        />
                </Box>
            </div>
        </div>
    </div>
    )
}

export default BinanceGainers