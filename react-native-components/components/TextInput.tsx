import React from "react";
import { TextInputProps } from "../types";
import { Text, TextInput as DefaultTextInput } from "react-native";
import useLayout from "../hooks/useLayout";
import config from "../utils/Config";

function TextInput(props: TextInputProps) {
  const { size, bold, style, ...otherProps } = props;
  const { fontSize, Colors } = useLayout();
  const currentConfig = config.getConfig();

  const hasRegular = typeof currentConfig.fonts.regular != "undefined";
  const hasBold = typeof currentConfig.fonts.bold != "undefined";

  return (
    <DefaultTextInput
      style={[
        {
          fontFamily:
            typeof props.bold != "undefined" && hasBold
              ? "bold"
              : hasRegular
              ? "regular"
              : undefined,
          fontSize: fontSize(size),
          color: Colors.text,
          includeFontPadding: false,
        },
        style,
      ]}
      cursorColor={Colors.primary}
      maxFontSizeMultiplier={1.3}
      selectionColor={Colors.primary}
      placeholderTextColor={Colors.gray}
      {...otherProps}
    />
  );
}

export default TextInput;
