import React, { FC, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import parsePhoneNumber, { isValidPhoneNumber } from "libphonenumber-js";
//import { Flag, FlagType } from "react-native-country-picker-modal";
import useColorScheme from "../hooks/useColorScheme";
import useLayout from "../hooks/useLayout";
import { Flags } from "../utils/Flags";
import Flag, { CountryCode } from "./Flag";
import TextInput from "./TextInput";
import FlagPicker, { FlagPickerController } from "./FlagPicker";
// import { navigationRef } from "../utils/RootNavigation";

interface IProps {
  value: string;
  input_container_style?: ViewStyle;
  onChange: (newValue: string) => void;
}

const PhoneInput: FC<IProps> = ({ value, size, onChange, input_container_style }) => {
  const colorScheme = useColorScheme();
  const { spacing, radius, fontSize, Colors } = useLayout();
  const [phoneText, setPhoneText] = useState<string>("+39");
  const [actualFlag, setActualFlag] = useState<{ code: any; dial_code: string; name: string }>({
    code: "IT",
    dial_code: "+39",
    name: "Italy",
  });

  const needCheck = useRef<boolean>(true);

  useEffect(() => {
    if (needCheck.current && typeof value !== "undefined" && value !== null && value !== "") {
      needCheck.current = false;

      const parsed = parsePhoneNumber(value, actualFlag.code);

      if (typeof parsed === "undefined") return setPhoneText(value);

      onChangeText(parsed.number);
    }
  }, [JSON.stringify(value)]);

  const onChangeText = (text: string) => {
    try {
      const number = parsePhoneNumber(text, actualFlag.code);

      let f: any | undefined = undefined;

      if (typeof number !== "undefined" && typeof number.country !== "undefined") {
        const array = Flags.filter((flag: any) => flag.code === number.country);

        if (array.length > 0) {
          f = array[0];
          setActualFlag(array[0]);
        }
      }

      setPhoneText(text);
      onChange(text);
    } catch (error) {
      //   showMessage({
      //     component: "alert",
      //     title: "Ops",
      //     message: "Si è verificato un errore con il numero di telefono inserito",
      //   });
    }
  };

  return (
    <View
      style={{
        borderRadius: radius,
        borderColor: Colors.border,
        borderWidth: 1,
        flexDirection: "row",
        alignItems: "center",
        ...input_container_style,
      }}
    >
      <TouchableOpacity
        style={{ paddingHorizontal: spacing }}
        hitSlop={{
          bottom: spacing,
          top: spacing,
        }}
        onPress={() => {
          FlagPickerController.showModal({
            onSuccess: (result: any) => {
              setActualFlag((prevFlag: any) => {
                setPhoneText((prevPhoneText) => {
                  if (prevPhoneText.trim() === "") return result.dial_code;
                  let array = prevPhoneText.split(prevFlag.dial_code);
                  if (array.length > 1) {
                    array[0] = result.dial_code;
                    return array.join(" ");
                  }
                  return `${result.dial_code} ${prevPhoneText}`;
                });
                return result;
              });
            },
            prefixVisible: true,
          });
        }}
      >
        <Flag countryCode={actualFlag.code} />
      </TouchableOpacity>
      <TextInput
        value={phoneText}
        size={size}
        placeholder="Numero"
        keyboardType="phone-pad"
        onChangeText={onChangeText}
        style={{
          flex: 1,
          padding: spacing,
          minHeight: spacing * 4.2,
        }}
      />
    </View>
  );
};

export default PhoneInput;
