import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './App.css';
import Spreads from './components/Spreads';
import Gainers from './components/Gainers';
import { useState } from 'react';
import { Button, ButtonGroup } from '@mui/material';
import BinanceSpreads from './components/BinanceSpreads';
import BinanceGainers from './components/BinanceGainers';

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
        <Button disabled={exchange === 'bybit' ? true : false} onClick={() => setExchange('bybit')}>Bybit</Button>
        <Button disabled={exchange === 'binance' ? true : false} onClick={() => setExchange('binance')}>Binance</Button>
      </ButtonGroup>
      <h1>{exchange === 'bybit' ? 'Bybit' : 'Binance'} {showSpreads ? 'spreads' : 'movers'}</h1>
      <div>
        <Button sx={{marginRight: 2, height: 56}} variant="contained" size='large' disabled={showSpreads} onClick={handleClick}>Spreads</Button>
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
        <Button sx={{marginLeft: 2, height: 56}} variant="contained" size='large' disabled={!showSpreads} onClick={handleClick}>Movers</Button>
      </div>
      <div className='box'>
        {showSpreads ? exchange === 'bybit' ? <Spreads market={market}/> : <BinanceSpreads market={market}/> : exchange === 'bybit' ? <Gainers market={market} /> : <BinanceGainers market={market}/>} 
      </div>
    </div>
  );
}

export default App;
