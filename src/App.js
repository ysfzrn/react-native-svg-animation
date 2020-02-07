import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, Animated, Easing} from 'react-native';
import {Svg, Path, G} from 'react-native-svg';
import {Slider} from './Components/Slider';
import {RateTitle} from './Components/RateTitle';

const {data} = require('./data/svgData.js');
const inputRange = [0, 100, 200];

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const animatedRateValue = new Animated.Value(100);
const vibrationAnimatedValue = new Animated.Value(100);

export const App = () => {
  const [rateValue, setRateValue] = useState(1);

  useEffect(() => {
    const startVibration = () => {
      Animated.sequence([
        Animated.timing(vibrationAnimatedValue, {
          toValue: 0,
          duration: 150,
          easing: Easing.inOut(Easing.bezier(0.36, 0.07, 0.19, 0.97)),
          useNativeDriver: true,
        }),
        Animated.timing(vibrationAnimatedValue, {
          toValue: 100,
          duration: 150,
          easing: Easing.inOut(Easing.bezier(0.36, 0.07, 0.19, 0.97)),
          useNativeDriver: true,
        }),
      ]).start();
    };
    animatedRateValue.addListener(({value}) => {
      if (value < 40) {
        startVibration();
      }
    });
    return () => {
      animatedRateValue.removeAllListeners();
    };
  }, []);

  const handleSliderChange = (pan, rate) => {
    setRateValue(Math.floor(rate));
    animatedRateValue.setValue(pan);
  };

  const backgroundStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.background),
  });

  const eyeLStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.paths.eyeL),
  });

  const pupilLStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.paths.pupilL),
  });

  const eyeRStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.paths.eyeR),
  });

  const pupilRStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.paths.pupilR),
  });

  const mouthStyle = animatedRateValue.interpolate({
    inputRange,
    outputRange: data.map(item => item.paths.mouth),
  });

  const translatePupilStyle = animatedRateValue.interpolate({
    inputRange: [0, 20, 100, 180, 200],
    outputRange: [-0, -10, 0, 10, 0],
  });

  const vibrationInterpolate = vibrationAnimatedValue.interpolate({
    inputRange: [0, 25, 50, 100],
    outputRange: [0, -10, 0, 10],
  });

  const animtedPupilStyle = {
    transform: [
      {translateX: translatePupilStyle},
      {translateY: translatePupilStyle},
    ],
  };

  const vibrationStyle = {
    transform: [
      {translateX: vibrationInterpolate},
      {translateY: vibrationInterpolate},
    ],
  };

  const {name = 'Ok'} = data[rateValue] || {};
  return (
    <Animated.View
      style={[styles.container, {backgroundColor: backgroundStyle}]}>
      <Text style={styles.question}>{'How was \n your ride ?'}</Text>
      <RateTitle value={rateValue}>{name}</RateTitle>
      <AnimatedSvg style={[styles.svg, vibrationStyle]} viewBox="0 0 200 200">
        <G stroke="#979797">
          <AnimatedPath d={eyeLStyle} stroke="black" fill="#fff" />
          <AnimatedPath
            d={pupilLStyle}
            style={animtedPupilStyle}
            stroke="black"
            fill="#000"
          />
          <AnimatedPath d={eyeRStyle} stroke="black" fill="#fff" />
          <AnimatedPath
            d={pupilRStyle}
            style={animtedPupilStyle}
            stroke="black"
            fill="#000"
          />
          <AnimatedPath d={mouthStyle} stroke="black" fill="transparent" />
        </G>
      </AnimatedSvg>

      <Slider
        value={rateValue}
        maximumValue={2}
        onValueChange={handleSliderChange}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    height: 300,
    aspectRatio: 1,
    flexDirection: 'row',
  },
  question: {
    fontSize: 32,
    marginVertical: 24,
    textAlign: 'center',
  },
});
