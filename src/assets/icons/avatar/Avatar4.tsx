import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar4 = (props: any) => {
  return (
    <Svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.417 4.417V.25H37.75v33.333h-4.167v4.167H.25V4.417h4.167zm1.041-3.125h31.25v31.25h-3.125V4.417H5.458V1.292z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar4;
