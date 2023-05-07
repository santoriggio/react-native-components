import { useCallback, useEffect, useMemo } from "react";
import DeviceInfo from "react-native-device-info";
import { config } from "../config.default";

import useColorScheme from "./useColorScheme";

const layout: any = {};

export type Layout = {
  radius?: number | { phone?: number; tablet: number };
};

export default function useLayout() {
  const isTablet = DeviceInfo.isTablet();
  const colorScheme = useColorScheme();

  // useEffect(() => {}, [isTablet]);

  const spacing = useMemo(() => {
    let phone = 12;
    let tablet = 20;

    if (typeof config.spacing != "undefined") {
      if (typeof config.spacing == "object") {
        if (typeof config.spacing.tablet != "undefined") {
          tablet = config.spacing.tablet;
        }

        if (typeof config.spacing.phone != "undefined") {
          phone = config.spacing.phone;
        }
      } else {
        phone = config.spacing;
      }
    }

    if (isTablet) return tablet;

    return phone;
  }, [isTablet]);

  const fontSize = useCallback(
    (size?: keyof typeof config.sizes) => {
      let toReturn =
        typeof size != "undefined" && typeof config.sizes[size] != "undefined" ? config.sizes[size] : config.sizes["m"];

      //@ts-ignore it's ok config.sizes can't be undefined
      if (isTablet) toReturn = toReturn * 1.5;

      return toReturn;
    },
    [isTablet]
  );

  const radius = useMemo(() => {
    let phone = 14;
    let tablet = 20;

    if (typeof layout.radius != "undefined") {
      if (typeof layout.radius == "object") {
        if (typeof layout.radius.tablet != "undefined") {
          tablet = layout.radius.tablet;
        }

        if (typeof layout.radius.phone != "undefined") {
          phone = layout.radius.phone;
        }
      } else {
        phone = layout.radius;
      }
    }

    if (isTablet) return tablet;

    return phone;
  }, [isTablet]);

  const icon_size = useMemo(() => {
    const size = 20;
    if (isTablet) return size * 1.5;

    return size;
  }, [isTablet]);

  const Colors = useMemo(() => {
    const toReturn = {
      light: {
        isDark: false,
        text: "#000",
        card: "#fafafa",
        background: "#FFFFFF",
        border: "#e7eaec",
      },
      dark: {
        isDark: true,
        text: "#fff",
        card: "#00151c",
        background: "#001921",
        border: "#001217",
      },
    };

    let basic = {
      primary: "#1ab394",
      secondary: "#00151c",
      success: "#4cd964",
      danger: "#FF3B30",
      notification: "rgb(255, 69, 58)",
      info: "#0A84FF",
      link: "#0000EE",
      warning: "#ffcc00",
      gray: "#888",
    };

    return {
      ...toReturn[colorScheme],
      ...toReturn,
      ...basic,
    };
  }, [colorScheme]);

  return { spacing, radius, icon_size, fontSize, Colors };
}
