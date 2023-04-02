import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './App.css';
import Spreads from './components/Spreads';
import Gainers from './components/Gainers';
import { useState } from 'react';
import { Box, Button } from '@mui/material';

function App() {
  const [market, setMarket] = useState(`future`)
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
      <h1 style={{}}>Bybit spreads</h1>
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
        {showSpreads ? <Spreads market={market}/> : <Gainers />} 
      </div>
    </div>
  );
}

export default App;
