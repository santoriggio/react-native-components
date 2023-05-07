import React, { useMemo } from "react";
import { RefreshControl, ScrollView } from "react-native";
import keyExist from "../functions/keyExist";
import { NoDataProps } from "../types";
import Icon from "./Icon";
import Text from "./Text";

function NoData({ ...props }: NoDataProps) {
  const canRefresh = useMemo(() => {
    if (typeof props.refreshing != "undefined" && typeof props.onRefresh != "undefined") return true;
    return false;
  }, [props.refreshing, JSON.stringify(props.onRefresh)]);

  return (
    <ScrollView
      refreshControl={
        canRefresh ? (
          <RefreshControl refreshing={props.refreshing ? props.refreshing : false} onRefresh={props.onRefresh} />
        ) : undefined
      }
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        ...props.contentContainerStyle,
      }}
      {...props}
    >
      {typeof keyExist(props.icon) != "undefined" && props.icon != "" && (
        <Icon name={props.icon} size={100} style={{ marginBottom: 30 }} />
      )}
      <Text>{props.title ? props.title : "Ancora nulla"}</Text>
      <Text>{props.subtitle ? props.subtitle : "Non esiste ancora nulla in questa sezione"}</Text>
    </ScrollView>
  );
}

export default NoData;
