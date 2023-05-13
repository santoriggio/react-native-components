import { memo, StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useLayout,
  ScreenDrawer,
  FlagPicker,
  BottomSheet,
  SearchPicker,
  Message,
  useCachedResources,
  config,
  Header,
  Button,
  SearchPickerController,
  BottomSheetController,
} from "./react-native-components";

/**
 
 
[
  {
   component: 'text',
   title: 'Aggiungi prodotto'
   icon: '',
   margin: {
   top:1,
   left:1
   },
   action: *picker
  },
  {
  component:'text',
  }
]
 
 */

// "main": "react-native-components/index.tsx",

config.setConfig({
  radius: 12,
  images: {
    icon: require("./assets/images/icon.png"),
  },
  fonts: {
    regular: require("./assets/fonts/regular.ttf"),
    bold: require("./assets/fonts/bold.ttf"),
  },
  sendApiRequest: {
    url: "https://luigi.framework360.it/m/api/app",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-Fw360-Key": "global,2041",
      "X-Fw360-UserToken": "D0rSaGP1A2RzQcgXyBFpM3V4n7WZwd9OhINlEJH8",
      //"X-Fw360-Useragent": globalThis.userAgent,
    },
    errors: {
      user_token_expired: (error) => {},
    },
  },
});

export default function App() {
  const { Colors } = useLayout();
  const isLoadingComplete = useCachedResources();

  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any>({});
  const [borderVisible, setBorderVisible] = useState<boolean>(false);

  const [filters, setFilters] = useState<any>({});
  const [selectedFilters, setSelectedFilters] = useState<any>(undefined);

  if (!isLoadingComplete) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
        <Header
          title="react-native-components"
          largeTitle
          searchBarOptions={{
            onChangeText: (text) => {
              setQuery(text);
            },
            filters,
            selectedFilters,
            setSelectedFilters,
          }}
          borderBottom={borderVisible}
        />

        <ScreenDrawer content={[
          {
            component: 'button',
            title: 'Press',
            action: {
              type: 'api',
              endpoint: '',
              
            }
          }
       ]} />

        <FlagPicker />
        <SearchPicker />
        <BottomSheet />
        <Message />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
