import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import config from "../utils/Config";
import { RenderHTML } from "..";
import Slider from "@react-native-community/slider";

function Input({ value, onChange, required = false, ...component }: InputProps) {
  const { spacing, icon_size, radius, fontSize, Colors } = useLayout();

  const currentConfig = config.getConfig();

  const hasRegular = typeof currentConfig.fonts.regular != "undefined";
  const hasBold = typeof currentConfig.fonts.bold != "undefined";

  const googleInput = useRef<GooglePlacesAutocompleteRef>(null);

  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(
    component.type == "password" ? true : false
  );

  const [data, setData] = useState<any>(value);

  useEffect(() => {
    if (component.type === "address") {
      if (typeof value !== "undefined" && value !== "") {
        googleInput.current?.setAddressText(value);
      }
    }

    setData(value);
  }, [JSON.stringify(value)]);

  const onChangeInput = useCallback(
    (newValue: any, details?: any) => {
      let toReturn = newValue;

      if (typeof newValue == "undefined") {
        //Is boolean
        if (typeof component.link != "undefined") {
          return Linking.openURL(component.link);
        }

        toReturn = typeof data == "undefined" ? true : !data;
      }

      if (typeof onChange != "undefined" && typeof onChange == "function" && data != newValue) {
        onChange(toReturn, details);
      }
    },
    [data]
  );

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
          onPress={() => onChangeInput(!data)}
          activeOpacity={0.5}
          style={{ flexDirection: "row", alignItems: "center", minHeight: spacing * 4.2 }}
        >
          <Checkbox isChecked={data} />
          {typeof component.placeholder !== "undefined" && (
            <TouchableOpacity activeOpacity={0.5} onPress={() => onChangeInput(!data)}>
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
      return <PhoneInput value={data} onChange={onChangeInput} />;
    }

    if (component.type == "address") {
      return (
        <GooglePlacesAutocomplete
          ref={googleInput}
          placeholder="Cerca"
          onPress={(data, details) => {
            if (details !== null && typeof details.geometry !== "undefined") {
              const location = details.geometry.location;

              let extras = {
                locality: undefined,
                administrative_area_level_3: undefined,
                administrative_area_level_2: undefined,
                administrative_area_level_1: undefined,
              };

              details.address_components.forEach((comp) => {
                comp.types.forEach((type) => {
                  extras = {
                    ...extras,
                    [type]: comp.short_name,
                  };
                });
              });

              let obj = {
                lat: location.lat,
                lng: location.lng,
                ...extras,
              };

              onChangeInput(data.description, obj);
            }
          }}
          enablePoweredByContainer={false}
          // // currentLocation
          fetchDetails
          // // currentLocationLabel="Posizione attuale"
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
            key: currentConfig.googlePlacesAutocompleteKey,
            language: "it",
          }}
        />
      );
    }

    if (component.type == "date" || component.type === "datetime" || component.type === "time") {
      return (
        <DateTimePicker
          date={data}
          minimumDate={component.minimumDate}
          onChangeDate={onChangeInput}
          mode={component.type}
        />
      );
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
            borderRadius: radius,
            overflow: "hidden",
          }}
        >
          {typeof data != "undefined" && data != null && data != "" && (
            <RenderHTML
              html={data}
              scrollEnabled={false}
              containerStyle={{ ...StyleSheet.absoluteFillObject }}
              padding={spacing}
            />
          )}
          {/* <Text numberOfLines={10} style={{ padding: spacing * 0.5, marginHorizontal: spacing * 0.5 }}>
            {data}
          </Text> */}
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
            action={() => {
              EditorHTMLController.show(value, {
                onSuccess: onChangeInput,
              });
            }}
            style={{
              position: "absolute",
              marginHorizontal: spacing,
            }}
          />
          <EditorHTML {...component} />
        </View>
      );
    }

    if (component.type == "slider") {
      return (
        <Slider
          value={value}
          onValueChange={(e) => {
            if (typeof onChange != "undefined") onChange(e);
          }}
          style={{ width: "100%", height: 40 }}
          minimumValue={component.minimumValue}
          maximumValue={component.maximumValue}
          step={component.step}
          minimumTrackTintColor={Colors.primary}
          maximumTrackTintColor={Colors.card}
        />
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
          onChangeText={onChangeInput}
          // textContentType="username"
          defaultValue={typeof data != "undefined" && data != null ? data.toString() : ""}
          placeholder={
            typeof component.placeholder !== "undefined" && component.placeholder !== ""
              ? component.placeholder
              : component.title
          }
          multiline={component.type === "textarea"}
          secureTextEntry={secureTextEntry}
          scrollEnabled={component.type == "textarea" ? false : undefined}
          keyboardType={keyboardType}
          placeholderTextColor={Colors.gray}
          autoCapitalize={
            component.type === "email" || component.type === "password" ? "none" : undefined
          }
          editable={component.active}
          size={component.size}
          textContentType={component.textContentType}
          style={{
            flex: 1,
            paddingTop: component.type == "textarea" ? spacing * 1.2 : undefined,
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
            <Icon family="Feather" name={secureTextEntry ? "eye" : "eye-off"} size={20} />
          </TouchableOpacity>
        )}
        {typeof component.suffix != "undefined" && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {typeof component.suffix.text != "undefined" && component.suffix.text != "" && (
              <View
                style={{
                  height: "100%",
                  width: spacing * 4.2,
                  justifyContent: "center",
                  alignItems: "center",
                  aspectRatio: 1,
                }}
              >
                <Text>{component.suffix.text}</Text>
              </View>
            )}
            {typeof component.suffix.icon != "undefined" && component.suffix.icon != "" && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: spacing * 4.2,
                  aspectRatio: 1,
                }}
              >
                <Icon name={component.suffix.icon} />
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View>
      {typeof component.title != "undefined" && (
        <View style={{ marginBottom: spacing, flexDirection: "row", alignItems: "center" }}>
          <Text bold numberOfLines={1}>
            {component.title}
            {component.type == "slider" ? `: ${value}` : undefined}
          </Text>

          {(required == true || required == 1) && <Text style={{ color: Colors.danger }}> *</Text>}
        </View>
      )}
      {renderComponent()}
    </View>
  );
}

export default Input;
