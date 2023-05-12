import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { acc, RotateInUpLeft, ZoomInLeft } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import { SelectProps } from "../types";
import Accordion, { AccordionMethods } from "./Accordion";
import Checkbox from "./Checkbox";
import Text from "./Text";
import Flag from "./Flag";
import { Flags } from "../utils/Flags";
import { FlagPickerController } from "./FlagPicker";
type Selected = string | string[] | undefined;

function Select(props: SelectProps) {
  const {
    items = {},
    required = false,
    title,
    placeholder = "Select an element",
    type = "select",
    ...otherProps
  } = props;

  const { spacing, icon_size, radius, Colors } = useLayout();
  const [selectedItem, setSelectedItem] = useState<Selected>(undefined);
  const accordion = useRef<AccordionMethods>(null);

  const accordion_header_height = spacing * 4.3;

  useEffect(() => {
    if (typeof otherProps.selected != "undefined") {
      if (Array.isArray(otherProps.selected)) {
        setSelectedItem(otherProps.selected.map((x) => x.toString()));
      } else {
        setSelectedItem(otherProps.selected);
      }
    }
  }, []);

  const isSelected = useCallback(
    (key: string) => {
      let toReturn: boolean = false;
      if (typeof selectedItem != "undefined") {
        if (typeof selectedItem == "object" && Array.isArray(selectedItem)) {
          if (selectedItem.indexOf(key.toString()) >= 0) toReturn = true;
        } else {
          if (selectedItem == key) toReturn = true;
        }
      }

      return toReturn;
    },
    [JSON.stringify(selectedItem)]
  );

  const accordionTitle = useMemo(() => {
    let toReturn: string = placeholder;

    if (typeof selectedItem != "undefined") {
      if (typeof selectedItem == "object" && Array.isArray(selectedItem)) {
        let formatted: string[] = [];

        selectedItem.forEach((str, id) => {
          const item = items[str.toString()];

          if (typeof item == "object") {
            formatted.push(item.text);
          } else {
            formatted.push(item);
          }
        });

        toReturn = formatted.join(", ");
      } else {
        const item = typeof items[selectedItem] != "undefined" ? items[selectedItem] : undefined;

        if (typeof item == "undefined") {
          toReturn = selectedItem;
        } else {
          if (typeof item == "object") {
            toReturn = item.text;
          } else {
            toReturn = item;
          }
        }
      }
    }

    return toReturn;
  }, [JSON.stringify(selectedItem)]);

  const flag = Flags.filter((x) => x.name == selectedItem);

  return (
    <View style={otherProps.style}>
      {typeof title != "undefined" && title != "" && (
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: spacing }}>
          <Text bold>{title}</Text>
          {(required == true || required == 1) && <Text style={{ color: Colors.danger }}> *</Text>}
        </View>
      )}

      {type == "state" ? (
        <TouchableOpacity
          onPress={() => {
            FlagPickerController.show({
              onSuccess: (flag) => {
                setSelectedItem(flag.name);
              },
            });
          }}
          activeOpacity={0.5}
          style={{
            height: accordion_header_height,
            borderWidth: 1,
            borderColor: Colors.border,
            borderRadius: radius,
            paddingLeft: spacing,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Flag countryCode={typeof selectedItem != "undefined" && flag.length > 0 ? flag[0].code : "IT"} />
          <Text style={{ width: 100, marginLeft: spacing }}>{selectedItem}</Text>
        </TouchableOpacity>
      ) : (
        <Accordion ref={accordion} title={accordionTitle}>
          {Object.keys(items).map((key) => {
            const item = items[key.toString()];

            const onPress = () => {
              let toReturn: Selected = undefined;

              if (typeof selectedItem != "undefined") {
                if (typeof selectedItem == "object" && Array.isArray(selectedItem)) {
                  //is array

                  const index = selectedItem.indexOf(key.toString());

                  if (index >= 0) {
                    toReturn = selectedItem.filter((x) => x.toString() != key.toString());
                  } else {
                    toReturn = [...selectedItem, key.toString()];
                  }
                } else {
                  toReturn = key;
                }
              } else {
                if (type == "multiselect") {
                  toReturn = [key.toString()];
                } else {
                  toReturn = key.toString();
                }
              }

              if (typeof toReturn != "undefined" && toReturn.length == 0) toReturn = undefined;

              if (type != "multiselect") {
                accordion.current?.close();
              }

              if (typeof otherProps.onChange == "function") {
                otherProps.onChange(toReturn as any);
              }
              setSelectedItem(toReturn);
            };

            if (item) {
              const filled = typeof item == "object" && typeof item.type != "undefined" && item.type == "filled";

              const textColor =
                typeof item == "object" && typeof item.textColor != "undefined"
                  ? item.textColor
                  : filled
                  ? "white"
                  : Colors.text;

              return (
                <TouchableOpacity
                  key={key}
                  onPress={onPress}
                  activeOpacity={0.5}
                  style={{
                    height: accordion_header_height,
                    flexDirection: "row",
                    alignItems: "center",
                    padding: spacing,
                    backgroundColor: filled ? item.color : undefined,
                  }}
                >
                  {type == "multiselect" && <Checkbox isChecked={isSelected(key)} style={{ marginRight: spacing }} />}
                  {typeof item == "object" && (typeof item.type == "undefined" || item.type == "bullet") && (
                    <View
                      style={{
                        height: spacing,
                        width: spacing,
                        borderRadius: spacing,
                        backgroundColor: item.color,
                        marginRight: spacing,
                      }}
                    />
                  )}
                  <Text style={{ color: textColor }}>{typeof item == "object" ? item.text : item}</Text>
                </TouchableOpacity>
              );
            }
            return null;
          })}
        </Accordion>
      )}
    </View>
  );
}

export default Select;
