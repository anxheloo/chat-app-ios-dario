import * as React from 'react';
import Svg, {ClipPath, Defs, G, Path} from 'react-native-svg';
const ClockIcon = (props: any) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <G clipPath="url(#clip0_48_10536)" fill="#212121">
      <Path d="M3.979 1.224a.5.5 0 10-.625-.781L1.688 1.776a.5.5 0 10.624.781L3.98 1.224zM12.646.443a.5.5 0 00-.625.78l1.667 1.334a.5.5 0 00.624-.78L12.646.442zM8.5 5.333a.5.5 0 00-1 0v2.334a1.5 1.5 0 001.5 1.5h1a.5.5 0 100-1H9a.5.5 0 01-.5-.5V5.333z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 .833a7.167 7.167 0 100 14.334A7.167 7.167 0 008 .833zM1.833 8a6.167 6.167 0 1112.334 0A6.167 6.167 0 011.833 8z"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_48_10536">
        <Path fill="#fff" d="M0 0H16V16H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);
export default ClockIcon;
