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

const useLayout = (): LayoutConfig => {
  const colorScheme = useColorScheme();
  const currentConfig = config.getConfig();

  const layoutConfig = useMemo<LayoutConfig>(() => {
    const { width, height } = Dimensions.get("window");
    const isTablet = width > 600 && height > 600;

    const theme = {
      light: currentConfig.colors.light,
      dark: currentConfig.colors.dark,
    };

    const currentTheme = theme[colorScheme];

    return {
      spacing: isTablet ? 20 : currentConfig.spacing,
      radius: isTablet ? 16 : currentConfig.radius,
      icon_size: isTablet ? 30 : 20,
      fontSize: (size?: keyof typeof sizes) => {
        if (typeof size != "undefined" && typeof currentConfig.sizes[size] != "undefined") {
          return currentConfig.sizes[size] * (isTablet ? 1.5 : 1);
        }

        return currentConfig.sizes["m"] * (isTablet ? 1.5 : 1);
      },
      Colors: {
        ...currentTheme,
        light: theme["light"],
        dark: theme["dark"],
        primary: currentConfig.colors.primary,
        secondary: currentConfig.colors.secondary,
        success: currentConfig.colors.success,
        danger: currentConfig.colors.danger,
        notification: currentConfig.colors.notification,
        info: currentConfig.colors.info,
        link: currentConfig.colors.link,
        warning: currentConfig.colors.warning,
        gray: currentConfig.colors.gray,
      },
    };
  }, [JSON.stringify(currentConfig), colorScheme]);

  return layoutConfig;
};

export default useLayout;
