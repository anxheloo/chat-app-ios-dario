import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const AvatarIcon = (props: any) => (
  <Svg
    viewBox="0 0 90 90"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d=" M45 0C20.1472 0 0 20.1472 0 45C0 69.8528 20.1472 90 45 90C69.8528 90 90 69.8528 90 45C90 20.1472 69.8528 0 45 0ZM45 75C28.4315 75 15 61.5685 15 45L75 45C75 61.5685 61.5685 75 45 75Z"
      fill="#212121"
    />
  </Svg>
);
export default AvatarIcon;
