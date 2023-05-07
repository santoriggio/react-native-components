import React, { useCallback, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { acc, RotateInUpLeft, ZoomInLeft } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import { SelectProps } from "../types";
import Accordion, { AccordionMethods } from "./Accordion";
import Checkbox from "./Checkbox";
import Text from "./Text";

type Selected = string | undefined;

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

  const isSelected = useCallback(
    (key: string) => {
      let toReturn: boolean = false;
      if (typeof selectedItem != "undefined") {
        const array = selectedItem.split(",");

        if (array.indexOf(key) >= 0) {
          toReturn = true;
        }
      }

      return toReturn;
    },
    [JSON.stringify(selectedItem)]
  );

  const accordionTitle = useMemo(() => {
    let toReturn: string = placeholder;

    if (typeof selectedItem != "undefined") {
      let array = selectedItem.split(",");
      let formatted: string[] = [];
      array.forEach((str, id) => {
        const item = items[str];

        if (typeof item == "object") {
          formatted.push(item.text);
        } else {
          formatted.push(item);
        }
      });

      toReturn = formatted.join(", ");
    }

    return toReturn;
  }, [JSON.stringify(selectedItem)]);

  return (
    <View style={{ marginBottom: spacing }}>
      {typeof title != "undefined" && title != "" && (
        <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: spacing }}>
          <Text bold>{title}</Text>
          {(required == true || required == 1) && <Text style={{ color: Colors.danger }}> *</Text>}
        </View>
      )}
      <Accordion ref={accordion} title={accordionTitle}>
        {Object.keys(items).map((key) => {
          const item = items[key];

          const onPress = () => {
            let toReturn: Selected = key.toString();

            if (type == "multiselect" && typeof selectedItem != "undefined") {
              let array = selectedItem.split(",");

              const index = array.indexOf(key);

              if (index >= 0) {
                //exist, need to remove
                array = array.filter((x) => x != key);
              } else {
                //don't exist
                array.push(key);
              }

              toReturn = array.join(",");
            }

            if (toReturn.length == 0) toReturn = undefined;

            if (type != "multiselect") {
              accordion.current?.close();
            }

            if (otherProps.onChange) {
              otherProps.onChange(toReturn);
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
    </View>
  );
}

export default Select;
