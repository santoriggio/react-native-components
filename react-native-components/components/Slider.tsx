import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ListRenderItem,
} from "react-native";
import useLayout from "../hooks/useLayout";
import Text from "./Text";
import { SliderProps } from "../types";

export default function Slider<T>(props: SliderProps<T>) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const selectedRef = useRef<number>(0);
  const [page, setPage] = useState<number>(0);

  const [sliderWidth, setSliderWidth] = useState<number>(0);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      selectedRef.current = Math.round(e.nativeEvent.contentOffset.x / sliderWidth);
    },
    [sliderWidth]
  );

  const onMomentumScrollEnd = useCallback(() => {
    setPage(selectedRef.current);
  }, []);

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <View
        style={{
          height: typeof props.height != "undefined" ? props.height : undefined,
          width: sliderWidth - 2,
        }}
      >
        {props.renderItem(item, index)}
      </View>
    );
  };

  return (
    <View
      onLayout={(e) => {
        setSliderWidth(e.nativeEvent.layout.width);
      }}
      style={{
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: radius,
        overflow: "hidden",
        ...props.style,
      }}
    >
      {props.isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={props.data}
          renderItem={renderItem}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
        />
      )}
      {typeof props.data !== "undefined" && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            backgroundColor: "transparent",
            padding: spacing / 4,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          {Array.from(Array(props.data.length).keys()).map((key, index) => {
            return (
              <View
                key={index}
                style={{
                  height: spacing * 0.8,
                  width: spacing * 0.8,
                  borderRadius: spacing * 0.8,
                  backgroundColor: page === index ? Colors.primary : Colors.gray,
                  margin: spacing / 4,
                }}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}
