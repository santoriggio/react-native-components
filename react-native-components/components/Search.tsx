import React, { useEffect, useState } from "react";
import { TouchableHighlight, View, TouchableOpacity } from "react-native";
import sendApiRequest from "../functions/sendApiRequest";
import useLayout from "../hooks/useLayout";
import { ModuleProps, SearchProps } from "../types";
import Button from "./Button";
import Icon from "./Icon";
import ListItem from "./ListItem";
import { SearchPickerController } from "./SearchPicker";
import Text from "./Text";

import triggerAction from "../functions/triggerAction";
function Search({
  required = false,
  limit = 1,
  value,
  onChange = () => {},
  type,
  placeholder = "Aggiungi",
  ...props
}: SearchProps & { value: any; onChange?: (newId: any) => void }) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [data, setData] = useState<any[] | undefined>(undefined);

  useEffect(() => {
    if (
      typeof value != "undefined" &&
      value != "" &&
      JSON.stringify(value) != JSON.stringify(data)
    ) {
      getData();
    }
  }, [JSON.stringify(value)]);

  const getData = async () => {
    //get record from id
    const apiResult = await sendApiRequest("/search/list", {
      type,
      id: value,
      params: props.params,
    });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    const record = apiResult.data;

    setData(record);
  };

  const openPicker = () => {
    SearchPickerController.show({
      limit,
      preselected: data,
      content: [
        {
          component: "list",
          endpoint: "/search/list",
          path: "data",
          params: {
            type,
            ...props.params,
          },
        },
      ],
      onSuccess: (selected: any, id: any) => {
        if (limit == 1) {
          onChange(id[0]);
        } else {
          onChange(id);
        }

        setData(
          selected.map((x) => {
            if (typeof x.return != "undefined" && typeof x.return.format != "undefined") {
              return x.return.format;
            }

            if (typeof x.format != "undefined") {
              return x.format;
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
            return (
              <ListItem
                key={x.id}
                {...x}
                onPress={openPicker}
                selected={undefined}
                screenDrawerStyle={{
                  borderRadius: radius,
                  borderWidth: 1,
                  marginTop: 0,
                  marginBottom: spacing,
                }}
                right={
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        if (limit == 1) {
                          setData(undefined);
                          onChange(undefined);
                          return;
                        }

                        setData((prevState) => {
                          if (typeof prevState != "undefined") {
                            return prevState.filter((z) => z.id != x.id);
                          }
                          return prevState;
                        });

                     

                        const formatted = value.filter((z: any) => z != x.id)
                                              
                        onChange(formatted);
                      }}
                      activeOpacity={0.5}
                      style={{ padding: spacing }}
                    >
                      <Icon name="trash-outline" color={Colors.danger} size={icon_size} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={openPicker}
                      activeOpacity={0.5}
                      style={{ padding: spacing }}
                    >
                      <Icon name="swap" size={icon_size} />
                    </TouchableOpacity>
                  </View>
                }
              />
            );
          }
        })
      ) : (
        <View>
          <Button
            title={placeholder}
            icon={props.icon}
            role="info"
            type="tinted"
            action={openPicker}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default Search;
