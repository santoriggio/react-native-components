import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useLayout from "../hooks/useLayout";
import Header from "./Header";
import ScrollView from "./ScrollView";
import Text from "./Text";
import Button from "./Button";
import { useEffect } from "react";
import Image from "./Image";
import { NetInfoCellularGeneration } from "@react-native-community/netinfo";

type Props = {
  title?: string;
};

type State = {};

let InAppUpdates: Methods = {
  show: (info) => {},
  hide: () => {},
};

type Methods = {
  show: (info: any) => void;
  hide: () => void;
};

const InAppUpdatesProvider = ({ ...props }: Props) => {
  const { Colors, spacing, icon_size, radius } = useLayout();
  const { top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [options, setOptions] = useState<any>({});
  // useImperativeHandle(ref, () => ({
  //   show: showUpdates,
  // }));

  useEffect(() => {
    InAppUpdates = {
      show: (info) => showUpdates(info),
      hide: () => hideUpdates(),
    };
  }, []);

  const showUpdates = (info: any) => {
    setOptions(info);
    setIsVisible(true);
  };

  const hideUpdates = () => {
    setIsVisible(false);
  };

  const headerLeft = useMemo(() => {
    return undefined;
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={{ ...StyleSheet.absoluteFillObject, zIndex: 10001, backgroundColor: Colors.background }}
    >
      <Header left={headerLeft} title="Nuovo aggiornamento" />

      {typeof options != "undefined" && (
        <ScrollView
          scrollY={scrollY}
          contentContainerStyle={{
            paddingTop: headerHeight + spacing,
            padding: spacing,
          }}
          scrollIndicatorInsets={{ top: headerHeight - top }}
        >
          <View style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: spacing }}>
            <Image
              // source={require("../../assets/icon.png")}
              style={{
                height: spacing * 6,
                width: spacing * 6,
                borderRadius: radius,
              }}
            />
            <View style={{ marginLeft: spacing }}>
              <Text size="l" bold>
                V{options.message.version}
              </Text>
            </View>
          </View>
          <Text>{options.message.description}</Text>
          <Button
            title="Installa aggiornamento"
            action={() => {
              const link =
                Platform.OS == "ios"
                  ? "https://apps.apple.com/it/app/id1613982917"
                  : "http://play.google.com/store/apps/details?id=ms.framework360.app";

              Linking.openURL(link);
            }}
            style={{ marginTop: spacing }}
          />
        </ScrollView>
      )}
    </Animated.View>
  );
};

export { InAppUpdates };
export default InAppUpdatesProvider;
