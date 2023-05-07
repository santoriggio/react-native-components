import React, { FC, forwardRef, ReactNode, useEffect, useImperativeHandle, useReducer, useRef, useState } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import useColorScheme from "../hooks/useColorScheme";
import useLayout from "../hooks/useLayout";
import { AccordionProps } from "../types";
import Icon from "./Icon";
import Text from "./Text";

export type AccordionMethods = {
  open: () => void;
  close: () => void;
};

const Accordion = forwardRef<AccordionMethods, AccordionProps>(({ ...props }, ref) => {
  const { spacing, icon_size, radius, Colors } = useLayout();

  const accordion_header_height = spacing * 4.3;

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const open = useSharedValue(0);

  const [viewHeight, setViewHieght] = useState<number>(0);

  useEffect(() => {
    if (typeof props.defaultStatus != "undefined") {
      if (props.defaultStatus == "open") {
        open.value = 1;
      }
    }
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => {
      open.value = withTiming(1);
    },
    close: () => {
      open.value = withTiming(0);
    },
  }));

  const rStyle = useAnimatedStyle(() => {
    const height = interpolate(open.value, [0, 1], [accordion_header_height, accordion_header_height + viewHeight]);
    return {
      height,
    };
  });

  const rChevron = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: interpolate(open.value, [0, 1], [0, 180]) + "deg",
        },
      ],
    };
  });

  return (
    <Animated.View
      style={[
        rStyle,
        {
          borderRadius: radius,
          borderWidth: 1,
          borderColor: Colors.border,
          overflow: "hidden",
          ...props.style,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          height: accordion_header_height,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: spacing,
          paddingRight: 0,
          ...props.headerStyle,
        }}
        onPress={() => {
          if (open.value) {
            open.value = withTiming(0);
            return;
          }
          open.value = withTiming(1);
        }}
      >
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          {typeof props.icon != "undefined" && props.icon != "" && (
            <Icon name={props.icon} color={props.color} style={{ marginRight: spacing }} size={icon_size * 1.2} />
          )}
          <View style={{ flex: 1 }}>
            <Text
              bold={props.bold}
              style={{ color: typeof props.color != "undefined" ? props.color : Colors.text }}
              size={props.size}
              numberOfLines={1}
            >
              {props.title}
            </Text>

            {typeof props.subtitle !== "undefined" && (
              <Text size="s" style={{ color: Colors.gray }}>
                {props.subtitle}
              </Text>
            )}
          </View>
        </View>
        <Animated.View style={[rChevron, { paddingHorizontal: spacing }]}>
          <Icon family="Feather" name="chevron-down" size={icon_size} />
        </Animated.View>
      </TouchableOpacity>
      <View onLayout={(e) => setViewHieght(e.nativeEvent.layout.height)}>{props.children}</View>
    </Animated.View>
  );
});

export default Accordion;
