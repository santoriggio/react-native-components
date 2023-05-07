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
import AppSettings from "../utils/AppSettings";
/*
 
  action : {
 
  type :'picker',
  picker: 'search',
  content: [
  {
  component:'list',
  endpoint: '/search/list',
  params: ['buyable']
  }
  ]
  }
 
 */

function Button({ ...props }: ButtonProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const type: ButtonProps["type"] =
    typeof props.type != "undefined" && typeof ButtonTypes[props.type] != "undefined" ? props.type : "filled";

  useEffect(() => {
    const fLoading = keyExist<boolean>(props.loading);

    if (typeof fLoading != "undefined") {
      if (loadingState) {
        //Nothing
      } else {
        setLoadingState(fLoading);
      }
    }
  }, [props.loading]);

  const onPress = async () => {
    if (loadingState) return;

    const fAction = keyExist<ButtonProps["action"]>(props.action);

    if (typeof fAction != "undefined") {
      if (typeof fAction.type != "undefined") {
        if (fAction.type == "link") {
          const fLink = keyExist<string>(fAction.link);

          if (typeof fLink != "undefined") {
            return Linking.openURL(fLink);
          }
        }

        if (fAction.type == "api") {
          const fEndpoint = keyExist<string>(fAction.endpoint);
          const fParams = keyExist<any>(fAction.params);

          if (typeof fEndpoint != "undefined") {
            setLoadingState(true);

            const apiResult = await sendApiRequest(fEndpoint, fParams);

            setLoadingState(false);

            if (typeof apiResult.error != "undefined") {
              console.error("Ops", JSON.stringify(apiResult.error));
              return;
            }
          }
        }

        if (fAction.type == "popup") {
          const fContent = keyExist<ScreenDrawerComponent[]>(fAction.content);
          if (typeof fContent != "undefined") {
            BottomSheetController.show(fContent);
          }
        }

        if (fAction.type == "listener") {
          return AppSettings.emitListener(fAction.event, fAction.params);
        }

        if (fAction.type == "picker") {
          if (fAction.picker == "search") {
            return SearchPickerController.show(fAction);
          }

          if (fAction.picker == "flag") {
          }
        }
      }
    }

    if (props.onPress) props.onPress();
  };

  const hasIcon = useMemo(() => {
    const icon = keyExist<ButtonProps["icon"]>(props.icon);

    if (typeof icon == "undefined") return false;

    return true;
  }, [props.icon]);

  const tint = useMemo(() => {
    if (typeof props.role != "undefined") {
      if (typeof Colors[props.role] != "undefined") {
        return Colors[props.role];
      }
    }

    return Colors.primary;
  }, [type, props.role]);

  const background = useMemo(() => {
    if (type == "gray" || (typeof props.active != "undefined" && props.active == false)) {
      return Colors.gray;
    }

    if (type == "plain") {
      return undefined;
    }

    return tint;
  }, [props.active, props.role, type, tint]);

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
      {typeof props.title != "undefined" && props.title.trim() != "" && (
        <Text
          numberOfLines={1}
          size={typeof props.size != "undefined" ? props.size : "l"}
          style={{ marginLeft: hasIcon ? spacing * 0.5 : undefined, color: textColor, ...props.textStyle }}
          bold
        >
          {props.title}
        </Text>
      )}
      {loadingState == true && <ActivityIndicator size="small" color={textColor} style={{ marginLeft: spacing }} />}
    </TouchableOpacity>
  );
}

export default Button;
