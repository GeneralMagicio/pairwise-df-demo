export const sliderScaleFunction = (x: number, base: number) => Math.floor(Math.pow(base, Math.abs(x)));

import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { SliderMax } from './constant';
export const CustomSlider = styled(Slider, {
  shouldForwardProp: prop => prop !== 'val',
})<{ val: number }>(({ val }) => {
  const max = SliderMax;
  return ({
    'color': '#EAECF0',
    '& .MuiSlider-valueLabel': {
      color: '#000000',
      backgroundColor: '#EAECF0',
      border: '1px solid #EAECF0',
    },
    '& .MuiSlider-thumb': {
      backgroundColor: '#FFFFFF',
      border: '1.5px solid #7F56D9',
    },
    '& .MuiSlider-track': {
      background: (val > 0) ? `linear-gradient(to right, #EAECF0 0%, #EAECF0 ${max / (max + val) * 100}%, #7F56D9 ${max / (max + val) * 100}%, #7F56D9 100%)` : '#FFFFFF`',
      border: 'transparent',
    },
    '& .MuiSlider-rail': {
      background: (val > 0) ? '#EAECF0' : `linear-gradient(to right, #EAECF0 0%, #EAECF0 ${(max + val) / max * 50}%, #7F56D9 ${(max + val) / max * 50}%, #7F56D9 50%, #EAECF0 50%, #EAECF0 100%)`,
      opacity: 1,
    },
  });
});
