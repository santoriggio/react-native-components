import { BlurView } from "expo-blur";
import React, { useEffect, useRef, useState } from "react";

import { LayoutChangeEvent, TouchableOpacity, useWindowDimensions, View, ViewStyle } from "react-native";

import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  Layout,
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import useLayout from "../hooks/useLayout";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import Icon from "./Icon";
import ScrollView from "./ScrollView";
import { SearchPickerController } from "./SearchPicker";
import Text from "./Text";
import TextInput from "./TextInput";

interface IHeader {
  left?: JSX.Element;
  right?: JSX.Element;
  title?: string;
  subtitle?: string;
  borderBottom?: boolean;
  onPressTitle?: () => void;
  scrollY?: any;
  largeTitle?: boolean;
  tintColor?: string;
  containerStyle?: ViewStyle;
  searchBarOptions?: {
    placeholder?: string;
    onChangeText: (text: string) => void;
    filters?: ScreenDrawerComponent[];
    selectedFilters?: any;
    setSelectedFilters?: any;
    style?: ViewStyle;
  };
  onChangeSize?: (x: any) => void;
}

interface IHeaderMethods {}

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function Header({ ...props }: IHeader) {
  // const ref = useRef<Animated.View>(null);
  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { spacing, radius, icon_size, Colors, fontSize } = useLayout();
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const progress = useDerivedValue(() => {
    return typeof props.scrollY != "undefined" ? props.scrollY.value : 0;
  });

  useEffect(() => {
    if (props.onChangeSize) {
      props.onChangeSize(headerHeight);
    }
  }, [headerHeight]);

  const handleHeaderHeight = (e: LayoutChangeEvent) => {
    if (headerHeight == 0) {
      setHeaderHeight(e.nativeEvent.layout.height);
    }
  };

  const rContainer = useAnimatedStyle(() => {
    const borderColor = interpolateColor(progress.value, [0, 10], [Colors.background + "00", Colors.border]);
    const backgroundColor = interpolateColor(progress.value, [0, 10], [Colors.background + "00", Colors.background]);

    const height =
      headerHeight > 0
        ? interpolate(
            progress.value,
            [-headerHeight, 0, headerHeight],
            [headerHeight * 2, headerHeight, headerHeight - spacing * 4],
            {
              extrapolateRight: Extrapolate.CLAMP,
            }
          )
        : undefined;
    return {
      borderColor,
      //backgroundColor,
      height,
    };
  });

  const rLargeTitle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, spacing * 0.8], [1, 0]);
    const scale = interpolate(progress.value, [0, -headerHeight * 0.5], [1, 1.02], Extrapolate.CLAMP);
    const translateX = interpolate(progress.value, [0, -headerHeight * 0.5], [0, spacing * 0.4], Extrapolate.CLAMP);
    const translateY = interpolate(progress.value, [0, headerHeight], [0, -spacing * 3], Extrapolate.CLAMP);
    return {
      transform: [{ scale }, { translateX }, { translateY }],
      opacity,
    };
  });

  const rTitle = useAnimatedStyle(() => {
    const translateY = interpolate(progress.value, [0, headerHeight], [10, 0], Extrapolate.CLAMP);

    const opacity = interpolate(progress.value, [0, headerHeight], [0, 1]);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  const AnimatedBlurViewProps = useAnimatedProps(() => {
    const intensity = interpolate(progress.value, [0, headerHeight * 0.5], [0, 100], Extrapolate.CLAMP);

    return {
      intensity,
    };
  });

  return (
    <AnimatedBlurView
      onLayout={handleHeaderHeight}
      animatedProps={AnimatedBlurViewProps}
      tint={Colors.isDark ? "dark" : "light"}
      style={[
        props.scrollY ? rContainer : undefined,
        {
          zIndex: 10,
          paddingTop: spacing + top,
          paddingBottom: spacing,
          justifyContent: "flex-end",
          backgroundColor:
            typeof props.tintColor != "undefined" ? props.tintColor : props.scrollY ? undefined : Colors.background,
          borderBottomWidth: typeof props.borderBottom == "undefined" || props.borderBottom ? 1 : 0,
          borderColor: typeof props.scrollY != "undefined" ? undefined : Colors.border,
          position: typeof props.scrollY != "undefined" ? "absolute" : "relative",
          top: 0,
          left: 0,
          right: 0,
          ...props.containerStyle,
        },
      ]}
    >
      <View
        style={{
          position: typeof props.largeTitle != "undefined" && props.largeTitle == true ? "absolute" : "relative",
          top: typeof props.largeTitle != "undefined" && props.largeTitle == true ? top : undefined,
          height: spacing * 4,
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {props.left && (
          <View style={{ width: "70%", position: "absolute", left: 0, flexDirection: "row", alignItems: "center" }}>
            {props.left}
            {(typeof props.largeTitle == "undefined" || props.largeTitle == false) &&
              typeof props.title != "undefined" &&
              props.title.trim() != "" && (
                <Text size="2xl" numberOfLines={1}>
                  {props.title}
                </Text>
              )}
          </View>
        )}

        {typeof props.left == "undefined" && (typeof props.largeTitle == "undefined" || props.largeTitle == false) && (
          <View style={{ marginLeft: spacing }}>
            <Text size="2xl" numberOfLines={1}>
              {props.title}
            </Text>
          </View>
        )}

        {typeof props.largeTitle != "undefined" && props.largeTitle == true && (
          <Animated.View style={[rTitle]}>
            <Text size="l" numberOfLines={1} bold>
              {props.title}
            </Text>
          </Animated.View>
        )}

        {props.right && <View style={{ position: "absolute", right: 0 }}>{props.right}</View>}
      </View>

      {props.largeTitle && (
        <Animated.View style={[rLargeTitle, { marginLeft: spacing, marginTop: spacing * 3 }]}>
          <Text size="6xl" numberOfLines={1} bold>
            {props.title}
          </Text>
        </Animated.View>
      )}

      {typeof props.searchBarOptions !== "undefined" && (
        <View
          style={{
            height: spacing * 3.2,
            paddingHorizontal: spacing,
            paddingRight: typeof props.searchBarOptions.filters !== "undefined" ? 0 : spacing,
            flexDirection: "row",
            alignItems: "center",
            marginTop: spacing * 0.5,
            ...props.searchBarOptions.style,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: spacing / 2,
              height: "100%",
              borderRadius: radius * 0.8,
              paddingLeft: spacing,
              overflow: "hidden",
              flex: 1,
              backgroundColor: Colors.card,
            }}
          >
            <Icon family="Ionicons" name="search" color={Colors.gray} />
            <TextInput
              placeholder={
                typeof props.searchBarOptions.placeholder !== "undefined" ? props.searchBarOptions.placeholder : "Cerca"
              }
              onChangeText={(text) => props.searchBarOptions?.onChangeText(text)}
              style={{
                flex: 1,
                marginLeft: spacing,
                marginRight: -spacing / 2,
              }}
              size="l"
              placeholderTextColor={Colors.gray}
              clearButtonMode="while-editing"
              cursorColor={Colors.primary}
              selectionColor={Colors.primary}
              autoCorrect={false}
            />
          </View>
          {typeof props.searchBarOptions.filters !== "undefined" && (
            <TouchableOpacity
              onPress={() => {
                

                SearchPickerController.show({
                  data: props.searchBarOptions?.selectedFilters,
                  content: props.searchBarOptions?.filters,
                  footer: [
                    {
                      component: "button",
                      title: "Applica filtri",
                      action: () => {
                        const filt: any = SearchPickerController.getData();

                        if (typeof filt != "undefined" && Object.keys(filt).length > 0) {
                          props.searchBarOptions?.setSelectedFilters(filt);
                        }

                        SearchPickerController.hide();
                      },
                    },
                  ],
                });
                // setFilterVisible((prevState) => !prevState);
              }}
              activeOpacity={0.8}
              hitSlop={{
                top: spacing,
                bottom: spacing,
              }}
              style={{ width: spacing * 4, justifyContent: "center", alignItems: "center" }}
            >
              <Icon family="Ionicons" name="filter" size={icon_size * 1.2} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {typeof props.searchBarOptions != "undefined" && typeof props.searchBarOptions.selectedFilters != "undefined" && (
        <View style={{ marginTop: spacing }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: spacing }}>
            {Object.keys(props.searchBarOptions.selectedFilters).map((key) => {
              const options = props.searchBarOptions?.selectedFilters[key];

              const groupData = props.searchBarOptions?.filters?.filter(x=>x.id ==key )[0]

 

              if (typeof options != "undefined" && Array.isArray(options) && options.length > 0)
              return options.map((fil) => {
                const value= groupData.items[fil]

                  return (
                    <View
                      style={{
                        borderRadius: radius * 0.7,
                        backgroundColor: Colors.primary,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: spacing * 0.5,
                        paddingVertical: spacing * 0.2,
                        marginRight: spacing,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          props.searchBarOptions?.setSelectedFilters((prevState) => {
                            let actual = prevState[key];

                            actual = actual.filter((x) => x != fil);

                            if (actual.length == 0) {
                              let form = { ...prevState };
                              delete form[key];
                              return form;
                            }

                            return {
                              ...prevState,
                              [key]: actual,
                            };
                          });
                        }}
                        activeOpacity={0.5}
                        hitSlop={{
                          top: spacing,
                          left: spacing,
                          right: spacing,
                          bottom: spacing,
                        }}
                        style={{ marginRight: 3 }}
                      >
                        <Icon name="close" color={"white"} />
                      </TouchableOpacity>
                      <Text style={{ color: "white" }}>{groupData.title}: {value}</Text>
                    </View>
                  );
                });
            })}
          </ScrollView>
        </View>
      )}
    </AnimatedBlurView>
  );
}

export default Header;
export { IHeader };
