import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const LockIcon = (props: any) => (
  <Svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M8.5 8.667a.5.5 0 00-1 0v2.666a.5.5 0 001 0V8.667z"
      fill="#212121"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 .833a3.833 3.833 0 00-3.833 3.834v.348l-.018.006a3.833 3.833 0 00-2.461 2.461C1.5 8.06 1.5 8.755 1.5 9.892v.216c0 1.137 0 1.832.188 2.41a3.833 3.833 0 002.46 2.461c.58.188 1.273.188 2.41.188h2.883c1.138 0 1.832 0 2.41-.188a3.833 3.833 0 002.461-2.461c.188-.578.188-1.273.188-2.41v-.216c0-1.137 0-1.832-.188-2.41a3.833 3.833 0 00-2.46-2.461l-.019-.006v-.348A3.833 3.833 0 008 .833zm-1.39 4c-.585 0-1.053 0-1.443.022v-.188a2.833 2.833 0 115.666 0v.188c-.39-.022-.858-.022-1.444-.022H6.611zm-1.86 1.07c.398-.068.935-.07 1.917-.07h2.666c.982 0 1.519.002 1.917.07.11.018.206.04.292.07.863.28 1.54.956 1.82 1.818.132.408.138.93.138 2.209 0 1.28-.006 1.801-.139 2.209a2.833 2.833 0 01-1.819 1.819c-.408.133-.929.139-2.209.139H6.667c-1.28 0-1.801-.006-2.21-.139a2.833 2.833 0 01-1.818-1.82C2.506 11.802 2.5 11.28 2.5 10c0-1.28.006-1.801.139-2.209a2.833 2.833 0 011.819-1.819c.087-.028.182-.051.292-.07z"
      fill="#212121"
    />
  </Svg>
);
export default LockIcon;
