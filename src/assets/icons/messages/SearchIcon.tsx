import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const SearchIcon = (props: any) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M6.223 3.202a.5.5 0 00-.156-.988A3.833 3.833 0 002.88 5.4a.5.5 0 00.988.157 2.833 2.833 0 012.355-2.355z"
      fill="#212121"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.333.167a6.5 6.5 0 100 13 6.5 6.5 0 000-13zm-5.5 6.5a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
      fill="#212121"
    />
    <Path
      d="M13.02 11.646a.5.5 0 00-.707.708l2.667 2.666a.5.5 0 00.707-.707l-2.667-2.667z"
      fill="#212121"
    />
  </Svg>
);
export default SearchIcon;
