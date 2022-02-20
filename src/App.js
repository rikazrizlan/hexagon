import './App.css';
import {useState} from 'react';
import BgImg from './assets/images/bg3.jpg';
import Color from './classes/Color';
import Solver from './classes/Solver';

const App = () => {

  const [hexColor, setHexColor] = useState('');
  const [filterDetail, setFilterDetail] = useState('');
  const [lossDetail, setLossDetail] = useState('');
  const [realPixel, setRealPixel] = useState('');
  const [filterPixel, setFilterPixel] = useState('');
  const [error, setError] = useState('');

  const hexToRgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
  
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
      : null;
  }
  
  const generateFilter = () => {
        if(hexColor.length > 7 || hexColor.length < 3 || hexColor.length === 4 || hexColor.length === 5){
          setError("Invalid hex color");
          return;
        }
        const rgb = hexToRgb(hexColor);
        if (rgb.length !== 3) {
          setError('Invalid format!');
          console.log("errie");
          return;
        }
    
        const color = new Color(rgb[0], rgb[1], rgb[2]);
        const solver = new Solver(color);
        const result = solver.solve();
    
        let lossMsg;
        if (result.loss < 1) {
          lossMsg = 'This is a perfect result.';
        } else if (result.loss < 5) {
          lossMsg = 'This is close enough.';
        } else if (result.loss < 15) {
          lossMsg = 'The color is somewhat off. Consider running it again.';
        } else {
          lossMsg = 'The color is extremely off. Run it again!';
        }
    
        setRealPixel(color.toString())
        setFilterPixel(result.filter)
        setFilterDetail(result.filter)
        setLossDetail(`Loss: ${result.loss.toFixed(1)}. ${lossMsg}`)
  }

  const setValue = (e) => {
    setError('');
    setHexColor(e.target.value)
  }

  console.log(realPixel)

  return (
    <div className="app__component">
      <div className='filter__card'>
        <div className='text__container'>
            <h1 className='page__title'>Hexagon</h1>
            <p className='page__description'>Convert your assets to target hex color!</p>
        </div>
        <div className='card__center'>
          <div className='input__container'>
            <input className='filter__input' value={hexColor} onChange={(e) => setValue(e)} type="text" placeholder='#000000' />
            <input className='filter__input color__picker' value={hexColor} onChange={(e) => setValue(e)} type="color" placeholder='#000000' />
            <div className='filter__error'>{error}</div>
          </div>
          <div className='btn__container'>
              <button className='filter__button clear__button' onClick={() => setHexColor('')}>Clear</button>
              <button className='filter__button' onClick={generateFilter}>Run</button>
          </div>
        </div>
        <div className='filter__display'>
          <div style={{ backgroundColor: realPixel || "#000000" }}  className='real__pixel'>
          </div>
          <div style={{ backgroundColor: "#000000", filter: `${filterPixel}` }}  className='filter__pixel'>
          </div>
        </div>
        <div className='filter__results'>
          <div className='filter__result'>
            Output: <br/>filter: {filterDetail}
          </div>
          <div className='filter__loss'>
            {lossDetail}
          </div>
        </div>
      </div>  
    </div>
  );
}

export default App;
