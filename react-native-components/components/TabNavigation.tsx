import React, { Children, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import useLayout from "../hooks/useLayout";
import { FlatListMethods, TabNavigationProps } from "../types";
// import FlatList from "./FlatList";
import Icon from "./Icon";
import ScreenDrawer from "./ScreenDrawer";
import Text from "./Text";
import FlatList from "./FlatList";
type TabBarProps = {
  tabs?: any;
  onTabPress?: (index: number) => void;
  selectedTab?: number;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TabBar = ({ ...props }: TabBarProps) => {
  const { spacing, icon_size, radius, Colors } = useLayout();

  // const { width } = useWindowDimensions();

  // const [shouldFlex, setShouldFlex] = useState<boolean | undefined>(undefined);
  const ref = useRef<any>(null);

  // useEffect(() => {
  //   setShouldFlex(undefined);
  // }, [JSON.stringify(props.tabs)]);

  useEffect(() => {
    calculate();
  }, [props.selectedTab]);

  const calculate = () => {
    if (typeof props.selectedTab == "undefined") return;

    ref.current.scrollToIndex({ index: props.selectedTab, animated: true });
  };

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <AnimatedTouchableOpacity
        key={index}
        // onLayout={(e) => {
        //   layouts.current = {
        //     ...layouts.current,
        //     [index]: e.nativeEvent.layout.width,
        //   };
        // }}
        entering={FadeIn}
        exiting={FadeOut}
        activeOpacity={0.5}
        onPress={() => {
          if (props.onTabPress) {
            props.onTabPress(index);
          }
        }}
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          // width: typeof shouldFlex != "undefined" && shouldFlex ? width / props.tabs.length : undefined,
          padding: spacing,
          paddingBottom: spacing * 1.5,
        }}
      >
        {typeof item.icon != "undefined" && item.icon != "" && <Icon name={item.icon} />}
        {typeof item.title != "undefined" && item.title != "" && (
          <Text
            numberOfLines={1}
            style={{
              marginLeft:
                typeof item.icon != "undefined" && item.icon != "" ? spacing * 0.5 : undefined,
            }}
          >
            {item.title}
          </Text>
        )}

        {props.selectedTab == index && (
          <Animated.View
            entering={FadeIn}
            exiting={FadeOut}
            style={{
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              height: spacing * 0.4,
              position: "absolute",
              bottom: spacing * 0.2,
            }}
          >
            <View
              style={{
                height: "100%",
                width: "60%",
                backgroundColor: Colors.primary,
                borderRadius: 10,
              }}
            />
          </Animated.View>
        )}
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View style={{ borderBottomWidth: 1, borderColor: Colors.border }}>
      <FlatList
        ref={ref}
        data={props.tabs}
        renderItem={renderItem}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        // canRefresh={false}
        // onContentSizeChange={(w) => {
        //   if (w == width) return setShouldFlex(true);

        //   if (w < width) {
        //     setShouldFlex(true);
        //   } else {
        //     setShouldFlex(false);
        //   }
        // }}
      />
    </View>
  );
};

function TabNavigation({ ...props }: TabNavigationProps) {
  const ref = useRef<any>(null);
  const { width } = useWindowDimensions();
  const selectedRef = useRef<number>(0);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  const [canContinue, setCanContinue] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (typeof canContinue != "undefined") {
      let toReturn = true;

      Object.keys(canContinue).map((key) => {
        const actual = canContinue[key];

        if (actual == false) toReturn = false;
      });

      if (typeof props.onChange != "undefined") {
        props.onChange({ canContinue: toReturn });
      }
    }
  }, [JSON.stringify(canContinue)]);

  const onTabPress = useCallback((tab: any) => {
    setSelectedTab(tab);

    ref.current.scrollToIndex({ index: tab, animated: true });
  }, []);

  const getItemLayout = useCallback((data: any, index: any) => {
    return {
      length: width,
      offset: width * index,
      index,
    };
  }, []);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    selectedRef.current = Math.round(e.nativeEvent.contentOffset.x / width);
  }, []);

  const onMomentumScrollEnd = useCallback(() => {
    setSelectedTab(selectedRef.current);
  }, []);

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    const data =
      typeof props.data != "undefined" && typeof props.data[item.id] != "undefined"
        ? props.data[item.id]
        : {};

    return (
      <View style={{ width }}>
        <ScreenDrawer
          data={data}
          setData={props.setData}
          path={item.path}
          content={item.content}
          onChange={(details) => {
            setCanContinue((prevState) => {
              let toReturn = {
                ...prevState,
                [item.id]: details.canContinue,
              };

              return toReturn;
            });
          }}
        />
      </View>
    );
  };

  if (props.tabs.length == 0) return null;

  return (
    <View style={{ flex: 1 }}>
      <TabBar tabs={props.tabs} selectedTab={selectedTab} onTabPress={onTabPress} />
      <FlatList
        ref={ref}
        data={props.tabs}
        bounces={false}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
        initialNumToRender={1}
        horizontal
        canRefresh={false}
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}

export default TabNavigation;
