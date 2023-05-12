import React, { useMemo, useState } from "react";
import { TouchableOpacity, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import keyExist from "../functions/keyExist";
import triggerAction from "../functions/triggerAction";
import useLayout from "../hooks/useLayout";
import { GraphProps } from "../types";
import Text from "./Text";

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

function Graph(props: GraphProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();

  const graphHeight = spacing * 20;
  const { width } = useWindowDimensions();
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);

  const getCanvasSize = (e: any) => {
    setCanvasHeight(e.nativeEvent.layout.height);
    setCanvasWidth(e.nativeEvent.layout.width);
  };

  const labels = useMemo(() => {
    let newArray: any = [];

    const array = props.labels;

    if (array.length === 8) return array.slice(2, array.length - 1); //Ritorna array se la lunghezza è 7

    const length = array.length;
    const divisor = Math.floor(length / 5);

    array.map((x: any, y: any) => {
      if (y === 0 || y % divisor === 0) {
        newArray.push(x);
      }
    });

    return newArray;
  }, [JSON.stringify(props.labels)]);

  const datasets = useMemo(() => {
    let result: any[] = [];

    if (typeof props.datasets !== "undefined") {
      props.datasets.map((dataset) => {
        if (typeof dataset.data !== "undefined") {
          result = [...result, ...dataset.data];
        }
      });
    }

    return result;
  }, [JSON.stringify(props.datasets)]);

  const range = useMemo(() => {
    let obj = {
      max: Math.max(...datasets),
      min: Math.min(...datasets),
    };

    return obj;
  }, [JSON.stringify(datasets)]);

  const values = useMemo(() => {
    const max = range.max;

    if (max > 3) {
      const division = max > 0 ? Math.floor(max / 4) : 0;

      return [division * 1, division * 2, division * 3].reverse();
    } else if (max > 0) {
      return Array.from(Array(max).keys()).reverse();
    } else {
      return [0, 0, 0];
    }
  }, [JSON.stringify(datasets)]);

  const columns = useMemo(() => {
    let result: any[] = [];

    if (typeof props.datasets !== "undefined") {
      props.datasets.map((dataset, dataset_id) => {
        if (typeof dataset.data !== "undefined") {
          dataset.data.map((columnMonth, columnMonth_id) => {
            const color = keyExist<string>(dataset.backgroundColor);

            const obj = {
              color: typeof color != "undefined" ? color : Colors.primary,
              value: columnMonth,
            };

            if (typeof result[columnMonth_id] !== "undefined") {
              result[columnMonth_id].push(obj);
            } else {
              result[columnMonth_id] = [obj];
            }
          });
        }
      });
    }

    return result;
  }, [JSON.stringify(datasets)]);

  const onPress = () => {
    if (typeof props.action != "undefined") {
      return triggerAction<Omit<GraphProps, "onPress">>(props.action, props);
    }
  };

  const onLongPress = () => {
    if (typeof props.onLongPressAction != "undefined") {
      return triggerAction<Omit<GraphProps, "onPress">>(props.onLongPressAction, props);
    }
  };

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.5}
      disabled={typeof props.action == "undefined"}
      entering={FadeIn}
      style={{
        paddingTop: spacing,
        borderColor: Colors.border,
        borderRadius: radius,
        height: graphHeight,
        flexDirection: "row",
        borderWidth: 1,
        overflow: "hidden",
        ...props.style,
      }}
    >
      <View style={{ overflow: "hidden", borderRadius: radius, flex: 1, backgroundColor: "transparent" }}>
        <View style={{ flex: 1, backgroundColor: "transparent" }} onLayout={getCanvasSize}>
          <View
            style={{
              zIndex: 1000,
              position: "absolute",
              bottom: 0,
              top: 0,
              right: 0,
              left: 0,
            }}
          >
            {values.map((v: any, id: number) => {
              return (
                <View
                  key={id}
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: spacing,
                  }}
                >
                  <Text size="s" style={{ textAlign: "center", marginHorizontal: spacing }}>
                    {v}
                  </Text>

                  <View
                    style={{
                      flex: 1,
                      backgroundColor: Colors.border,
                      height: 1,
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View
            style={{
              backgroundColor: "transparent",
              zIndex: 10001,
              position: "absolute",
              height: canvasHeight,
              width: width - 60,
              alignSelf: "flex-end",
              flexDirection: "row",
              alignItems: "flex-end",
              justifyContent: "space-around",
            }}
          >
            {columns.map((column: any[], column_id: number) => {
              const max = range.max;

              const sum = () => {
                let value = 0;
                column.map((a) => (value = value * 1 + a.value));
                return value;
              };

              const columnHeight = sum() > 0 ? (sum() / max) * canvasHeight : 0;

              return (
                <View
                  key={column_id}
                  style={{
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    width: Math.round((width - 200) / columns.length),
                    borderTopLeftRadius: spacing,
                    borderTopRightRadius: spacing,
                    overflow: "hidden",
                  }}
                >
                  {column.map((value, value_id) => {
                    const valueHeight = columnHeight > 0 ? (value.value / sum()) * columnHeight : 0;
                    if (valueHeight < 5) return null;
                    return (
                      <View
                        key={value_id}
                        style={{
                          width: "100%",
                          backgroundColor: value.color,
                          height: Math.round(valueHeight),
                        }}
                      />
                    );
                  })}
                </View>
              );
            })}
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            width: width - 50,
            alignSelf: "flex-end",
            paddingVertical: spacing,
          }}
        >
          {labels.map((x: any, y: any) => {
            return (
              <Text
                key={y}
                size="s"
                numberOfLines={1}
                style={{
                  flex: 1,
                  textAlign: "center",
                }}
              >
                {x}
              </Text>
            );
          })}
        </View>
      </View>
    </AnimatedTouchableOpacity>
  );
}

export default Graph;
