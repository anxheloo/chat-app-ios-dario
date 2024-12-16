import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const MicrophoneIcon = (props: any) => (
  <Svg
    viewBox="0 0 18 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 .25A4.75 4.75 0 004.25 5v4a4.75 4.75 0 109.5 0V5A4.75 4.75 0 009 .25zM5.75 5a3.25 3.25 0 116.5 0v4a3.25 3.25 0 01-6.5 0V5z"
      fill="#212121"
    />
    <Path
      d="M1.75 9a.75.75 0 00-1.5 0 8.75 8.75 0 008 8.718v2.235a5.74 5.74 0 00-.645.123l-.787.196a.75.75 0 00.364 1.456l.787-.197a4.25 4.25 0 012.062 0l.787.197a.75.75 0 00.364-1.456l-.787-.196a5.74 5.74 0 00-.645-.123v-2.235a8.75 8.75 0 008-8.718.75.75 0 00-1.5 0 7.25 7.25 0 11-14.5 0z"
      fill="#212121"
    />
  </Svg>
);
export default MicrophoneIcon;
