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
