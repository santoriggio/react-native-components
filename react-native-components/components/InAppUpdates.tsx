import React, { forwardRef, useImperativeHandle, useMemo, useState } from "react";
import { Linking, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut, useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useLayout from "../hooks/useLayout";
import Header from "./Header";
import ScrollView from "./ScrollView";
import Text from "./Text";
import Button from "./Button";
import { useEffect } from "react";
import Image from "./Image";

type Props = {
  title?: string;
};

type State = {};

let InAppUpdates: Methods = {
  show: () => {},
  hide: () => {},
};

type Methods = {
  show: () => void;
  hide: () => void;
};

const InAppUpdatesProvider = ({ ...props }: Props) => {
  const { Colors, spacing, icon_size, radius } = useLayout();
  const { top } = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  // useImperativeHandle(ref, () => ({
  //   show: showUpdates,
  // }));

  useEffect(() => {
    InAppUpdates = {
      show: () => showUpdates(),
      hide: () => hideUpdates(),
    };
  }, []);

  const showUpdates = () => {
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
      <Header
        left={headerLeft}
        scrollY={scrollY}
        title="Nuovo aggiornamento"
        largeTitle
        onChangeSize={(size) => setHeaderHeight(size)}
      />
      {headerHeight > 0 && (
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
                V2.1.13
              </Text>
            </View>
          </View>
          <Text>
            Adipisicing non exercitation occaecat ad velit amet sit non duis.Ut sint sunt ut ad dolore.Sunt elit eiusmod
            non excepteur deserunt. Nostrud et commodo occaecat veniam velit excepteur exercitation laboris velit amet
            ex velit. Nulla aute in cupidatat laborum et sint ipsum excepteur et culpa excepteur laboris mollit tempor.
            Consectetur ea sunt anim non officia duis aute velit nostrud dolor non mollit commodo. Commodo qui dolore
            cupidatat officia elit commodo enim. Culpa magna culpa duis aliqua dolor dolor eu dolore Lorem minim magna.
          </Text>
          <Button
            title="Installa aggiornamento"
            onPress={() => {
              const link = "http://play.google.com/store/apps/details?id=ms.framework360.app";

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
