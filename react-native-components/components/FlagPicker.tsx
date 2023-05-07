import React, {
  forwardRef,
  MutableRefObject,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { BackHandler, ListRenderItem, Modal, Platform, TouchableOpacity } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useLayout from "../hooks/useLayout";
import { Flags } from "../utils/Flags";
import Flag, { FlagType } from "./Flag";
import FlatList from "./FlatList";
import Header from "./Header";
import Icon from "./Icon";
import Text from "./Text";

export type CustomModalRef = {
  show: (options: any) => void;
  hide: () => void;
};

class FlagPickerController {
  static modalRef: MutableRefObject<CustomModalRef>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static showModal = (options: any) => {
    this.modalRef.current?.show(options);
  };

  static hideModal = () => {
    this.modalRef.current?.hide();
  };
}

function FlagPicker() {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<CustomModalRef>();
  const [flags, setFlags] = useState<FlagType[]>(Flags);
  const scrollY = useSharedValue(0);
  const { bottom, top } = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [options, setOptions] = useState<any>({});

  useLayoutEffect(() => {
    FlagPickerController.setModalRef(modalRef);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [modalVisible]);

  const backAction = () => {
    if (modalVisible) {
      FlagPickerController.hideModal();
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
          FlagPickerController.hideModal();
        }}
        activeOpacity={0.5}
        style={{ height: spacing * 4, width: spacing * 4, justifyContent: "center", alignItems: "center" }}
      >
        <Icon name="close" size={icon_size * 1.2} />
      </TouchableOpacity>
    );
  }, []);

  const renderItem: ListRenderItem<any> = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          FlagPickerController.hideModal();
          options.onSuccess(item);
        }}
        activeOpacity={0.5}
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: spacing,
          backgroundColor: Colors.background,
          paddingRight: spacing,
          borderColor: Colors.border,
          borderBottomWidth: 1,
        }}
      >
        <Flag countryCode={item.code} />
        {typeof options.prefixVisible !== "undefined" && options.prefixVisible === true && (
          <Text style={{ color: Colors.gray, marginLeft: spacing }}>({item.dial_code})</Text>
        )}
        <Text numberOfLines={1} style={{ flex: 1, marginLeft: spacing }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={modalVisible} animationType="slide" presentationStyle="formSheet">
      <Header
        title="Seleziona uno stato"
        left={headerLeft}
        searchBarOptions={{
          placeholder: "Cerca stato",
          onChangeText: (text) => {
            const queryToLowerCase = text.toLowerCase();

            const newArray = Flags.filter((flag: FlagType) => {
              if (typeof flag.name != "undefined") {
                const nameToLowerCase = flag.name.toLowerCase();

                if (nameToLowerCase.includes(queryToLowerCase)) return flag;
              }
            });

            return setFlags(newArray);
          },
        }}
        containerStyle={{ paddingTop: Platform.select({ ios: spacing }) }}
      />
      <FlatList data={flags} initialNumToRender={20} renderItem={renderItem} contentInset={{ bottom }} />
    </Modal>
  );
}

export { FlagPickerController };
export default forwardRef(FlagPicker);
