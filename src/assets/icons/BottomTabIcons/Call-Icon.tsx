import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
const CallIcon = (props: any, fill: string) => (
  <Svg
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.76 1.48a2.292 2.292 0 00-3.225.12l-.748.748a3.113 3.113 0 00-.838 2.877 15.553 15.553 0 0011.809 11.808 3.113 3.113 0 002.876-.837l.748-.748a2.292 2.292 0 00.121-3.225c-.033-.036-.071-.075-.12-.124l-1.225-1.225a2.924 2.924 0 00-3.236-.613 1.674 1.674 0 01-1.853-.35L8.072 7.913a1.674 1.674 0 01-.35-1.852 2.924 2.924 0 00-.614-3.236L5.884 1.6c-.05-.05-.088-.088-.124-.12zm-2.255.92a1.042 1.042 0 011.41 0l.094.094 1.215 1.215c.487.486.626 1.221.351 1.852a2.924 2.924 0 00.613 3.236l1.997 1.997a2.924 2.924 0 003.236.613 1.674 1.674 0 011.853.351l1.215 1.215.094.095a1.042 1.042 0 010 1.41c-.013.014-.03.032-.094.095l-.739.739c-.45.45-1.1.64-1.721.501a14.303 14.303 0 01-10.86-10.86 1.863 1.863 0 01.502-1.72l.738-.74.096-.093z"
      fill={fill}
    />
    <Path
      d="M10.92 3.363h.1a3.542 3.542 0 013.492 3.617v.472a.625.625 0 001.25 0v-.478-.138a4.792 4.792 0 00-4.723-4.723h-.616a.625.625 0 100 1.25h.496z"
      fill={fill}
    />
  </Svg>
);
export default CallIcon;
