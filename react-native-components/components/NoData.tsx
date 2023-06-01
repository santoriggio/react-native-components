import React, { useMemo } from "react";
import { RefreshControl, ScrollView } from "react-native";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import { NoDataProps } from "../types";
import Icon from "./Icon";
import ScreenDrawer from "./ScreenDrawer";
import Text from "./Text";

function NoData({ ...props }: NoDataProps) {
  const { spacing } = useLayout();

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
      <Text bold size="xl" style={{ textAlign: "center", paddingHorizontal: spacing, marginBottom: spacing }}>
        {props.title ? props.title : "Ancora nulla"}
      </Text>
      <Text style={{ textAlign: "center", paddingHorizontal: spacing }}>
        {props.subtitle ? props.subtitle : "Non esiste ancora nulla in questa sezione"}
      </Text>
      {typeof props.content != "undefined" && props.content.length > 0 && (
        <ScreenDrawer content={props.content} scrollEnabled={false} hasScroll={false} />
      )}
    </ScrollView>
  );
}

export default NoData;
