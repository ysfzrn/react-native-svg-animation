import React, {useState} from 'react';
import {Text, StyleSheet, SafeAreaView} from 'react-native';
import {Svg, Path, G} from 'react-native-svg';
import Slider from '@react-native-community/slider';
import Animated from 'react-native-reanimated';

const {createAnimatedComponent} = Animated;
const AnimatedPath = createAnimatedComponent(Path);

const {data} = require('./data/svgData.js');
export const App = () => {
  const [rateValue, setRateValue] = useState(0);
  const onRateChange = value => {
    setRateValue(value);
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: data[rateValue].background}]}>
      <Text>{data[rateValue].name}</Text>
      <Svg style={styles.svg} viewBox="0 0 190 300">
        <G stroke="#979797">
          <AnimatedPath
            d={data[rateValue].paths.eyeL}
            stroke="black"
            fill="#fff"
          />
          <AnimatedPath
            d={data[rateValue].paths.pupilL}
            stroke="black"
            fill="#000"
          />
          <AnimatedPath
            d={data[rateValue].paths.eyeR}
            stroke="black"
            fill="#fff"
          />
          <AnimatedPath
            d={data[rateValue].paths.pupilR}
            stroke="black"
            fill="#000"
          />
          <AnimatedPath
            d={data[rateValue].paths.mouth}
            stroke="black"
            fill="transparent"
          />
        </G>
      </Svg>
      <Slider
        style={{width: 200, height: 40, marginTop: 100}}
        minimumValue={0}
        maximumValue={2}
        step={1}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#000000"
        onValueChange={onRateChange}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    width: 190,
    height: 300,
    aspectRatio: 2 / 3,
    flexDirection: 'row',
  },
});
