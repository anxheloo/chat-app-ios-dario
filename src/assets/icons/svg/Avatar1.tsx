import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar1 = (props: any) => {
  return (
    <Svg
      {...props}
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M19 14.833a4.167 4.167 0 100 8.334 4.167 4.167 0 000-8.334z"
        fill="#212121"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.25 19C.25 8.645 8.645.25 19 .25S37.75 8.645 37.75 19 29.355 37.75 19 37.75.25 29.355.25 19zm8.333 0c0-5.753 4.664-10.417 10.417-10.417S29.417 13.247 29.417 19 24.753 29.417 19 29.417 8.583 24.753 8.583 19z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar1;
