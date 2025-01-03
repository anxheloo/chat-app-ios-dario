import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CameraIcon = (props: any) => (
  <Svg
    viewBox="0 0 22 23"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11 8.25a4.75 4.75 0 100 9.5 4.75 4.75 0 000-9.5zM7.75 13a3.25 3.25 0 116.5 0 3.25 3.25 0 01-6.5 0z"
      fill={props.fill ? props.fill : '#212121'}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.65 2.241a5.494 5.494 0 00-7.3 0l-.216.192a3.235 3.235 0 01-2.15.817A4.735 4.735 0 00.25 7.985v5.06c0 1.837 0 3.276.124 4.418.126 1.166.388 2.11.974 2.917a5.75 5.75 0 001.272 1.272c.807.586 1.75.848 2.916.974 1.143.124 2.582.124 4.419.124h2.09c1.837 0 3.276 0 4.418-.124 1.166-.126 2.11-.388 2.917-.974a5.75 5.75 0 001.272-1.272c.586-.807.848-1.751.974-2.916.124-1.143.124-2.582.124-4.419v-5.06a4.735 4.735 0 00-4.735-4.735c-.792 0-1.557-.29-2.15-.817l-.215-.192zM8.346 3.362a3.994 3.994 0 015.308 0l.215.192a4.735 4.735 0 003.146 1.196 3.235 3.235 0 013.235 3.235V13c0 1.892-.001 3.25-.115 4.302-.113 1.038-.328 1.688-.697 2.196a4.25 4.25 0 01-.94.94c-.508.37-1.158.585-2.196.697-1.052.114-2.41.115-4.302.115h-2c-1.892 0-3.25-.001-4.302-.115-1.038-.113-1.688-.328-2.196-.697a4.252 4.252 0 01-.94-.94c-.37-.508-.585-1.158-.697-2.196-.114-1.052-.115-2.41-.115-4.302V7.985A3.235 3.235 0 014.985 4.75c1.16 0 2.279-.426 3.146-1.196l.215-.192z"
      fill={props.fill ? props.fill : '#212121'}
    />
    <Path
      d="M16 8a1 1 0 102 0 1 1 0 00-2 0z"
      fill={props.fill ? props.fill : '#212121'}
    />
  </Svg>
);
export default CameraIcon;
