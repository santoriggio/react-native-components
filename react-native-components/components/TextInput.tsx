import React from "react";
import { TextInputProps } from "../types";
import { Text, TextInput as DefaultTextInput } from "react-native";
import useLayout from "../hooks/useLayout";
import { config } from "../config.default";

const hasRegular = typeof config.fonts.regular != "undefined";
const hasBold = typeof config.fonts.bold != "undefined";

function TextInput(props: TextInputProps) {
  const { size, bold, style, ...otherProps } = props;
  const { fontSize, Colors } = useLayout();

  return (
    <DefaultTextInput
      style={[
        {
          fontFamily: typeof props.bold != "undefined" && hasBold ? "bold" : hasRegular ? "regular" : undefined,
          fontSize: fontSize(size),
          color: Colors.text,
          includeFontPadding: false,
        },
        style,
      ]}
      cursorColor={Colors.primary}
      selectionColor={Colors.primary}
      {...otherProps}
    />
  );
}

export default TextInput;
