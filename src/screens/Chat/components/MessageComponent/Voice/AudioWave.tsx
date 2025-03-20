// import React, {useEffect, useRef} from 'react';
// import {Animated, View, StyleSheet} from 'react-native';
// import Svg, {Path} from 'react-native-svg';
// import { useAppStore } from '../../../../../store';

// const AudioWave = () => {

//   const waveMetering = useAppStore(state => state.waveMetering);
//   const playing = useAppStore(state => state.playing);
//   const animatedValue = useRef(new Animated.Value(waveMetering || 0)).current;

//   useEffect(() => {
//     if (playing) {
//       Animated.timing(animatedValue, {
//         toValue: waveMetering || 0,
//         duration: 100,
//         useNativeDriver: true,
//       }).start();
//     }
//   }, [waveMetering, playing, animatedValue]);

//   return (
//     <View style={styles.waveContainer}>
//       <Svg height="50" width="100%">
//         <Path
//           d={`M 10 25 Q 50 ${25 - waveMetering * 10}, 90 25`} // Adjust wave shape dynamically
//           stroke="blue"
//           strokeWidth="2"
//           fill="none"
//         />
//       </Svg>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   waveContainer: {
//     height: 50,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

// export default AudioWave;
