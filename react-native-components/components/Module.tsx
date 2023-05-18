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
  global = 0,
  value,
  onChange = () => {},
  module = "contenuti_media",
  placeholder = "Aggiungi",
  ...props
}: ModuleProps & { value: any; onChange?: (newId: any) => void }) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    if (typeof value != "undefined" && value != "") {
      getData();
    }
  }, [JSON.stringify(value)]);

  const getData = async () => {
    //get record from id

    if (module == "contenuti_media") {
      const apiResult = await sendApiRequest("/media/format", { files: value, global });

      if (typeof apiResult.error != "undefined") {
        return;
      }

      const format = apiResult.data;

      setData(
        format.map((x: any) => {
          if (typeof x.format != "undefined") {
            return x.format;
          }

          return x;
        })
      );
      return;
    }

    const apiResult = await sendApiRequest("/modules/records", { module_id: module, id: value });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    const record = apiResult.data.data;

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
            params: { global },
          },
        },
      ],
      onSuccess: (selected, id) => {
        if (module == "contenuti_media") {
          onChange(
            selected.map((x) => {
              if (typeof x.return != "undefined" && typeof x.return.data != "undefined") {
                return x.return.data;
              }
            })
          );
        } else if (limit == 1) {
          onChange(id[0]);
        } else {
          onChange(id);
        }

        setData(
          selected.map((x) => {
            if (typeof x.return != "undefined" && typeof x.return.format != "undefined") {
              return x.return.format;
            }
            return x;
          })
        );
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
      {typeof data != "undefined" && data != null && Object.keys(data).length > 0 ? (
        data.map((x, id) => {
          if (typeof x.content != "undefined") {
            return <ListItem key={id} {...x} onPress={openPicker} selected={undefined} />;
          }
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
