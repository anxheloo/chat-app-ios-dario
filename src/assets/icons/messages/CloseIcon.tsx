import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CloseIcon = (props: any) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9.768 7.101a.5.5 0 10-.707-.707L8 7.454l-1.06-1.06a.5.5 0 00-.708.707l1.06 1.06-1.06 1.061a.5.5 0 00.707.708L8 8.869l1.062 1.06a.5.5 0 10.707-.707l-1.061-1.06 1.06-1.06z"
      fill="#212121"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 .833a7.167 7.167 0 100 14.334A7.167 7.167 0 008 .833zM1.833 8a6.167 6.167 0 1112.334 0A6.167 6.167 0 011.833 8z"
      fill="#212121"
    />
  </Svg>
);
export default CloseIcon;
