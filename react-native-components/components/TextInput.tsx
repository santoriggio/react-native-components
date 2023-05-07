import React from "react";
import { TextInputProps } from "../types";
import { Text, TextInput as DefaultTextInput } from "react-native";
import useLayout from "../hooks/useLayout";
function TextInput(props: TextInputProps) {
  const { size, bold, style, ...otherProps } = props;
  const { fontSize, Colors } = useLayout();

  return (
    <DefaultTextInput
      style={[
        {
          fontFamily: typeof props.bold != "undefined" ? "bold" : "regular",
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
