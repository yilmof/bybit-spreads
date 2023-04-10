import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './App.css';
import Spreads from './components/Spreads';
import Gainers from './components/Gainers';
import { useState } from 'react';
import { Button, ButtonGroup, Divider, Tooltip } from '@mui/material';
import BinanceSpreads from './components/BinanceSpreads';
import BinanceGainers from './components/BinanceGainers';

const BYBIT_REF_LINK = 'https://www.bybit.com/invite?ref=9GKZZ'
const BINANCE_REF_LINK = 'https://accounts.binance.com/register?ref=10905882'

function App() {
  const [market, setMarket] = useState(`future`)
  const [exchange, setExchange] = useState(`bybit`)
  const [showSpreads, setShowSpreads] = useState(true)

  const handleChange = (event: SelectChangeEvent) => {
    setMarket(event.target.value)
  }

  const handleClick = () => {
    if (showSpreads) {
      setShowSpreads(false)
    } else {
      setShowSpreads(true)
    }
  }

  return (
    <div className="App">
      <ButtonGroup 
      variant="contained" 
      aria-label="outlined primary button group"
      sx={{marginTop: 4}}
      >
        <Tooltip title="Show Bybit data">
          <Button disabled={exchange === 'bybit' ? true : false} onClick={() => setExchange('bybit')}>Bybit</Button>
        </Tooltip>
        <Tooltip title="Show Binance data">
          <Button disabled={exchange === 'binance' ? true : false} onClick={() => setExchange('binance')}>Binance</Button>
        </Tooltip>
      </ButtonGroup>
      <h1>{exchange === 'bybit' ? <a className='link' href={BYBIT_REF_LINK}>Bybit</a> : <a className='link' href={BINANCE_REF_LINK}>Binance</a>} {showSpreads ? 'spreads' : 'movers'}</h1>
      <div>
        <Tooltip title="Spreads and volume">
          <Button sx={{marginRight: 2, height: 56}} variant="contained" size='large' disabled={showSpreads} onClick={handleClick}>Spreads</Button>
        </Tooltip>
        <FormControl>
          <InputLabel>Market</InputLabel>
          <Select
            value={market}
            label="Market"
            onChange={handleChange}
          >
            <MenuItem value={'future'}>Future</MenuItem>
            <MenuItem value={'spot'}>Spot</MenuItem>
          </Select>
        </FormControl>
        <Tooltip title="Most increase or decrease in price in the last 24 hours">
          <Button sx={{marginLeft: 2, height: 56}} variant="contained" size='large' disabled={!showSpreads} onClick={handleClick}>Movers</Button>
        </Tooltip>
      </div>
      <div className='box'>
        {showSpreads ? exchange === 'bybit' ? <Spreads market={market}/> : <BinanceSpreads market={market}/> : exchange === 'bybit' ? <Gainers market={market} /> : <BinanceGainers market={market}/>} 
      </div>
    </div>
  );
}

export default App;
