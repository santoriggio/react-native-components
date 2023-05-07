import React, { createElement, FC, memo, ReactElement, useCallback, useMemo } from "react";
import { ColorValue, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import {
  Ionicons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Foundation,
  Entypo,
  MaterialCommunityIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import useLayout from "../hooks/useLayout";

const IconFamilies = {
  FontAwesome: FontAwesome,
  Ionicons: Ionicons,
  Feather: Feather,
  Foundation: Foundation,
  Entypo: Entypo,
  MaterialCommunityIcons: MaterialCommunityIcons,
  AntDesign: AntDesign,
  MaterialIcons,

  //Non ha il glyphMap
  FontAwesome5: FontAwesome5,
};

type Families = keyof typeof IconFamilies;

type MyIconProps = {
  family?: Families;
  name: string | undefined;
  size?: number;
  style?: TextStyle;
  color?: ColorValue;
};

export default function Icon({ family, name, size, style, color }: MyIconProps) {
  const { spacing, icon_size, Colors } = useLayout();

  if (typeof name === "undefined") return null;

  const formattedName = useMemo(() => (name.includes("fa-") ? name.split("fa-")[1] : name), [name]);

  // const array: Families[] = useMemo(() => {
  //   let IconArray = Object.keys(IconFamilies);
  //   let mapped: any = [];
  //   if (typeof family !== "undefined") {
  //     IconArray.map((iconFamily, index) => {
  //       const family_index = IconArray.indexOf(family);
  //       const newIndex = index - family_index < 0 ? IconArray.length + (index - family_index) : index - family_index;
  //       mapped[newIndex] = iconFamily;
  //     });
  //   } else {
  //     return IconArray;
  //   }

  //   return mapped;
  // }, [family]);

  let familyToUse: Families = useMemo(() => {
    let toReturn: any = undefined;

    if (typeof family !== "undefined") {
      if (typeof IconFamilies[family] !== "undefined" && typeof IconFamilies[family].glyphMap !== "undefined") {
        if (typeof IconFamilies[family].glyphMap[formattedName] !== "undefined") {
          toReturn = family;
        }
      }
    }

    if (typeof toReturn === "undefined") {
      toReturn = "FontAwesome5";

      const array: any[] = Object.keys(IconFamilies);

      array.forEach((fam: keyof typeof IconFamilies) => {
        if (typeof IconFamilies[fam] !== "undefined") {
          if (typeof IconFamilies[fam].glyphMap !== "undefined") {
            if (typeof IconFamilies[fam].glyphMap[formattedName] !== "undefined") {
              toReturn = fam;
            }
          }
        }
      });
    }

    return toReturn;

    //let f: keyof typeof IconFamilies | undefined = undefined;

    // if (typeof family !== "undefined") {
    //   if (
    //     typeof IconFamilies[family].glyphMap !== "undefined" &&
    //     typeof IconFamilies[family].glyphMap[formattedName] !== "undefined"
    //   ) {
    //     f = family;
    //   }
    // }

    // if (typeof f === "undefined") {
    //   IconArray.forEach((fam: keyof typeof IconFamilies) => {
    //     if (
    //       fam !== "FontAwesome5" &&
    //       typeof IconArray[fam] !== "undefined" &&
    //       typeof IconArray[fam].glyphMap !== "undefined"
    //     ) {
    //       console.log("sono qui", fam);
    //       if (typeof IconArray[fam].glyphMap[formattedName] !== "undefined") {
    //         f = fam;
    //       }
    //     }
    //   });
    // }

    // if (typeof f === "undefined") f = undefined;

    // return f;
    // let f: Families | null = null;
    // if (typeof family === "undefined" || (typeof family !== "undefined" && family !== "FontAwesome5")) {
    //   array.reverse().map((iconFamily) => {
    //     if (typeof IconFamilies[iconFamily].glyphMap !== "undefined") {
    //       if (typeof IconFamilies[iconFamily].glyphMap[formattedName] !== "undefined") {
    //         return (f = iconFamily);
    //       }
    //     }
    //   });
    // }
    // if (f === null) f = "FontAwesome5";
    // return f;
  }, [formattedName, family]);

  const styles = StyleSheet.create({
    icon: {
      ...style,
    },
  });

  const Component = IconFamilies[familyToUse];

  return (
    <Component
      name={formattedName}
      size={typeof size != "undefined" ? size : icon_size}
      color={typeof color != "undefined" ? color : Colors.text}
      style={styles.icon}
    />
  );
}
