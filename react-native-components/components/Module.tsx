import React, { useEffect } from "react";
import { TouchableHighlight, View, TouchableOpacity } from "react-native";
import useLayout from "../hooks/useLayout";
import { ModuleProps } from "../types";
import { SearchPickerController } from "./SearchPicker";
import Text from "./Text";

function Module({ ...props }: ModuleProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();

  useEffect(() => {
    console.log("sono qui");
  }, []);

  const openPicker = () => {
    SearchPickerController.show({
      content: [
        {
          component: "list",
          endpoint: "/modules/records",
          params: {
            module_id: props.module
          },
        },
      ],
      onSuccess: () => {},
    });
  };

  return (
    <TouchableOpacity
      onPress={openPicker}
      activeOpacity={0.5}
      style={{ borderWidth: 1, borderColor: Colors.border, borderRadius: radius }}
    >
      <Text>Module</Text>
    </TouchableOpacity>
  );
}

export default Module;
