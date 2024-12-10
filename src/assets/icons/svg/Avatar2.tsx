import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar2 = (props: any) => {
  return (
    <Svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M37.75 16.917c0 5.666-2.828 10.672-7.15 13.684-3.01 4.321-8.017 7.149-13.683 7.149C7.712 37.75.25 30.288.25 21.083.25 15.417 3.078 10.411 7.4 7.4 10.41 3.078 15.416.25 21.082.25c9.205 0 16.667 7.462 16.667 16.667zm-33.333 0c0-2.477.54-4.827 1.508-6.94a15.577 15.577 0 00-4.633 11.106c0 8.63 6.995 15.625 15.625 15.625 4.343 0 8.273-1.772 11.105-4.633a16.604 16.604 0 01-6.939 1.508c-9.204 0-16.666-7.462-16.666-16.666z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar2;
