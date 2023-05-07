import React, { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import Icon from "./Icon";
import Text from "./Text";
import { ImageProps } from "../types";
import { Image as DefaultImage } from "expo-image";
import { config } from "../config.default";

function RenderBadge({ ...props }: ImageProps["badge"]) {
  const { spacing, icon_size, radius, Colors } = useLayout();

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

    const offset = -spacing * 0.2;

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
      {typeof props.icon != "undefined" && <Icon name={props.icon} size={icon_size * 0.8} color="white" />}
      {typeof props.text != "undefined" && (
        <Text numberOfLines={1} size="xs" style={{ color: "white" }}>
          {props.text}
        </Text>
      )}
    </View>
  );
}

function Image({ ...props }: ImageProps) {
  const { radius, spacing, icon_size } = useLayout();
  const [url, setUrl] = useState<ImageProps["source"]>(props.source);
  const [error, setError] = useState<boolean>(false);
  const defaultSource = config.images.icon;

  useEffect(() => {
    if (typeof props.source == "undefined") onError();
  }, []);

  const hasBadge = useMemo(() => {
    if (typeof keyExist(props.badge) == "undefined") return false;

    return true;
  }, [JSON.stringify(props.badge)]);

  const onError = () => {
    setError(true);
  };

  return (
    <>
      <DefaultImage source={error ? defaultSource : url} onError={onError} style={props.style} />
      {hasBadge && <RenderBadge {...props.badge} />}
    </>
  );
}

export default Image;
