import React, { useEffect, useState } from "react";
import { TouchableHighlight, View, TouchableOpacity } from "react-native";
import sendApiRequest from "../functions/sendApiRequest";
import useLayout from "../hooks/useLayout";
import { ModuleProps } from "../types";
import Button from "./Button";
import Icon from "./Icon";
import ListItem from "./ListItem";
import { SearchPickerController } from "./SearchPicker";
import Text from "./Text";

import triggerAction from "../functions/triggerAction";
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

  const [imagesFormatted, setImagesFormatted] = useState<any>(undefined);

  useEffect(() => {
    if (module == "contenuti_media" && typeof value != "undefined" && value != "") {
      setImagesFormatted(value);
    }

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

    if (module == "contenuti_media") {
      const apiResult = await sendApiRequest("/media/format", { files: value, global });

      if (typeof apiResult.error != "undefined") {
        return;
      }

      const format = apiResult.data;

      setData(
        format.map((x: any) => {
          if (typeof x.return != "undefined" && typeof x.return.format != "undefined") {
            return x.return.format;
          }

          if (typeof x.format != "undefined") {
            return x.format;
          }

          return x;
        })
      );
      return;
    }

    const apiResult = await sendApiRequest("/modules/records", {
      module_id: module,
      id: value,
      params: { global, ...props.params },
    });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    const record = apiResult.data.data;

    record.forEach((x) => {
      if (typeof x.action != "undefined") {
        triggerAction(x.action);
      }
    });

    setData(record);
  };

  const openPicker = () => {
    SearchPickerController.show({
      ...props,
      type: "modulepicker",
      preselected:
        typeof data != "undefined"
          ? data.map((x, id) => {
              return {
                ...x,
                data: typeof value == "string" ? JSON.parse(value)[id] : value[id],
                format: {
                  ...x,
                },
              };
            })
          : [],
      module_id: module,
      global,
      limit,
      content: [
        {
          component: "list",
          endpoint: "/modules/records",
          path: "data/data",
          params: {
            module_id: module,
            params: { global, ...props.params },
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

              if (typeof x.data != "undefined") {
                return x.data;
              }

              return x;
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
                  <View style={{}}>
                    <TouchableOpacity
                      onPress={() => {
                        if (limit == 1) {
                          setData(undefined);
                          onChange(undefined);
                          return;
                        }

                        if (module == "contenuti_media") {
                          if (typeof imagesFormatted != "undefined") {
                            if (typeof onChange != "undefined") {
                              let filtered: string[] = [...imagesFormatted];

                              if (typeof imagesFormatted == "string") {
                                filtered = [...JSON.parse(imagesFormatted)];
                              }

                              filtered.splice(id, 1);
                              onChange(filtered);
                            }
                          }
                        } else {
                          onChange(data.map((s) => s.id));
                        }

                        setData((prevState) => {
                          if (typeof prevState != "undefined") {
                            return prevState.filter((z) => z.id != x.id);
                          }
                          return prevState;
                        });
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

export default Module;
