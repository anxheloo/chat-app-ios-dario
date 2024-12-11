import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar6 = (props: any) => {
  return (
    <Svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17 .25l16.667 9.375v18.75L17 37.75.333 28.375V9.625L17 .25zm-2.083 5.983L4.61 12.031v13.938l10.307 5.798V6.233zm4.166 25.534l10.307-5.798V12.031L19.083 6.233v25.534z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar6;
