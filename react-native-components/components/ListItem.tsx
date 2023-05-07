import React from "react";

import { TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import ScreenDrawer from "./ScreenDrawer";
import AppSettings from "../utils/AppSettings";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function ListItem({ ...props }: any) {
  const { spacing, Colors } = useLayout();

  const onPress = () => {
    if (typeof props.action != "undefined") {
      if (props.action.type == "listener") {
        return AppSettings.emitListener(props.action.event, props.action.params);
      }
    }

    // const action = StackActions.push("ModuleDetails", {
    //   ...props,
    //   details: props.defaultDetails,
    // });

    // navigationRef.dispatch(action);
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeIn}
      activeOpacity={0.5}
      onPress={onPress}
      style={{ borderBottomWidth: 1, borderColor: Colors.border, padding: spacing }}
    >
      <ScreenDrawer content={props.content} style={{ margin: -spacing }} scrollEnabled={false} />
    </AnimatedTouchableOpacity>
  );
}

export default ListItem;
