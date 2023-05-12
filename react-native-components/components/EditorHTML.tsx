import React, {
  FC,
  forwardRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import { setPath } from "react-native-reanimated/lib/types/lib/reanimated2/animation/styleAnimation";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import useLayout from "../hooks/useLayout";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import BottomSheet, { BottomSheetController } from "./BottomSheet";
import { FlagPickerController } from "./FlagPicker";
import Header from "./Header";
import Icon from "./Icon";
import ScreenDrawer from "./ScreenDrawer";
import ScrollView from "./ScrollView";
import SearchPicker, { SearchPickerController } from "./SearchPicker";
import Text from "./Text";

type EditorHTMLMethods = {
  show: (content: string, options?: any) => void;
  hide: () => void;
};

class EditorHTMLController {
  static editorHTMLRef: MutableRefObject<EditorHTMLMethods>;
  static setModalRef = (ref: any) => {
    this.editorHTMLRef = ref;
  };

  static show: EditorHTMLMethods["show"] = (content, options) => {
    this.editorHTMLRef.current.show(content, options);
  };

  static hide = () => {
    this.editorHTMLRef.current.hide();
  };
}

function EditorHTML({ ...props }: any) {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const editorHTMLRef = useRef<EditorHTMLMethods>();
  const richText = useRef<RichEditor>(null);
  const [visible, setVisible] = useState<boolean>(false);
  const { bottom, top } = useSafeAreaInsets();
  const [test, setTest] = useState<boolean>(false);

  const [settingsVisible, setSettingsVisible] = useState<boolean>(false);
  const [settings, setSettings] = useState<ScreenDrawerComponent[]>([]);

  const [contentHtml, setContentHtml] = useState<string>("");
  const [initialHtml, setInitialHtml] = useState<string>("");

  const [options, setOptions] = useState<any>({});

  useEffect(() => {
    EditorHTMLController.setModalRef(editorHTMLRef);
  }, []);

  useImperativeHandle(editorHTMLRef, () => ({
    show(content, options?) {
      setInitialHtml(content);
      setOptions(options);
      setVisible(true);
    },
    hide() {},
  }));

  const onPressAddImage = useCallback(() => {
    // insert URL



    richText.current?.insertImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png"
    );
    // insert base64
    // this.richText.current?.insertImage(`data:${image.mime};base64,${image.data}`);
  }, []);

  const handleFontSize = useCallback(() => {
    // 1=  10px, 2 = 13px, 3 = 16px, 4 = 18px, 5 = 24px, 6 = 32px, 7 = 48px;
    const obj: any = {
      1: "10px",
      2: "13px",
      3: "16px",
      4: "18px",
      5: "24px",
      6: "32px",
      7: "48px",
    };

    let formatted: ScreenDrawerComponent[] = [
      {
        component: "text",
        title: "Testo",
        bold: true,
        size: "4xl",
      },
    ];

    Object.keys(obj).forEach((key: any) => {
      const data = obj[key];
      const toReturn: ScreenDrawerComponent = {
        component: "text",
        size: "l",
        title: data,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);
          richText.current?.setFontSize(key);
        },
      };

      formatted.push(toReturn);
    });

    setSettings(formatted);
    setSettingsVisible(true);
  }, []);

  const headerLeft = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (typeof options.onSuccess != "undefined") {
            options.onSuccess(contentHtml);
          }

          setVisible(false);
        }}
        activeOpacity={0.5}
        style={{ height: spacing * 4, paddingHorizontal: spacing, justifyContent: "center", alignItems: "center" }}
      >
        <Text size="l" bold style={{ color: Colors.info }}>
          Fine
        </Text>
      </TouchableOpacity>
    );
  }, [contentHtml, JSON.stringify(options)]);

  const add = useCallback(() => {
    // alert("ciao");
  }, []);

  const all = () => {
    setSettings([
      {
        component: "text",
        title: "Azioni",
        bold: true,
        size: "4xl",
      },
      {
        component: "text",
        title: "Grassetto",
        icon: "bold",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);
          richText.current?.sendAction(actions.setBold, "result");
        },
      },
      {
        component: "text",
        title: "Corsivo",
        icon: "italic",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);
          richText.current?.sendAction(actions.setItalic, "result");
        },
      },
      {
        component: "text",
        title: "Immagine",
        icon: "image",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          // richText.current?.sendAction(actions.setItalic, "result");
        },
      },
      // {
      //   component: "text",
      //   title: "Link",
      //   icon: "link",
      //   size: "l",
      //   color: Colors.light.text,
      //   margin: {
      //     top: 1,
      //     left: 1,
      //   },
      //   action: {
      //     type: "press",
      //     onPress: () => {
      //       setSettingsVisible(false);
      //       richText.current?.insertLink("Inserisci link", "https://framework360.it");
      //     },
      //   },
      // },
      {
        component: "text",
        title: "Allinea a sinistra",
        icon: "align-left",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.alignLeft, "result");
        },
      },
      {
        component: "text",
        title: "Allinea al centro",
        icon: "align-center",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.alignCenter, "result");
        },
      },
      {
        component: "text",
        title: "Allinea a destra",
        icon: "align-right",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.alignRight, "result");
        },
      },
      {
        component: "text",
        title: "Lista",
        icon: "list",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.insertBulletsList, "result");
        },
      },
      {
        component: "text",
        title: "Lista ordinata",
        icon: "list-number",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.insertOrderedList, "result");
        },
      },
      {
        component: "text",
        title: "Codice",
        icon: "code",
        size: "l",
        color: Colors.light.text,
        margin: {
          top: 1,
          left: 1,
        },
        action: () => {
          setSettingsVisible(false);

          // insertImage

          richText.current?.sendAction(actions.code, "result");
        },
      },
      // {
      //   component: "text",
      //   title: "Tabella",
      //   icon: "table",
      //   size: "l",
      //   color: Colors.light.text,
      //   margin: {
      //     top: 1,
      //     left: 1,
      //   },
      //   action: {
      //     type: "press",
      //     onPress: () => {
      //       setSettingsVisible(false);

      //       // insertImage

      //       richText.current?.sendAction(actions.table, "result");
      //     },
      //   },
      // },
    ]);

    setSettingsVisible(true);
  };

  const editText = () => {};

  const headerRight = useMemo(() => {
    return (
      <RichToolbar
        ref={richText}
        iconTint={Colors.gray}
        actions={[actions.undo, actions.redo, "add"]}
        style={{ backgroundColor: "transparent" }}
        iconMap={{
          add: () => {
            return <Icon name="add" size={icon_size * 1.2} color={Colors.gray} />;
          },
        }}
        add={add}
      />
    );
  }, []);

  return (
    <Modal visible={visible} presentationStyle="formSheet" animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        keyboardVerticalOffset={top - spacing}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Header
          left={headerLeft}
          //right={headerRight}
          containerStyle={{ paddingTop: Platform.select({ ios: spacing }) }}
        />
        <ScrollView>
          <RichEditor
            ref={richText}
            onChange={(text) => {
              setContentHtml(text);
            }}
            // onLoadEnd={(e) => {
            //   richText.current?.blurContentEditor();
            // }}
            placeholder="Scrivi qui"
            originWhitelist={["*"]}
            // androidHardwareAccelerationDisabled
            initialContentHTML={initialHtml}
            initialHeight={200}
            initialFocus={false}
            editorStyle={{
              placeholderColor: Colors.gray,
              caretColor: Colors.primary,
            }}
          />
        </ScrollView>
        <RichToolbar
          editor={richText}
          selectedIconTint={Colors.primary}
          iconTint={Colors.gray}
          iconSize={icon_size * 1.2}
          actions={[
            actions.undo,
            actions.redo,
            "fontSize",
            actions.setBold,
            actions.setItalic,
            // actions.setStrikethrough,
            // actions.checkboxList,
            //actions.insertOrderedList,
            //actions.blockquote,
            //actions.alignLeft,
            //actions.alignCenter,
            //actions.alignRight,
            //actions.code,
            //sactions.fontSize,
            "all",
          ]}
          onPressAddImage={onPressAddImage}
          style={{
            height: spacing * 5.5,
          }}
          flatContainerStyle={{ paddingHorizontal: spacing, marginBottom: spacing * 1.5 }}
          iconMap={{
            fontSize: () => {
              return <Icon name="font" size={icon_size * 1.2} color={Colors.gray} />;
            },
            all: () => {
              return <Icon name="ellipsis-horizontal" size={icon_size * 1.2} color={Colors.gray} />;
            },
          }}
          all={all}
          fontSize={handleFontSize}
        />
      </KeyboardAvoidingView>
      <Modal visible={settingsVisible} presentationStyle="formSheet" animationType="slide">
        <Header
          left={
            <TouchableOpacity
              style={{ height: spacing * 4, paddingHorizontal: spacing, justifyContent: "center" }}
              activeOpacity={0.5}
              onPress={() => setSettingsVisible(false)}
            >
              <Text size="l" bold style={{ color: Colors.gray }}>
                Chiudi
              </Text>
            </TouchableOpacity>
          }
          //right={headerRight}
          containerStyle={{ paddingTop: Platform.select({ ios: spacing }) }}
        />
        <ScreenDrawer content={settings} />
      </Modal>
    </Modal>
  );
}
export { EditorHTMLController };
export default EditorHTML;
