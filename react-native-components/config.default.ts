// import {} from '../../../../../config'

import { FontSource } from "expo-font";
import { ImageSource } from "expo-image";

export const sizes = {
  xs: 12,
  s: 14,
  m: 16,
  l: 18,
  xl: 20,
  "2xl": 22,
  "3xl": 26,
  "4xl": 28,
  "5xl": 30,
  "6xl": 32,
};

type Config = {
  spacing: any;
  query_change_time: number;
  sizes: Partial<typeof sizes>;
  fonts: {
    bold: FontSource;
    regular: FontSource;
  };
  images: {
    icon: string;
    logo?: string;
  };
  googlePlacesAutocompleteKey: string;
};

export let config: Config = {
  spacing: 12,
  query_change_time: 350,
  sizes,
  fonts: {
    bold: require("../assets/fonts/bold.ttf"),
    regular: require("../assets/fonts/regular.ttf"),
  },
  images: {
    icon: require("../assets/images/icon.png"),
  },
  googlePlacesAutocompleteKey: "",
};

export function initConfig(options: Partial<Config>) {
  const keys = Object.keys(options) as (keyof Config)[];

  let formatted: any = {
    ...config,
  };

  keys.forEach((key) => {
    if (typeof options[key] != "undefined") {
      if (typeof options[key] == "object") {
        formatted[key] = {
          ...config[key],
          ...options[key],
        };
      } else {
        formatted[key] = options[key];
      }
    }
  });

  config = {
    ...formatted,
  };
}

export const query_change_time = 350;
