import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import LightModeIconButton from '@mui/icons-material/LightMode';
import DarkModeIconButton from '@mui/icons-material/DarkMode';

import './App.css';
import Spreads from './components/Spreads';
import Gainers from './components/Gainers';
import { useEffect, useState } from 'react';
import { Button, ButtonGroup, Divider, Tooltip } from '@mui/material';
import BinanceSpreads from './components/BinanceSpreads';
import BinanceGainers from './components/BinanceGainers';
import KucoinSpreads from './components/KucoinSpreads';
import KucoinGainers from './components/KucoinGainers';

const BYBIT_REF_LINK = 'https://www.bybit.com/invite?ref=9GKZZ'
const BINANCE_REF_LINK = 'https://accounts.binance.com/register?ref=10905882'
const KUCOIN_REF_LINK = 'https://www.kucoin.com/ucenter/signup?rcode=1Hxue'

function App() {
  const [market, setMarket] = useState(`future`)
  const [exchange, setExchange] = useState(`bybit`)
  const [showSpreads, setShowSpreads] = useState(true)
  const [theme, setTheme] = useState(
    localStorage.getItem('theme') || 'light'
  );

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

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
    <div className={`App ${theme}`}>
      <div className='nav'>
        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <ButtonGroup 
          variant="contained" 
          aria-label="outlined primary button group"
          sx={{marginTop: 4, marginLeft: '50px'}}
          >
            <Tooltip title="Show Bybit data">
              <Button disabled={exchange === 'bybit' ? true : false} onClick={() => setExchange('bybit')}>Bybit</Button>
            </Tooltip>
            <Tooltip title="Show Binance data">
              <Button disabled={exchange === 'binance' ? true : false} onClick={() => setExchange('binance')}>Binance</Button>
            </Tooltip>
            <Tooltip title="Show Kucoin data">
            <Button disabled={exchange === 'kucoin' ? true : false} onClick={() => setExchange('kucoin')}>Kucoin</Button>
            </Tooltip>
          </ButtonGroup>
        </div>
        {theme === 'dark' ? <LightModeIconButton style={{cursor: 'pointer'}} onClick={toggleTheme} sx={{ marginRight: '50px' }}/> : <DarkModeIconButton style={{cursor: 'pointer'}} onClick={toggleTheme} sx={{ marginRight: '50px' }}/>}
        
      </div>

      <h1>
        <Tooltip title={exchange === 'bybit' ? 'Trade on Bybit' : exchange === 'binance' ? 'Trade on Binance' : 'Trade on Kucoin'}>
         {exchange === 'bybit' ? <a className='link' href={BYBIT_REF_LINK}>Bybit</a> : exchange === 'binance' ? <a className='link' href={BINANCE_REF_LINK}>Binance</a> : <a className='link' href={KUCOIN_REF_LINK}>Kucoin</a>}
        </Tooltip>
        {showSpreads ? ' spreads' : ' movers'}
      </h1>
      <div>
        <Tooltip title="Spreads and volume">
          <Button sx={{marginRight: 2, height: 56}} variant="contained" size='large' disabled={showSpreads} onClick={handleClick}>Spreads</Button>
        </Tooltip>
        <FormControl>
          <InputLabel>Market</InputLabel>
          {theme === 'dark' ? <Select
            inputProps={{
              MenuProps: {
                  MenuListProps: {
                      sx: {
                          backgroundColor: '#333',
                          color: '#fff'
                      }
                  }
              }
            }}
            sx={{ color: '#fff' }}
            value={market}
            label="Market"
            onChange={handleChange}
          >
            <MenuItem value={'future'}>Future</MenuItem>
            <MenuItem value={'spot'}>Spot</MenuItem>
          </Select> 
          :
          <Select
            value={market}
            label="Market"
            onChange={handleChange}
          >
            <MenuItem value={'future'}>Future</MenuItem>
            <MenuItem value={'spot'}>Spot</MenuItem>
          </Select>
          }
          
        </FormControl>
        <Tooltip title="Most increase or decrease in price in the last 24 hours">
          <Button sx={{marginLeft: 2, height: 56}} variant="contained" size='large' disabled={!showSpreads} onClick={handleClick}>Movers</Button>
        </Tooltip>
      </div>
      <div className='box'>
        {(() => {
              if (showSpreads){
                if (exchange === 'bybit') {
                  return <Spreads market={market} theme={theme}/>
                } else if (exchange === 'binance') {
                  return <BinanceSpreads market={market} theme={theme}/>
                } else {
                  return <KucoinSpreads market={market} theme={theme}/>
                }
              } else {
                if (exchange === 'bybit') {
                  return <Gainers market={market} theme={theme} />
                } else if (exchange === 'binance') {
                  return <BinanceGainers market={market} theme={theme}/>
                } else {
                  return <KucoinGainers market={market} theme={theme}/>
                }
              }
        })()}
        {/* {showSpreads ? exchange === 'bybit' ? <Spreads market={market} theme={theme}/> : exchange === 'binance' ? <BinanceSpreads market={market} theme={theme}/> : <KucoinSpreads market={market} theme={theme}/> : !showSpreads ? exchange === 'bybit' ? <Gainers market={market} theme={theme} /> : <BinanceGainers market={market} theme={theme}/> : <KucoinGainers market={market} theme={theme}/>}  */}
      </div>
    </div>
  );
}

export default App;
