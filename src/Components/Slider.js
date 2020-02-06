import React, {PureComponent} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {
  PanGestureHandler,
  TapGestureHandler,
  State,
} from 'react-native-gesture-handler';

const {Value, event, add} = Animated;
export class Slider extends PureComponent {
  constructor(props) {
    super(props);
    const {value, width, maximumValue, circleRadius} = props;
    this._lastOffset = {x: 0, y: 0};
    this._touchX = new Value((value * width) / 2 + circleRadius);
    this._cursorX = new Value((value * width) / 2 + circleRadius);
    this._translateX = add(this._touchX, new Value(-props.circleRadius));
    this._onPanGestureEvent = event(
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
      const rateValue = Math.floor((panValue * maximumValue) / width);
      this.props.onValueChange(panValue, rateValue);
    });
  }

  getInitialPosition = (value, width, minimumValue, maximumValue) => {};

  _onTapHandlerStateChange = ({nativeEvent}) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this._touchX, {
        toValue: nativeEvent.x,
        bounciness: 10,
        useNativeDriver: true,
      }).start();
    }
  };

  componentWillUnmount() {
    this._touchX.removeAllListeners();
  }

  render() {
    const {width, circleRadius, cursorBorderWidth} = this.props;
    const tapRef = React.createRef();
    const panRef = React.createRef();

    const transX = this._translateX.interpolate({
      inputRange: [-1, 0, width, width + 1],
      outputRange: [
        -circleRadius,
        -circleRadius,
        width - circleRadius,
        width - circleRadius,
      ],
      extrapolate: 'clamp',
    });

    return (
      <TapGestureHandler
        ref={tapRef}
        waitFor={panRef}
        onHandlerStateChange={this._onTapHandlerStateChange}
        shouldCancelWhenOutside>
        <Animated.View style={[styles.wrapper, {width}]}>
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
                    borderRadius: circleRadius,
                    borderWidth: cursorBorderWidth,
                    padding: circleRadius,
                    transform: [
                      {
                        translateX: add(
                          transX,
                          new Value(-circleRadius / 2 - cursorBorderWidth),
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
                    width: circleRadius,
                    height: circleRadius,
                    borderRadius: circleRadius,
                    transform: [
                      {
                        translateX: transX,
                      },
                    ],
                  },
                ]}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </TapGestureHandler>
    );
  }
}

Slider.defaultProps = {
  width: 200,
  circleRadius: 20,
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
    borderColor: '#fff',
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  circle: {
    position: 'absolute',
    backgroundColor: '#000',
  },
});
