import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
const MessagingIcon = (props: any) => (
  <Svg
    viewBox="0 0 49 47"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M41.8 18.3a6.5 6.5 0 016.5 6.5v10.316a6.264 6.264 0 01-5.764 6.245v.462c0 2.181-2.598 3.316-4.198 1.835l-2.46-2.278H22a6.5 6.5 0 01-6.5-6.5V24.8a6.5 6.5 0 016.5-6.5h19.8z"
      fill="#F9FAFC"
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Path
      d="M9.6 8.1a8.5 8.5 0 00-8.5 8.5v11.297a7.243 7.243 0 006.743 7.226v1.425c0 2.185 2.607 3.319 4.205 1.827l3.467-3.235H30.8a8.5 8.5 0 008.5-8.5V16.6a8.5 8.5 0 00-8.5-8.5H9.6z"
      fill="#F9FAFC"
      stroke="#212121"
      strokeLinejoin="round"
    />
    <Circle cx={11.365} cy={21.6202} r={2.79} fill="#212121" />
    <Circle cx={20.1997} cy={21.6202} r={2.79} fill="#212121" />
    <Circle cx={29.0351} cy={21.6202} r={2.79} fill="#212121" />
    <Path
      d="M40.26 2.1a.98.98 0 00-1.961 0v3.252a.98.98 0 101.962 0V2.1zM42.387 9.792a.98.98 0 110-1.962h3.252a.98.98 0 010 1.962h-3.252z"
      fill="#F9FAFC"
      stroke="#212121"
      strokeLinejoin="round"
    />
  </Svg>
);
export default MessagingIcon;
