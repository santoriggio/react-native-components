import { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import config, { ConfigOptions } from "../utils/Config";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        const currentConfig = config.getConfig();

        if (typeof currentConfig.fonts != "undefined") {
          let formattedFonts: any = {};

          const keys = Object.keys(currentConfig.fonts) as (keyof ConfigOptions["fonts"])[];

          keys.forEach((key) => {
            const font = currentConfig.fonts[key];

            if (typeof font != "undefined") {
              formattedFonts[key] = font;
            }
          });

          await Font.loadAsync(formattedFonts);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
