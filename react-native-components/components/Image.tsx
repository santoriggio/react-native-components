import React, { useEffect, useMemo, useState } from "react";
import { View, Image as RNImage } from "react-native";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import Icon from "./Icon";
import Text from "./Text";
import { ImageProps } from "../types";
import { Image as DefaultImage } from "expo-image";
import config from "../utils/Config";
import { isPinOrFingerprintSetSync } from "react-native-device-info";

function RenderBadge({ ...props }: ImageProps["badge"]) {
  const { spacing, icon_size, radius } = useLayout();

  const style = useMemo(() => {
    const position = props.position;

    if (typeof position == "undefined") return;

    const vPosition = position.split("-")[0];
    const hPosition = position.split("-")[1];

    let positions: any = {
      top: undefined,
      bottom: undefined,
      left: undefined,
      right: undefined,
    };

    const offset = 0;

    if (vPosition == "top") {
      positions.top = offset;
    } else {
      positions.bottom = offset;
    }

    if (hPosition == "left") {
      positions.left = offset;
    } else {
      positions.right = offset;
    }

    return positions;
  }, [props.position]);

  return (
    <View
      style={{
        position: "absolute",
        borderRadius: radius,
        paddingHorizontal: spacing * 0.5,
        paddingVertical: spacing * 0.5,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 10,
        backgroundColor: props.color,
        ...style,
      }}
    >
      {typeof props.icon != "undefined" && (
        <Icon name={props.icon} size={icon_size * 0.8} color="white" />
      )}
      {typeof props.text != "undefined" && (
        <Text numberOfLines={1} size="xs" style={{ color: "white" }}>
          {props.text}
        </Text>
      )}
    </View>
  );
}

export default function Image({ source, badge, ...props }: ImageProps) {
  // const [source, setSource] = useState<ImageProps["source"]>(props.source);
  const currentConfig = config.getConfig();

  return (
    <>
      <DefaultImage
        {...props}
        placeholder={currentConfig.images.icon}
        placeholderContentFit="contain"
        source={source != "" ? source : undefined}
      />
      {typeof badge != "undefined" && <RenderBadge {...badge} />}
    </>
  );
}
