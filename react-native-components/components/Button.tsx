import React, { useEffect, useMemo, useState } from "react";
import { Action, ButtonProps, ButtonTypes } from "../types";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "./Text";
import keyExist from "../functions/keyExist";
import Icon from "./Icon";
import useLayout from "../hooks/useLayout";
import * as Linking from "expo-linking";
import sendApiRequest from "../functions/sendApiRequest";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import { BottomSheetController } from "./BottomSheet";
import { SearchPickerController } from "./SearchPicker";
import triggerAction from "../functions/triggerAction";

function Button(props: ButtonProps) {
  const { loading = false, active = true, role = "primary", type = "filled", ...otherProps } = props;
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [loadingState, setLoadingState] = useState<boolean>(loading);

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  const onPress = async () => {
    if (loadingState || active == false) return;

    if (typeof otherProps.action != "undefined") return triggerAction(otherProps.action);
  };

  const hasIcon = useMemo(() => {
    const icon = keyExist<ButtonProps["icon"]>(otherProps.icon);

    if (typeof icon == "undefined") return false;

    return true;
  }, [otherProps.icon]);

  const tint = useMemo(() => {
    if (typeof Colors[role] != "undefined") {
      return Colors[role];
    }

    return Colors.primary;
  }, [type, role]);

  const background = useMemo(() => {
    if (type == "gray" || (typeof props.active != "undefined" && props.active == false)) {
      return Colors.gray;
    }

    if (type == "plain") {
      return undefined;
    }

    return tint;
  }, [active, role, type, tint]);

  const textColor = useMemo(() => {
    let toReturn = "white";

    if (type != "filled") {
      return tint;
    }

    return toReturn;
  }, [type, tint]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={typeof props.activeOpacity != "undefined" ? props.activeOpacity : 0.5}
      style={{
        borderRadius: radius,
        overflow: "hidden",
        padding: spacing,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        minHeight: typeof props.type != "undefined" && props.type == "plain" ? undefined : spacing * 4.2,
        ...props.style,
      }}
    >
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: background,
          opacity: typeof background == "undefined" ? 0 : props.type == "gray" || props.type == "tinted" ? 0.25 : 1,
        }}
      />
      {hasIcon && (
        <Icon family="Ionicons" name={props.icon} color={textColor} size={icon_size * 1.2} style={props.iconStyle} />
      )}
      {typeof otherProps.title != "undefined" && otherProps.title.trim() != "" && (
        <Text
          numberOfLines={1}
          size={typeof props.size != "undefined" ? props.size : "l"}
          style={{ marginLeft: hasIcon ? spacing * 0.5 : undefined, color: textColor, ...otherProps.textStyle }}
          bold
        >
          {otherProps.title}
        </Text>
      )}
      {loadingState == true && <ActivityIndicator size="small" color={textColor} style={{ marginLeft: spacing }} />}
    </TouchableOpacity>
  );
}

export default Button;
