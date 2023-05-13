import React from "react";

import { TouchableOpacity, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import ScreenDrawer from "./ScreenDrawer";
import triggerAction from "../functions/triggerAction";
import Bullet from "./Bullet";
import Checkbox from "./Checkbox";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function ListItem({ ...props }: any) {
  const { spacing, Colors } = useLayout();

  const onPress = () => {
    if (typeof props.action != "undefined") {
      triggerAction(props.action, props);

      if (typeof props.action.preventDefault != "undefined" && props.action.preventDefault == true) return;
    }

    if (typeof props.onPress != "undefined") {
      props.onPress(props);
    }

    // const action = StackActions.push("ModuleDetails", {
    //   ...props,
    //   details: props.defaultDetails,
    // });

    // navigationRef.dispatch(action);
  };

  const onLongPress = () => {
    if (typeof props.action != "undefined") {
      triggerAction(props.action, props);
    }

    if (typeof props.onLongPress != "undefined") {
      props.onLongPress(props);
    }
  };

  return (
    <AnimatedTouchableOpacity
      entering={FadeIn}
      activeOpacity={0.5}
      onPress={onPress}
      onLongPress={onLongPress}
      style={{ width: "100%", flexDirection: "row", alignItems: "center" }}
    >
      {typeof props.selected != "undefined" && (
        <Checkbox isChecked={props.selected} style={{ margin: spacing * 1.5 }} />
      )}

      {typeof props.unread != "undefined" && (
        <Bullet color={props.unread ? "info" : "transparent"} style={{ marginHorizontal: spacing * 0.8 }} />
      )}

      <ScreenDrawer
        content={props.content}
        style={{
          marginTop: spacing * 0.5,
          marginLeft: typeof props.unread != "undefined" ? -spacing : undefined,
          borderBottomWidth: 1,
          borderColor: Colors.border,
        }}
        scrollEnabled={false}
      />
    </AnimatedTouchableOpacity>
  );
}

export default ListItem;
