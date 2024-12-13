import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const ProfileIcon = (props: any, fill: string) => (
  <Svg
    viewBox="0 0 14 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7 .042a3.958 3.958 0 100 7.916A3.958 3.958 0 007 .042zM4.292 4a2.708 2.708 0 115.416 0 2.708 2.708 0 01-5.416 0zM4.5 9.208a3.958 3.958 0 100 7.917h5a3.958 3.958 0 000-7.917h-5zm-2.708 3.959A2.708 2.708 0 014.5 10.458h5a2.708 2.708 0 110 5.417h-5a2.708 2.708 0 01-2.708-2.708z"
      fill={fill}
    />
  </Svg>
);
export default ProfileIcon;
