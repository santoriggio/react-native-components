import { StatusBar } from "expo-status-bar";
import { memo, StrictMode, useEffect, useMemo, useState } from "react";
import { LogBox, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSharedValue } from "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  Checkbox,
  useLayout,
  ScreenDrawer,
  FlagPicker,
  BottomSheet,
  SearchPicker,
  Message,
  useCachedResources,
  Text,
  initConfig,
  ButtonsList,
  ScrollView,
  triggerAction,
} from "./react-native-components";
LogBox.ignoreAllLogs(true);

initConfig({
  fonts: {
    regular: require("./assets/fonts/regular.ttf"),
    bold: require("./assets/fonts/bold.ttf"),
  },
});

export default function App() {
  const { spacing, icon_size, Colors } = useLayout();
  const scrollY = useSharedValue(0);
  const isLoadingComplete = useCachedResources();
  const [data, setData] = useState<any>({});

  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [canSave, setCanSave] = useState<boolean>(false);
  const [tabsNumber, setTabsNumber] = useState<number>(3);

  if (!isLoadingComplete) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor: Colors.background, paddingTop: 50 }}>
        {/* <Navigation /> */}

        <ScrollView contentContainerStyle={{ padding: spacing }}>
          <ButtonsList
            info="Buttonslist info, this is some infos"
            buttons={[
              {
                title: "AI",
                icon: "brain",
                color: Colors.danger,
                titleColor: "white",
                chevronColor: "white",
                backgroundColor: "green",
              },
              {
                title: "AI",
                icon: "person",
                subtitle: "Ciao",
                color: Colors.primary,
                component: (info) => {
                  return (
                    <View>
                      <Text bold>{info.title}</Text>
                    </View>
                  );
                },
              },
              {
                title: "AI",
                icon: "brain",
                color: Colors.danger,
              },
              {
                title: "AI",
                icon: "brain",
                color: Colors.danger,
                component: {
                  type: "switch",
                  value: false,
                  onChange: () => {},
                },
              },
            ]}
          />
        </ScrollView>

        <FlagPicker />
        <SearchPicker />
        <Message />
        <BottomSheet />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
