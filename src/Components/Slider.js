import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

export class Slider extends PureComponent {
  constructor(props) {
    super(props);
    const {value, width, maximumValue, circleRadius} = props;
    this._touchX = new Animated.Value((value * width) / 2 + circleRadius);
    this._onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            x: this._touchX,
          },
        },
      ],
      {useNativeDriver: true},
    );
    this._touchX.addListener(({value: currentValue}) => {
      const panValue =
        currentValue >= width ? width : currentValue <= 0 ? 0 : currentValue;
      const rateValue = (panValue * maximumValue) / width;
      props.onValueChange && props.onValueChange(panValue, rateValue);
    });
  }

  componentWillUnmount() {
    this._touchX.removeAllListeners();
  }

  _onTapHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this._touchX, {
        toValue: nativeEvent.x,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    }
  };

  render() {
    const {width, circleRadius, cursorBorderWidth} = this.props;

    const transX = this._touchX.interpolate({
      inputRange: [-1, 0, width, width + 1],
      outputRange: [
        -circleRadius,
        -circleRadius,
        width - circleRadius,
        width - circleRadius,
      ],
      extrapolate: 'clamp',
    });

    const tapRef = React.createRef();
    const panRef = React.createRef();

    return (
      <TapGestureHandler
        ref={tapRef}
        waitFor={panRef}
        shouldCancelWhenOutside
        onHandlerStateChange={this._onTapHandlerStateChange}>
        <View style={[styles.wrapper, {width}]}>
          <PanGestureHandler
            ref={panRef}
            activeOffsetX={[-20, 20]}
            onGestureEvent={this._onPanGestureEvent}>
            <Animated.View style={styles.horizontalPan}>
              <View style={[styles.line, {width}]} />
              <Animated.View
                style={[
                  styles.circleBorder,
                  {
                    borderRadius: circleRadius * 2,
                    borderWidth: cursorBorderWidth,
                    padding: circleRadius * 2,
                    transform: [
                      {
                        translateX: Animated.add(
                          transX,
                          new Animated.Value(
                            -circleRadius / 2 - cursorBorderWidth * 2,
                          ),
                        ),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.circle,
                  {
                    width: circleRadius * 2,
                    height: circleRadius * 2,
                    borderRadius: circleRadius * 2,
                    transform: [{translateX: transX}],
                  },
                ]}
              />
            </Animated.View>
          </PanGestureHandler>
        </View>
      </TapGestureHandler>
    );
  }
}

Slider.defaultProps = {
  width: 200,
  circleRadius: 10,
  cursorBorderWidth: 3,
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  horizontalPan: {
    height: 150,
    justifyContent: 'center',
    marginVertical: 10,
    position: 'relative',
  },
  line: {
    height: 2,
    backgroundColor: '#bdbdbd',
  },
  circleBorder: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#000',
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});
