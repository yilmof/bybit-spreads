import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import './App.css';
import Spreads from './components/Spreads';
import Gainers from './components/Gainers';
import { useState } from 'react';

function App() {
  const [market, setMarket] = useState(`future`)

  const handleChange = (event: SelectChangeEvent) => {
    setMarket(event.target.value)
  }

  return (
    <div className="App">
      <h1 style={{}}>Bybit spreads</h1>
      <div>
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
      </div>
      <div className='box'>
        <Spreads market={market}/>
        <Gainers />
      </div>
    </div>
  );
}

export default App;
