import React, { useEffect } from "react";
import useLayout from "../hooks/useLayout";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  withTiming,
  interpolateColor,
  withSpring,
} from "react-native-reanimated";
import Icon from "./Icon";
import { CheckboxProps } from "../types";
import keyExist from "../functions/keyExist";

function Checkbox({ ...props }: CheckboxProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const value = useSharedValue(0);

  useEffect(() => {
    handleChanges();
  }, [props.isChecked]);

  const handleChanges = () => {
    const isChecked = keyExist<boolean>(props.isChecked);

    if (typeof isChecked != "undefined") {
      if (isChecked == true) {
        value.value = withTiming(1, { duration: 250, easing: Easing.elastic(1.2) });
      }

      if (isChecked == false) {
        value.value = withTiming(0, { duration: 250, easing: Easing.out(Easing.ease) });
      }
    }
  };

  const rContainer = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      value.value,
      [0, 0.4, 0.9, 1],
      [Colors.gray, Colors.gray, Colors.primary, Colors.primary]
    );
    return {
      borderColor,
    };
  });

  const rStyle = useAnimatedStyle(() => {
    const scale = interpolate(value.value, [0, 1], [0, 1]);
    const opacity = interpolate(value.value, [0, 0.6, 1], [0, 0, 1]);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        rContainer,
        {
          borderRadius: radius * 0.65,
          overflow: "hidden",
          borderWidth: 2,
          height: spacing * 2,
          width: spacing * 2,
          ...props.style,
        },
      ]}
    >
      <Animated.View
        style={[
          rStyle,
          {
            position: "absolute",
            top: -spacing * 0.2,
            bottom: -spacing * 0.2,
            left: -spacing * 0.2,
            right: -spacing * 0.2,
            backgroundColor: Colors.primary,
            borderRadius: radius * 0.65,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Icon family="Entypo" name="check" color="white" size={icon_size} />
      </Animated.View>
    </Animated.View>
  );
}

export default Checkbox;
