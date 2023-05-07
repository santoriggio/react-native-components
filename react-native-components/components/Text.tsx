import React, { useMemo } from "react";

import { Text as DefaultText } from "react-native";
import { block } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import { TextProps } from "../types";
function Text({ ...props }: TextProps) {
  const { Colors, fontSize } = useLayout();

  return (
    <DefaultText
      {...props}
      style={[
        {
          color: Colors.text,
          fontSize: fontSize(props.size),
          fontFamily: typeof props.bold != "undefined" ? "bold" : "regular",
          includeFontPadding: false,
        },
        props.style,
      ]}
    />
  );
}

export default Text;
