import React from "react";
import { View } from "react-native";
import getColor from "../functions/getColor";
import useLayout from "../hooks/useLayout";

function Bullet({ color, ...props }: any) {
  const { fontSize, Colors } = useLayout();

  return (
    <View
      style={{
        width: fontSize(props.size) * 0.8,
        aspectRatio: 1,
        borderRadius: 100,
        backgroundColor: typeof color != "undefined" ? getColor(color, Colors) : undefined,
        ...props.style,
      }}
    />
  );
}

export default Bullet;
