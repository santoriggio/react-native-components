import React from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { ScrollViewProps } from "../types";

function ScrollView({ scrollY, ...props }: ScrollViewProps) {
  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (scrollY) {
        scrollY.value = event.contentOffset.y;
      }
    },
  });

  return <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} {...props} />;
}

export default ScrollView;
