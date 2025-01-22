import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const AddIcon = ({...props}: any) => (
  <Svg
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      d="M9.75 1a.75.75 0 00-1.5 0v7.25H1a.75.75 0 000 1.5h7.25V17a.75.75 0 001.5 0V9.75H17a.75.75 0 000-1.5H9.75V1z"
      fill="#212121"
    />
  </Svg>
);
export default AddIcon;
