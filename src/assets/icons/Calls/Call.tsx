import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const CallIcon = (props: any) => (
  <Svg
    viewBox="0 0 39 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M5.107 17.553c0-6.907 5.6-12.506 12.506-12.506 6.906 0 12.505 5.6 12.505 12.506v13.105H5.108V17.553z"
      fill="#fff"
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Path
      d="M0 32a2.4 2.4 0 012.4-2.4h31.2a2.4 2.4 0 110 4.8H2.4A2.4 2.4 0 010 32z"
      fill="#212121"
    />
    <Path
      d="M18 38.71a4.8 4.8 0 004.8-4.8h-9.6a4.8 4.8 0 004.8 4.8z"
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Circle
      cx={17.613}
      cy={2.96318}
      r={1.56316}
      fill="#212121"
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Circle
      cx={1.73104}
      cy={3.7314}
      r={1.13143}
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Circle cx={30.0002} cy={22.4} r={7.8} fill="#fff" stroke="#212121" />
    <Path
      d="M29.1 18.5a.9.9 0 01.9-.9v0a.9.9 0 01.9.9v3.6a.9.9 0 01-.9.9v0a.9.9 0 01-.9-.9v-3.6zM29.1 26.3a.9.9 0 00.9.9v0a.9.9 0 00.9-.9v0a.9.9 0 00-.9-.9v0a.9.9 0 00-.9.9v0zM1.968 10.967l-.008.043a.868.868 0 00.678 1.013v0a.868.868 0 001.028-.688l.003-.015v-.002-.001a1.715 1.715 0 01.034-.143c.028-.109.074-.273.144-.48.14-.414.374-.995.746-1.642a9.282 9.282 0 014.214-3.84v0c.44-.204.641-.72.45-1.166l-.018-.044a.849.849 0 00-1.136-.436v0a11.041 11.041 0 00-4.999 4.563 11.12 11.12 0 00-.893 1.97 8.604 8.604 0 00-.238.842l-.003.016-.001.006v.003"
      stroke="#212121"
      strokeLinejoin="round"
    />
  </Svg>
);
export default CallIcon;
