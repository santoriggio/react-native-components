import { memo, StrictMode, useEffect, useMemo, useRef, useState } from "react";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, useWindowDimensions, Platform, Dimensions, Keyboard, KeyboardAvoidingView } from "react-native";
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
  TextInput,
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

const { height: windowHeight } = Dimensions.get("window");

const NestedScrollFix = ({ children }: any) => {
  const scrollViewRef = useRef<any>(null);
  const contentSizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (event) => {
        if (scrollViewRef.current) {
          const keyboardHeight = event.endCoordinates.height;
          const keyboardY = windowHeight - keyboardHeight;
          const { height: contentHeight } = contentSizeRef.current;

          if (contentHeight > keyboardY) {
            const scrollOffset = contentHeight - keyboardY;
            scrollViewRef.current.scrollTo({ y: scrollOffset, animated: true });
          }
        }
      }
    );

    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleContentSizeChange = (width, height) => {
    contentSizeRef.current = { width, height };
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{ flexGrow: 1 }}
      onContentSizeChange={handleContentSizeChange}
    >
      {children}
    </ScrollView>
  );
};

export default function App() {
  const { Colors } = useLayout();
  const isLoadingComplete = useCachedResources();
  const { width } = useWindowDimensions();
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

        <TabNavigation
          data={data}
          setData={setData}
          tabs={[
            {
              id: "first",
              path: "/first",
              title: "Primo",
              content: [
                {
                  id: "check",
                  component: "input",
                  type: "checkbox",
                  placeholder: "Clicca qui",
                  trigger: {
                    target: ["box"],
                  },
                },
                {
                  id: "test",
                  component: "input",
                  type: "text",
                  title: "INPUT CON ID",
                },
                {
                  id: "box",
                  component: "box",
                  title: "OOOO chist u box è",
                  content: [
                    {
                      component: "select",
                      type: "multiselect",
                      items: {
                        0: {
                          text: "ooo",
                        },
                        1: {
                          text: "ooo2",
                        },
                        1: {
                          text: "oo03",
                        },
                      },
                      title: "SELECT",
                    },
                  ],
                },
                {
                  component: "input",
                  type: "text",
                  title: "INput",
                },
                {
                  component: "input",
                  type: "text",
                  title: "INput",
                },
                {
                  component: "input",
                  type: "text",
                  title: "INput",
                },
                {
                  component: "input",
                  type: "text",
                  title: "INput",
                },
              ],
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
