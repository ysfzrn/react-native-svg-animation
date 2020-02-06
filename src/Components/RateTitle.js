import React, {useEffect} from 'react';
import {StyleSheet, Animated} from 'react-native';

export const RateTitle = ({children, value}) => {
  const animatedValue = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: 100,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      });
    });
  }, [value, animatedValue]);

  const opacityInterpolate = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  });

  const translateYInterpolate = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 0],
  });

  const animatedStyle = {
    opacity: opacityInterpolate,
    transform: [
      {
        translateX: translateYInterpolate,
      },
    ],
  };

  return (
    <Animated.Text style={[styles.textStyle, animatedStyle]}>
      {children}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 18,
  },
});
