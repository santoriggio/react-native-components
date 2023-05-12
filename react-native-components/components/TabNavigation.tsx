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
import Animated, { FadeIn, FadeOut, Layout, round } from "react-native-reanimated";
import { setPath } from "react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import { FlatListMethods, TabNavigationProps } from "../types";
import FlatList from "./FlatList";
import Icon from "./Icon";
import ScreenDrawer from "./ScreenDrawer";
import Text from "./Text";

type TabBarProps = {
  tabs?: any;
  onTabPress?: (index: number) => void;
  selectedTab?: number;
};

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const TabBar = ({ ...props }: TabBarProps) => {
  // const refs = useRef<{ [key: string]: View | null }>({});
  const { spacing, icon_size, radius, Colors } = useLayout();
  // const [viewWidth, setViewWidth] = useState<number>(0);
  const { width } = useWindowDimensions();

  // const [viewsSize, setViewsSize] = useState<any>({});

  const [shouldFlex, setShouldFlex] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setShouldFlex(undefined);
  }, [JSON.stringify(props.tabs)]);

  //   useEffect(() => {
  //     let partial = 0;
  //     Object.keys(viewsSize).forEach((key) => {
  //       const data = viewsSize[key];

  //       console.log(data);

  //       partial = partial + data.width;
  //     });

  //     setViewWidth(partial);
  //   }, [JSON.stringify(viewsSize)]);

  // const onLayout = useCallback((e: LayoutChangeEvent, index: any) => {
  //   const layout = e.nativeEvent.layout;

  //   // refs.current = {
  //   //   ...refs.current,
  //   //   [index]: layout,
  //   // };

  //   setViewsSize((prevState: any) => {
  //     //   const actualLayout = prevState[index];

  //     //   if (typeof actualLayout != "undefined") {
  //     //     if (Math.round(actualLayout.width) == Math.round(layout.width)) {
  //     //       return prevState;
  //     //     }

  //     //     // const seg = Math.round(width / props.tabs.length);

  //     //     // if (seg == Math.round(actualLayout.width)) {
  //     //     //   return prevState;
  //     //     // }
  //     //   }

  //     return {
  //       ...prevState,
  //       [index]: layout,
  //     };
  //   });
  // }, []);

  //   Object.values(viewsSize).forEach((x) => {
  //     console.log(x.width);
  //   });

  const renderItem: ListRenderItem<any> = ({ item, index }) => {

    return (
      <AnimatedTouchableOpacity
        key={index}
        entering={FadeIn}
        exiting={FadeOut}
        //layout={Layout.mass(1)}
        // onLayout={(e) => onLayout(e, index)}
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
          width: typeof shouldFlex != "undefined" && shouldFlex ? width / props.tabs.length : undefined,
          padding: spacing,
          paddingBottom: spacing * 1.5,
        }}
      >
        {typeof item.icon != "undefined" && item.icon != "" && <Icon name={item.icon} />}
        {typeof item.title != "undefined" && item.title != "" && (
          <Text
            numberOfLines={1}
            style={{
              marginLeft: typeof item.icon != "undefined" && item.icon != "" ? spacing * 0.5 : undefined,
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
            <View style={{ height: "100%", width: "60%", backgroundColor: Colors.primary, borderRadius: 10 }} />
          </Animated.View>
        )}
      </AnimatedTouchableOpacity>
    );
  };

  return (
    <View style={{ borderBottomWidth: 1, borderColor: Colors.border }}>
      <FlatList
        data={props.tabs}
        renderItem={renderItem}
        horizontal
        bounces={false}
        showsHorizontalScrollIndicator={false}
        overScrollMode="never"
        // canRefresh={false}
        onContentSizeChange={(w) => {
          if (w == width) return setShouldFlex(true);

          if (w < width) {
            setShouldFlex(true);
          } else {
            setShouldFlex(false);
          }
        }}
      />
    </View>
  );
};

// const TabNavigationScreen: any = memo(({ ...props }: any) => {
//   const { width } = useWindowDimensions();
//   return <View style={{ width, flex: 1 }}>{props.children}</View>;
// });

function TabNavigation({ ...props }: TabNavigationProps) {
  const ref = useRef<any>(null);
  const { width } = useWindowDimensions();
  const selectedRef = useRef<number>(0);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [renderedTabs, setRenderedTabs] = useState<number>(1);

  const onTabPress = useCallback((tab: any) => {
    setSelectedTab(tab);
    //@ts-ignore


    ref.current.scrollToIndex({ index: tab, animated: true });
  }, []);

  // useEffect(() => {
  //   if (selectedTab >= renderedTabs) {
  //     setRenderedTabs(selectedTab);
  //   }
  // }, [selectedTab]);

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
      typeof props.data != "undefined" && typeof props.data[item.id] != "undefined" ? props.data[item.id] : {};

    return (
      <View style={{ flex: 1, width }}>
        <ScreenDrawer data={data} setData={props.setData} path={item.path} content={item.content} />
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
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={renderItem}
        initialNumToRender={1}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        getItemLayout={getItemLayout}
        // canRefresh={false}
      />
    </View>
  );
}

export default TabNavigation;
