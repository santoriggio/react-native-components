import { LinearGradient } from "expo-linear-gradient";
import React, { isValidElement } from "react";
import { StyleSheet, Switch, SwitchChangeEvent, TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import triggerAction from "../functions/triggerAction";

import useLayout from "../hooks/useLayout";
import { ButtonsListButtonProps, ButtonsListProps } from "../types";
import Icon from "./Icon";
import Text from "./Text";

function ButtonsList(props: ButtonsListProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const { buttons = [], animated = true, ...otherProps } = props;

  const buttonHeight = spacing * 2.8;

  return (
    <Animated.View style={otherProps.style} entering={animated ? FadeIn : undefined}>
      <View style={{ borderRadius: radius, overflow: "hidden" }}>
        {props.buttons.map((button, index) => {
          const { backgroundColor = Colors.card, titleColor = Colors.text, subtitleColor = Colors.gray } = button;

          const onPress = () => {
            if (typeof button.action != "undefined") {
              return triggerAction<ButtonsListButtonProps>(button.action, button);
            }

            if (typeof button.onPress != "undefined") {
              return button.onPress(button);
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              disabled={typeof button.onPress == "undefined" && typeof button.action == "undefined"}
              activeOpacity={0.5}
              style={{
                padding: spacing * 0.5,
                flexDirection: "row",
                backgroundColor,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: button.color,
                  overflow: "hidden",
                  height: buttonHeight,
                  justifyContent: "center",
                  alignItems: "center",
                  aspectRatio: 1,
                  borderRadius: radius * 0.8,
                }}
              >
                {typeof button.icon != "undefined" && button.icon != "" && (
                  <Icon family="Feather" name={button.icon} color="white" size={icon_size * 0.9} />
                )}
              </View>
              <View
                style={{
                  flex: 1,
                  marginLeft: spacing,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1, marginRight: spacing * 0.5 }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      color: titleColor,
                    }}
                  >
                    {button.title}
                  </Text>
                  {typeof button.subtitle != "undefined" && button.subtitle != "" && (
                    <Text numberOfLines={1} style={{ color: subtitleColor }} size="s">
                      {button.subtitle}
                    </Text>
                  )}
                </View>
                {typeof button.component != "undefined" ? (
                  <View>
                    {typeof button.component == "function" ? (
                      button.component(button)
                    ) : (
                      <View>
                        {button.component.type == "switch" && (
                          <Switch value={button.component.value} onChange={button.component.onChange} />
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <Icon
                    family="Feather"
                    name="chevron-right"
                    color={typeof button.chevronColor != "undefined" ? button.chevronColor : Colors.gray}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      {typeof otherProps.info != "undefined" && otherProps.info != "" && (
        <View
          style={{
            marginLeft: buttonHeight + spacing * 1.5,
            marginTop: spacing * 0.5,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text numberOfLines={2} size="s" style={{ flex: 1, color: Colors.gray }}>
            {otherProps.info}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

export default ButtonsList;
