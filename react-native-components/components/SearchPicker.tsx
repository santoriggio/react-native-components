import React, {
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Modal, BackHandler, TouchableOpacity, Platform } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenDrawer } from "..";
import useLayout from "../hooks/useLayout";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import Header from "./Header";
import Icon from "./Icon";

type Options = {
  content: ScreenDrawerComponent[];
  onSuccess: (selected: any) => void;
};

type CustomModalRef = {
  show: (options: Options) => void;
  hide: () => void;
};

class SearchPickerController {
  static modalRef: MutableRefObject<CustomModalRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static show = (options: Options) => {
    this.modalRef.current?.show(options);
  };

  static hide = () => {
    this.modalRef.current?.hide();
  };
}

function SearchPicker() {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<CustomModalRef>();
  const scrollY = useSharedValue(0);
  const { bottom, top } = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [options, setOptions] = useState<Options>({
    content: [],
    onSuccess: () => {},
  });

  const [query, setQuery] = useState<string>("");

  useLayoutEffect(() => {
    SearchPickerController.setModalRef(modalRef);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [modalVisible]);

  const backAction = () => {
    if (modalVisible) {
      SearchPickerController.hide();
      return true;
    }

    return false;
  };

  useImperativeHandle(modalRef, () => ({
    show: (options) => {
      setModalVisible(true);
      setOptions(options);
    },
    hide: () => {
      setModalVisible(false);
    },
  }));

  const headerLeft = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          SearchPickerController.hide();
        }}
        activeOpacity={0.5}
        style={{ height: spacing * 4, width: spacing * 4, justifyContent: "center", alignItems: "center" }}
      >
        <Icon name="close" size={icon_size * 1.2} />
      </TouchableOpacity>
    );
  }, []);

  return (
    <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
      <Header
        title="Cerca"
        left={headerLeft}
        searchBarOptions={{
          placeholder: "Cerca",
          onChangeText: (text) => {
            setQuery(text);
          },
        }}
        containerStyle={{ paddingTop: Platform.select({ ios: spacing }) }}
      />
      <ScreenDrawer content={options.content} flatListProps={{ query }} />
    </Modal>
  );
}
export { SearchPickerController };
export default SearchPicker;
