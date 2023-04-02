import { useEffect, useState } from 'react';
import { BybitDataFutures } from './BybitDataFutures';
import { DataGrid, GridCellParams, GridColDef, GridRowsProp, GridValidRowModel } from '@mui/x-data-grid';
import _ from 'lodash';
import { Box } from '@mui/material';
import clsx from 'clsx';

const Gainers = () => {
    const [rows, setRows] = useState<GridRowsProp>([])

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('https://api.bybit.com/v5/market/tickers?category=linear')
            const data = await response.json() as BybitDataFutures

            const rowsRaw: GridValidRowModel[] = []
            
            data.result.list.forEach((sym, index) => {
                if (sym.symbol.slice(-4) === "USDT") {
                    let volume24H = parseFloat(sym.turnover24h)
                    if (volume24H > 50000000) {
                        let gainvolume24H = parseFloat(sym.price24hPcnt)
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

        fetchData()
        const interval = setInterval(() => {
            fetchData()
        }, 50000);
        return () => clearInterval(interval);
    }, [])

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
                    negative: params.value > 0,
                    positive: params.value < 0
                })
            }
        },
        //{ field: 'col4', headerName: 'Spread x Volume', width: 150, flex: 1, sortComparator: netSpreadComparator  }
    ];

    return (
        <div style={{ height: 800, width: '100%' }}>
        <div style={{ display: 'flex', height: '100%', width: '80%', margin: 'auto'}}>
            <div style={{ flexGrow: 1 }}>
                <h4>{'Top Movers in the last 24H (Volume > 50m & Prcnt > 3%)'}</h4>
                <Box
                    sx={{
                        height: 800,
                        width: '100%',
                        '& .super-app.negative': {
                            backgroundColor: 'rgba(157, 255, 118, 0.49)',
                            color: '#1a3e72',
                        },
                        '& .super-app.positive': {
                            backgroundColor: '#d47483',
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

export default Gainers