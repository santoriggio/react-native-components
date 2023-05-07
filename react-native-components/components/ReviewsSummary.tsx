import React, { useMemo } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import keyExist from "../functions/keyExist";
import useLayout from "../hooks/useLayout";
import { ReviewsSummaryProps } from "../types";
import Icon from "./Icon";
import Text from "./Text";

interface IProps {
  style?: ViewStyle;
  value: number;
  activeColor?: string;
  size?: number;
  onPress?: () => void;
  total?: number;
  large?: boolean;
  count?: any;
}

export default function ReviewsSummary({ ...props }: ReviewsSummaryProps) {
  const { spacing, icon_size, radius, Colors } = useLayout();

  const total_reviews = useMemo(() => {
    if (typeof props.total_reviews != "undefined" && props.total_reviews > 0) {
      return props.total_reviews;
    }

    const count = keyExist<ReviewsSummaryProps["count"]>(props.count);

    if (typeof count != "undefined") {
      let partial = 0;
      Object.values(count).forEach((x) => (partial += x));

      return partial;
    }

    return 0;
  }, [props.total_reviews, JSON.stringify(props.count)]);

  const average = useMemo(() => {
    if (typeof props.average != "undefined" && props.average > 0) {
      return props.average;
    }

    const count = keyExist<ReviewsSummaryProps["count"]>(props.count);

    if (typeof count != "undefined") {
      let partial = 0;
      let counter = 0;

      Object.keys(count).forEach((key) => {
        const data = count[key];

        counter = counter + data;
        partial = partial + key * data;
      });

      if (counter > 0) {
        return partial / counter;
      } else {
        return 0;
      }
    }

    return 0;
  }, [total_reviews, props.average]);

  if (props.large) {
    return (
      <View
        style={{
          padding: spacing,
          borderRadius: radius,
          backgroundColor: Colors.card,
          ...props.style,
        }}
      >
        <View
          style={{
            marginBottom: spacing,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text size="xl" bold>
            Recensioni
          </Text>
          <TouchableOpacity
            onPress={props.onPress}
            activeOpacity={0.5}
            hitSlop={{
              bottom: spacing,
              top: spacing,
              right: spacing,
              left: spacing,
            }}
          >
            <Text style={{ color: Colors.primary }}>Vedi tutto</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: "transparent",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ backgroundColor: "transparent", alignItems: "center" }}>
            <Text size="6xl" bold>
              {average.toFixed(1).replace(".", ",")}
            </Text>
            <Text size="s">su 5</Text>
          </View>
          <View style={{ marginLeft: spacing, alignItems: "flex-end" }}>
            {[1, 2, 3, 4, 5].map((x) => {
              const actual_count =
                typeof props.count != "undefined" && typeof props.count[x] != "undefined" ? props.count[x] : 0;

              return (
                <View key={x} style={{ flexDirection: "row", alignItems: "center" }}>
                  {Array.from(Array(x).keys()).map((y) => {
                    return <Icon key={`${x}/${y}`} name="star" color={Colors.gray} size={icon_size * 0.6} />;
                  })}
                  <View
                    style={{
                      height: spacing * 0.5,
                      width: "50%",
                      backgroundColor: Colors.gray,
                      borderRadius: radius,
                      marginLeft: spacing,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: (actual_count / total_reviews) * 100 + "%",
                        backgroundColor: Colors.primary,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={0.5}
      style={{ flexDirection: "row", alignItems: "center", ...props.style }}
    >
      {[1, 2, 3, 4, 5].map((x) => {
        const activeColor = typeof props.activeColor !== "undefined" ? props.activeColor : Colors.warning;
        return <Icon key={x} name="star" color={Math.round(average) >= x ? activeColor : Colors.gray} />;
      })}
      {typeof total_reviews !== "undefined" && (
        <Text size="s" style={{ marginLeft: spacing / 2 }}>
          {total_reviews} recension{total_reviews === 1 ? "e" : "i"}
        </Text>
      )}
    </TouchableOpacity>
  );
}
