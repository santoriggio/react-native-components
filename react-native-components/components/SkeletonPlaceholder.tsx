import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import { View, ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import useLayout from "../hooks/useLayout";
import { SkeletonPlaceholderComponent, SkeletonPlaceholderProps } from "../types";

function SkeletonPlaceholder({ ...props }: SkeletonPlaceholderProps) {
  const { spacing, radius, Colors } = useLayout();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    startAnimation();
  }, []);

  const customStyle = (component: SkeletonPlaceholderComponent) => {
    let toReturn: ViewStyle = {};

    if (typeof component.height != "undefined" && component.height >= 0) {
      toReturn.height = spacing * component.height;
    }

    if (typeof component.radius != "undefined" && component.radius >= 0) {
      toReturn.borderRadius = radius * component.radius;
    }

    return toReturn;
  };

  const startAnimation = () => {
    animatedValue.value = withRepeat(withTiming(1, { duration: 1000, easing: Easing.ease }), 100, true);
  };

  const rStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animatedValue.value, [0, 0.5, 1], [-100, 0, 100]);
    return {
      transform: [{ translateX }],
    };
  });

  const bg = Colors.isDark ? Colors.secondary : "#f3f3f3";

  return (
    <View style={{ opacity: 0.6, flexDirection: "row", flexWrap: "wrap", padding: spacing * 0.5, ...props.style }}>
      {props.components.map((component: any, id: number) => {
        if (component.quantity) {
          return Array.from(Array(component.quantity).keys()).map((x, y) => {
            return (
              <View
                key={y}
                style={{
                  width: (typeof component.size !== "undefined" ? component.size : 100) + "%",
                  padding: spacing / 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.isDark ? Colors.card : "#ecebeb",
                    overflow: "hidden",
                    ...customStyle(component),
                  }}
                >
                  <Animated.View style={[rStyle, { height: "100%", width: "100%" }]}>
                    <LinearGradient
                      style={{ position: "absolute", bottom: 0, top: 0, left: 0, right: 0 }}
                      colors={[bg + "00", bg + "40", bg + "80", bg, bg, bg + "80", bg + "40", bg + "00"]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </Animated.View>
                </View>
              </View>
            );
          });
        }

        return (
          <View
            key={id}
            style={{
              width: (typeof component.size !== "undefined" ? component.size : 100) + "%",
              padding: spacing / 2,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.isDark ? Colors.card : "#ecebeb",
                overflow: "hidden",
                width: (typeof component.size !== "undefined" ? component.size : 100) + "%",
                ...customStyle(component),
              }}
            >
              <Animated.View style={[rStyle, { height: "100%", width: "100%" }]}>
                <LinearGradient
                  style={{ position: "absolute", bottom: 0, top: 0, left: 0, right: 0 }}
                  colors={[bg + "00", bg + "40", bg + "80", bg, bg, bg + "80", bg + "40", bg + "00"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

export default SkeletonPlaceholder;
