import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar5 = (props: any) => {
  return (
    <Svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.417.25H37.75v33.333h-4.167v4.167H.25V4.417h4.167V.25zm25 8.333h-25v25h25v-25z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar5;
