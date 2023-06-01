import { FontSource } from "expo-font";
import deepMerge from "../functions/deepMerge";
import { sizes } from "./Utils";

export type ConfigOptions = {
  spacing: any;
  radius: any;
  query_change_time: number;
  sizes: Partial<typeof sizes>;
  fonts: {
    bold?: string;
    regular?: string;
  };

  images: {
    icon?: string;
    logo?: string;
  };
  sendApiRequest: {
    url?: string;
    headers?: {
      [key: string]: any;
    };
    errors?: {
      [key: string]: (error: any) => void;
    };
  };
  colors: {
    light?: {
      isDark: false;
      text: string;
      card: string;
      background: string;
      border: string;
    };
    dark?: {
      isDark: true;
      text: string;
      card: string;
      background: string;
      border: string;
    };
    primary?: string;
    secondary?: string;
    success?: string;
    danger?: string;
    notification?: string;
    info?: string;
    link?: string;
    warning?: string;
    gray?: string;
  };
  googlePlacesAutocompleteKey: string;
};

class Config {
  private static instance: Config;
  private config: ConfigOptions;

  private constructor() {
    // Set default values for configuration options
    this.config = {
      spacing: 12,
      radius: 8,
      query_change_time: 350,
      sizes,
      sendApiRequest: {},
      fonts: {
        bold: undefined,
        regular: undefined,
      },
      images: {
        icon: undefined,
      },
      colors: {
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
      googlePlacesAutocompleteKey: "",
    };
  }

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public setConfig(options: Partial<ConfigOptions>): void {
    this.config = deepMerge(this.config, options);
  }

  public getConfig(): ConfigOptions {
    return this.config;
  }
}

const config = Config.getInstance();

export default config;
