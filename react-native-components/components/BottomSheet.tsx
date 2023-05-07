import React, {
  FC,
  MutableRefObject,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  BackHandler,
  FlexStyle,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import DefaultBottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import Icon from "./Icon";
import useLayout from "../hooks/useLayout";
import Text from "./Text";
import ScreenDrawer from "./ScreenDrawer";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import { FlagPickerController } from "./FlagPicker";

type BottomSheetMethods = {
  show: (newContent: ScreenDrawerComponent[]) => void;
  hide: () => void;
};

class BottomSheetController {
  static modalRef: MutableRefObject<BottomSheetMethods>;
  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static show = (newContent: ScreenDrawerComponent[]) => {
    this.modalRef.current?.show(newContent);
  };

  static hide = () => {
    this.modalRef.current?.hide();
  };
}

const BottomSheet: FC = () => {
  const { spacing, icon_size, Colors } = useLayout();
  const { bottom, top } = useSafeAreaInsets();
  const bottomSheetRef = useRef<DefaultBottomSheet>(null);
  const [content, setContent] = useState<ScreenDrawerComponent[]>([]);
  const _bottom = bottom === 0 ? spacing : bottom;
  const modalRef = useRef<BottomSheetMethods>();

  useLayoutEffect(() => {
    BottomSheetController.setModalRef(modalRef);
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [JSON.stringify(content)]);

  const backAction = () => {
    if (content.length > 0) {
      FlagPickerController.hideModal();
      return true;
    }

    return false;
  };

  useImperativeHandle(modalRef, () => ({
    show,
    hide,
  }));

  //   useEffect(() => {
  //     BackHandler.addEventListener("hardwareBackPress", backAction);

  //     return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  //   }, [JSON.stringify(popup)]);

  //   const backAction = () => {
  //     if (popup !== null) {
  //       hideModal();
  //       return true;
  //     }

  //     return false;
  //   };

  const show = (newContent: typeof content) => {
    if (JSON.stringify(newContent) != JSON.stringify(content)) {
      setContent(newContent);
    }

    bottomSheetRef.current?.snapToIndex(0);
  };

  const hide = () => {
    bottomSheetRef.current?.close();
    //setContent([]);
  };

  const snapPoints = useMemo(() => ["50%", "90%"], []);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} onPress={hide} opacity={0.3} appearsOnIndex={0} disappearsOnIndex={-1} />
    ),
    []
  );

  return (
    <DefaultBottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      index={-1}
      style={{
        backgroundColor: Colors.background,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 5,
        },
        shadowOpacity: 0.34,
        shadowRadius: 6.27,
        zIndex: 100000,
        elevation: 10,
      }}
      //   onChange={handleSheetChanges}
      handleStyle={{ backgroundColor: Colors.background }}
      backgroundStyle={{ backgroundColor: Colors.background }}
      handleIndicatorStyle={{ backgroundColor: Colors.gray, width: spacing * 5, height: spacing / 2 }}
    >
      <BottomSheetScrollView bounces={false} contentContainerStyle={{ paddingBottom: _bottom }}>
        <ScreenDrawer content={content} scrollEnabled={false} />
      </BottomSheetScrollView>
    </DefaultBottomSheet>
  );
};

export { BottomSheetController };
export default BottomSheet;
