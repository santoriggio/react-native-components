import React, { useMemo } from "react";

import { Text as DefaultText } from "react-native";
import { block } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import { TextProps } from "../types";
import { config } from "../config.default";

function Text({ ...props }: TextProps) {
  const { Colors, fontSize } = useLayout();

  const hasRegular = typeof config.fonts.regular != "undefined";
  const hasBold = typeof config.fonts.bold != "undefined";

  return (
    <DefaultText
      {...props}
      style={[
        {
          color: Colors.text,
          fontSize: fontSize(props.size),
          // fontFamily: typeof props.bold != "undefined" ? "bold" : "regular",
          fontFamily: typeof props.bold != "undefined" && hasBold ? "bold" : hasRegular ? "regular" : undefined,
          includeFontPadding: false,
        },
        props.style,
      ]}
    />
  );
}

export default Text;
