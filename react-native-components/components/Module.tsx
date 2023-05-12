import React, { useEffect, useState } from "react";
import { TouchableHighlight, View, TouchableOpacity } from "react-native";
import sendApiRequest from "../functions/sendApiRequest";
import useLayout from "../hooks/useLayout";
import { ModuleProps } from "../types";
import Button from "./Button";
import ListItem from "./ListItem";
import { SearchPickerController } from "./SearchPicker";
import Text from "./Text";

function Module({
  required = false,
  limit = 1,
  value,
  onChange = () => {},
  module = "contenuti_media",
  placeholder = "Aggiungi",
  ...props
}: ModuleProps & { value: any; onChange?: (newId: any) => void }) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    if (typeof value != "undefined" && typeof data != "undefined" && value != data.id) {
      getData();
    }
  }, [value]);

  const getData = async () => {
    //get record from id

    const apiResult = await sendApiRequest("/modules/records", { module_id: props.module, id: value });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    const record = apiResult.data.data[0];

    setData(record);
  };

  const openPicker = () => {
    SearchPickerController.show({
      type: "modulepicker",
      module_id: module,
      limit,
      content: [
        {
          component: "list",
          endpoint: "/modules/records",
          path: "data/data",
          params: {
            module_id: module,
          },
        },
      ],
      onSuccess: (selected, id) => {
        onChange(id[0]);
        setData(selected);
      },
    });
  };

  return (
    <TouchableOpacity onPress={openPicker} activeOpacity={0.5}>
      {typeof props.title != "undefined" && (
        <View style={{ marginBottom: spacing, flexDirection: "row", alignItems: "center" }}>
          <Text bold numberOfLines={1}>
            {props.title}
          </Text>
          {(required == true || required == 1) && <Text style={{ color: Colors.danger }}> *</Text>}
        </View>
      )}
      {typeof data != "undefined" ? (
        data.map((x, id) => {
          return <ListItem key={id} {...x} onPress={openPicker} selected={undefined} />;
        })
      ) : (
        <View>
          <Button title={placeholder} icon={props.icon} role="info" type="tinted" action={openPicker} />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Module;
