import { useEffect, useMemo } from "react";
import { Dimensions, Platform } from "react-native";
import config from "../utils/Config";
import { sizes } from "../utils/Utils";
import useColorScheme from "./useColorScheme";

interface LayoutConfig {
  spacing: number;
  radius: number;
  icon_size: number;
  fontSize: (size?: keyof typeof sizes) => number;
  Colors: {
    isDark: boolean;
    //
    text: string;
    card: string;
    background: string;
    border: string;

    light: {
      text: string;
      card: string;
      background: string;
      border: string;
    };
    dark: { text: string; card: string; background: string; border: string };

    //
    primary: string;
    secondary: string;
    success: string;
    danger: string;
    notification: string;
    info: string;
    link: string;
    warning: string;
    gray: string;
  };
}

const theme = {
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

const useLayout = (): LayoutConfig => {
  const colorScheme = useColorScheme();
  const currentConfig = config.getConfig();

  const layoutConfig = useMemo<LayoutConfig>(() => {
    const { width, height } = Dimensions.get("window");
    const isTablet = width > 600 && height > 600;
    const currentTheme = theme[colorScheme];

    return {
      spacing: isTablet ? 20 : currentConfig.spacing,
      radius: isTablet ? 16 : currentConfig.radius,
      icon_size: isTablet ? 30 : 20,
      fontSize: (size?: keyof typeof sizes) => {
        if (typeof size != "undefined" && typeof sizes[size] != "undefined") {
          return sizes[size];
        }

        return sizes["m"];
      },
      Colors: {
        ...currentTheme,
        light: theme["light"],
        dark: theme["dark"],
        primary: "#1ab394",
        secondary: "#00151c",
        success: "#4cd964",
        danger: "#FF3B30",
        notification: "rgb(255, 69, 58)",
        info: "#0A84FF",
        link: "#0000EE",
        warning: "#ffcc00",
        gray: "#888",
      },
    };
  }, [JSON.stringify(currentConfig), colorScheme]);

  return layoutConfig;
};

export default useLayout;
