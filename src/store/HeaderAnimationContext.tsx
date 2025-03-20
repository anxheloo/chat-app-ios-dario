import React, {createContext, useRef} from 'react';
import {Animated} from 'react-native';

export const AnimationContext = createContext<Animated.Value | null>(null);

export const AnimationProvider = ({children}: {children: React.ReactNode}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  return (
    <AnimationContext.Provider value={animatedValue}>
      {children}
    </AnimationContext.Provider>
  );
};
