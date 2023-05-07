import { useEffect, useState } from "react";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { config, ConfigType } from "../config.default";

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState<boolean>(false);

  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        if (typeof config.fonts != "undefined") {
          let formattedFonts: any = {};

          const keys = Object.keys(config.fonts) as (keyof ConfigType["fonts"])[];

          keys.forEach((key) => {
            const font = config.fonts[key];

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
