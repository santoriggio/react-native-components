import React from "react";
import { View } from "react-native";
import useLayout from "../hooks/useLayout";

function Bullet({ color = "primary", ...props }: any) {
  const { fontSize, Colors } = useLayout();
  return (
    <View
      style={{
        width: fontSize(props.size) * 0.8,
        aspectRatio: 1,
        borderRadius: 100,
        backgroundColor: typeof Colors[color] != "undefined" ? Colors[color] : color,
        ...props.style,
        //margin: spacing * 0.5,
        // marginLeft: isRow == false || (isRow && isFirst) ? undefined : spacing * 0.5,
        // marginRight: isRow == false || (isRow && isLast) ? undefined : spacing * 0.5,
      }}
    />
  );
}

export default Bullet;
