import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const AddIcon = (props: any) => (
  <Svg
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M11.75 8a.75.75 0 00-1.5 0v2.25H8a.75.75 0 000 1.5h2.25V14a.75.75 0 001.5 0v-2.25H14a.75.75 0 000-1.5h-2.25V8z"
      fill="#212121"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 .25C5.063.25.25 5.063.25 11S5.063 21.75 11 21.75 21.75 16.937 21.75 11 16.937.25 11 .25zM1.75 11a9.25 9.25 0 1118.5 0 9.25 9.25 0 01-18.5 0z"
      fill="#212121"
    />
  </Svg>
);
export default AddIcon;
