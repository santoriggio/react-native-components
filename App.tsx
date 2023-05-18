import { memo, StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  useLayout,
  FlagPicker,
  BottomSheet,
  SearchPicker,
  Message,
  useCachedResources,
  config,
  Header,
  TabNavigation,
  ScreenDrawer,
  Text,
} from "./react-native-components";

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

  const [filters, setFilters] = useState<any>({});
  const [selectedFilters, setSelectedFilters] = useState<any>(undefined);

  const [data, setData] = useState<any>({});

  const [canContinue, setCanContinue] = useState<boolean>(false);

  if (!isLoadingComplete) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background }}>
        <Header
          title="react-native-components"
          largeTitle
          borderBottom={false}
          searchBarOptions={{
            onChangeText: (text) => {
              setQuery(text);
            },
            filters,
            selectedFilters,
            setSelectedFilters,
          }}
        />
        <Text>{JSON.stringify(canContinue)}</Text>
        <TabNavigation
          data={data}
          setData={setData}
          tabs={[
            {
              id: "first",
              title: "Primo",
              path: "/first",
              content: [
                {
                  id: "in",
                  component: "input",
                  type: "text",
                  required: true,
                  title: "Input",
                },
              ],
            },
            {
              id: "second",
              path: "/second",
              title: "Secondo",
              content: [
                {
                  id: "in",
                  component: "input",
                  type: "text",
                  required: true,
                  title: "Input",
                },
              ],
            },
          ]}
          onChange={(details) => {
            setCanContinue(details.canContinue);
          }}
        />

        <ScreenDrawer
          canContinue={canContinue}
          content={[
            {
              component: "button",
              checkData: true,
              title: "Hey",
            },
          ]}
        />
        <FlagPicker />
        <SearchPicker />
        <BottomSheet />
        <Message />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
