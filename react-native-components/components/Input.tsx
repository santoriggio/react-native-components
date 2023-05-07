import React, { useEffect, useMemo, useRef, useState } from "react";
import { KeyboardType, Linking, StyleSheet, TouchableOpacity, View } from "react-native";
import useLayout from "../hooks/useLayout";
import PhoneInput from "./PhoneInput";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteProps,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
import Icon from "./Icon";
import Text from "./Text";
import Checkbox from "./Checkbox";
import TextInput from "./TextInput";
import DateTimePicker from "./DateTimePicker";
import { InputProps } from "../types";
import EditorHTML, { EditorHTMLController } from "./EditorHTML";
import Button from "./Button";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { config } from "../config.default";

const hasRegular = typeof config.fonts.regular != "undefined";

function Input({ value, onChange, ...component }: InputProps) {
  const { spacing, icon_size, radius, fontSize, Colors } = useLayout();

  const googleInput = useRef<GooglePlacesAutocompleteRef>(null);

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(false);

  useEffect(() => {
    if (component.type === "address") {
      if (typeof value !== "undefined" && value !== "") {
        googleInput.current?.setAddressText(value);
      }
    }

    if (component.type === "password") {
      setSecureTextEntry(true);
    }

    if (typeof component.trigger != "undefined") {
      if (typeof onChange != "undefined") {
        onChange(value);
      }
    }
  }, []);

  const onChangeInput = (newValue: any, details?: any) => {
    let toReturn = newValue;

    if (typeof newValue == "undefined") {
      //Is boolean
      if (typeof component.link != "undefined") {
        return Linking.openURL(component.link);
      }

      toReturn = !value;
    }

    if (typeof onChange != "undefined" && typeof onChange == "function") {
      onChange(newValue);
    }
  };

  const keyboardType = useMemo(() => {
    let t: KeyboardType = "default";

    if (component.type === "email") t = "email-address";

    if (component.type === "number") t = "numeric";

    return t;
  }, [component.type]);

  const renderComponent = () => {
    if (component.type == "checkbox") {
      return (
        <TouchableOpacity
          onPress={onChangeInput}
          activeOpacity={0.5}
          style={{ flexDirection: "row", alignItems: "center", minHeight: spacing * 4.2 }}
        >
          <Checkbox isChecked={value} />
          {typeof component.placeholder !== "undefined" && (
            <TouchableOpacity activeOpacity={0.5} onPress={onChangeInput}>
              <Text
                numberOfLines={1}
                style={{
                  marginLeft: spacing,
                  textDecorationLine: typeof component.link !== "undefined" ? "underline" : "none",
                }}
              >
                {component.placeholder}
              </Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      );
    }

    if (component.type == "phone") {
      return <PhoneInput value={value} onChange={onChangeInput} />;
    }

    if (component.type == "address") {
      return (
        <GooglePlacesAutocomplete
          ref={googleInput}
          placeholder="Cerca"
          onPress={(data, details) => {
            if (details !== null && typeof details.geometry !== "undefined") {
              const location = details.geometry.location;
              let obj = {
                lat: location.lat,
                lng: location.lng,
              };

              if (onChange) onChangeInput(data.description, obj);
            }
          }}
          enablePoweredByContainer={false}
          // currentLocation
          fetchDetails
          // currentLocationLabel="Posizione attuale"
          textInputProps={{
            onChangeText: onChangeInput,
            placeholderTextColor: Colors.gray,
            cursorColor: Colors.primary,
            selectionColor: Colors.primary,
          }}
          renderRow={({ ...props }) => {
            return (
              <Text style={{ flex: 1 }} numberOfLines={1}>
                {props.description}
              </Text>
            );
          }}
          styles={{
            container: {
              flex: undefined,
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: radius,
            },
            textInput: {
              color: Colors.text,
              fontFamily: hasRegular ? "regular" : undefined,
              includeFontPadding: false,
              marginBottom: 0,
              borderRadius: radius,
              padding: spacing,
              fontSize: fontSize(),
              paddingVertical: undefined,
              backgroundColor: undefined,
              height: spacing * 4.2,
            },
            listView: {
              borderBottomEndRadius: radius,
              borderBottomStartRadius: radius,
            },
            row: {
              width: "100%",
              borderTopWidth: 1,
              borderBottomWidth: 0,
              borderColor: Colors.border,
              backgroundColor: Colors.background,
            },
            separator: {
              height: 0,
            },
          }}
          query={{
            key: config.googlePlacesAutocompleteKey,
            language: "it",
          }}
        />
      );
    }

    if (component.type == "date" || component.type === "datetime" || component.type === "time") {
      return <DateTimePicker date={value} onChangeDate={onChangeInput} mode={component.type} />;
    }

    if (component.type == "html") {
      return (
        <View
          style={{
            borderWidth: 1,
            borderColor: Colors.border,
            height: spacing * 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text numberOfLines={10} style={{ padding: spacing * 0.5, marginHorizontal: spacing * 0.5 }}>
            {value}
          </Text>
          <LinearGradient
            colors={[Colors.background, Colors.background + "00"]}
            style={{ ...StyleSheet.absoluteFillObject }}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
          />
          {/* <BlurView intensity={10} style={{ ...StyleSheet.absoluteFillObject }} /> */}
          <Button
            title="Modifica"
            icon="pencil"
            role="info"
            onPress={() => {
              EditorHTMLController.show(value, {
                onSuccess: onChangeInput,
              });
            }}
            style={{
              position: "absolute",
              marginHorizontal: spacing,
            }}
          />
          <EditorHTML />
        </View>
      );
    }

    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: Colors.border,
          borderRadius: radius,
        }}
      >
        <TextInput
          onChangeText={onChange}
          // textContentType="username"
          defaultValue={value}
          placeholder={
            typeof component.placeholder !== "undefined" && component.placeholder !== ""
              ? component.placeholder
              : component.title
          }
          multiline={component.type === "textarea"}
          secureTextEntry={secureTextEntry}
          // keyboardType={keyboardType}
          placeholderTextColor={Colors.gray}
          autoCapitalize={component.type === "email" || component.type === "password" ? "none" : undefined}
          size={component.size}
          style={{
            flex: 1,
            padding: spacing,
            minHeight: component.type === "textarea" ? spacing * 12 : spacing * 4.2,
          }}
        />
        {component.type === "password" && (
          <TouchableOpacity
            style={{
              paddingHorizontal: spacing,
            }}
            activeOpacity={0.5}
            onPress={() => setSecureTextEntry((prevState) => !prevState)}
          >
            <Icon family="Feather" name={secureTextEntry ? "eye-off" : "eye"} size={20} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View>
      {typeof component.title !== "undefined" && (
        <View style={{ marginBottom: spacing, flexDirection: "row", alignItems: "center" }}>
          <Text bold numberOfLines={1}>
            {component.title}
          </Text>
          {typeof component.required != "undefined" && component.required && (
            <Text style={{ color: Colors.danger }}> *</Text>
          )}
        </View>
      )}
      {renderComponent()}
    </View>
  );
}

export default Input;
