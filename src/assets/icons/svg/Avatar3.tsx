import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

const Avatar3 = (props: any) => {
  return (
    <Svg
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19 37.75C8.645 37.75.25 29.355.25 19S8.645.25 19 .25 37.75 8.645 37.75 19 29.355 37.75 19 37.75zm-9.168-7.409A14.555 14.555 0 014.417 19c0-4.58 2.111-8.668 5.415-11.341a9.412 9.412 0 00-.207 1.966v18.75c0 .674.071 1.332.207 1.966zM28.168 7.66A14.555 14.555 0 0133.583 19c0 4.58-2.111 8.668-5.415 11.341a9.408 9.408 0 00.207-1.966V9.625c0-.674-.071-1.332-.207-1.966zM19 4.417a5.208 5.208 0 015.208 5.208v18.75a5.208 5.208 0 11-10.416 0V9.625A5.208 5.208 0 0119 4.417z"
        fill="#212121"
      />
    </Svg>
  );
};

export default Avatar3;
