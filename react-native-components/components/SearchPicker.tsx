import React, {
  MutableRefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { View, Modal, BackHandler, TouchableOpacity, Platform, StyleSheet } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import useLayout from "../hooks/useLayout";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import Header from "./Header";
import Icon from "./Icon";
import Text from "./Text";
import Button from "./Button";
import TabNavigation from "./TabNavigation";
import sendApiRequest from "../functions/sendApiRequest";
import ScreenDrawer from "./ScreenDrawer";
import { FlagType } from "./Flag";
import { TabNavigationProps } from "../types";

/**
 
 action:{
 type: 'picker',
 picker:'search',
 options: {
 content: []
 }
 }
 
 */

type ModulePickerOptions = {
  /**
   * @only ms.framework360.app
   */
  type: "modulepicker";
  limit?: number;
  module_id: string;
  content: ScreenDrawerComponent[];
  onSuccess?: (selected: any[], id: string[]) => void;
};

type SearchOptions = {
  type: "search";
};

type FlagPickerOptions = {
  type: "flag";
  /**
   * @default false
   */
  prefixVisible?: boolean;
  onSuccess?: (flag: FlagType) => void;
};

type TabsOptions = {
  type: "tabs";
  tabs: TabNavigationProps["tabs"];
};

type ModalOptions = {
  type?: undefined;
  content: ScreenDrawerComponent[];
};

type Options = ModulePickerOptions | FlagPickerOptions | TabsOptions | ModalOptions | SearchOptions;

type CustomModalRef = {
  show: (options: Options) => void;
  hide: () => void;
  getData: () => void;
  getStatus: () => boolean;
};

class SearchPickerController {
  static modalRef: MutableRefObject<CustomModalRef>;

  visible: boolean = false;

  static setModalRef = (ref: any) => {
    this.modalRef = ref;
  };

  static show = (options: Options) => {
    this.modalRef.current?.show(options);
  };

  static hide = () => {
    this.modalRef.current?.hide();
  };

  static getData = () => {
    return this.modalRef.current.getData();
  };

  static isVisible = () => {
    return this.modalRef.current.getStatus();
  };
}

function SearchPicker() {
  const { spacing, icon_size, radius, Colors } = useLayout();
  const [modalVisible, setModalVisible] = useState(false);
  const modalRef = useRef<CustomModalRef>();
  const scrollY = useSharedValue(0);
  const { bottom, top } = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState<number>(0);

  const [tabs, setTabs] = useState<any>(undefined);

  const [options, setOptions] = useState<Options[]>([]);

  const [selected, setSelected] = useState<any[] | undefined>([]);
  const [query, setQuery] = useState<string>("");

  const [data, setData] = useState<any>({});

  const [canContinue,setCanContinue] = useState<boolean>(true)

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
    show: (option) => {
      setModalVisible(true);
      setTabs(undefined);

      if (typeof option != "undefined") {
        if (option.type == "modulepicker") {
          const { limit = 1, ...other } = option;
          if (limit == 1) setSelected(undefined);
        }

        setOptions((prevState) => {
          if (typeof option.data != "undefined") setData(option.data);

          return [...prevState, option];
        });
      }
    },
    hide: () => {
      //refresh always the selected
      setSelected([]);
      setData({});

      if (options.length > 1) {
        //remove last option
        setOptions((prevState) => {
          return prevState.slice(0, prevState.length - 1);
        });
      } else {
        //hide the modal
        setModalVisible(false);
        setOptions([]);
      }
    },
    getData: () => {
      return data;
    },
    getStatus: () => modalVisible,
  }));

  const getTabs = async () => {
    // const apiResult = await sendApiRequest("/modules/records", { module_id: options.modulepickerprops?.module_id });
    // if (typeof apiResult.error != "undefined") {
    //   return setTabs(undefined);
    // }
    // const defaultDetails = typeof apiResult.data.details != "undefined" ? apiResult.data.details : [];
    // const sorted = defaultDetails.sort((a, b) => a.sort - b.sort);
    // setTabs(sorted);
  };

  const headerLeft = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          SearchPickerController.hide();
        }}
        activeOpacity={0.5}
        style={{ paddingHorizontal: spacing }}
      >
        <Text style={{ color: Colors.gray }} size="l" bold>
          Chiudi
        </Text>
      </TouchableOpacity>
    );
  }, []);

  const headerRight = useMemo(() => {
    return undefined;
    // if (typeof options.modulepickerprops?.canAdd != "undefined") {
    //   if (options.modulepickerprops?.canAdd) {
    //     return (
    //       <TouchableOpacity
    //         onPress={() => {
    //           getTabs();
    //         }}
    //         activeOpacity={0.5}
    //         style={{ paddingHorizontal: spacing }}
    //       >
    //         <Text style={{ color: Colors.info }} size="l" bold>
    //           Salva
    //         </Text>
    //       </TouchableOpacity>
    //     );
    //   }
    // }
  }, []);

  const onPressItem = useCallback(
    (item: any) => {
      setSelected((prevState) => {
        if (typeof options != "undefined" && options.length > 0) {
          const lastElement = options[options.length - 1];

          if (lastElement.type == "modulepicker") {
            const { limit = 1, content, module_id, onSuccess = () => {} } = lastElement;

            if (limit > 1) {
              if (typeof prevState == "undefined") return [item];

              let index = prevState.findIndex((x) => x.id == item.id);

              if (index >= 0) {
                return prevState.filter((x) => x.id != item.id);
              } else {
                if (prevState.length == limit) return prevState;

                return [...prevState, item];
              }
            } else {
              SearchPickerController.hide();
              onSuccess([item], [item.id]);
            }
          }
        }
      });
    },
    [JSON.stringify(options)]
  );

  const lastOption: Options = options.length > 0 ? options[options.length - 1] : { content: [] };

  const searchBarOptions = useMemo(() => {
    if (lastOption.type == "modulepicker" || lastOption.type == "search") {
      return {
        placeholder: "Cerca",
        onChangeText: (text: string) => {
          setQuery(text);
        },
      };
    }

    return undefined;
  }, [JSON.stringify(lastOption)]);

  return (
    <Modal visible={modalVisible}  animationType="slide" presentationStyle="formSheet">
      <Header
        //title="Cerca"
        left={headerLeft}
        right={headerRight}
        largeTitle
        searchBarOptions={searchBarOptions}
        borderBottom={typeof tabs != "undefined" ? false : true}
        //containerStyle={{ paddingTop: Platform.select({ ios: spacing }) }}
      />

      {lastOption.type == "modulepicker" && (
        <View style={{ flex: 1,backgroundColor:Colors.background}}>
        <ScreenDrawer
            content={lastOption.content}
            flatListProps={{
              query,
              selected,
              onPressItem,
            }}
          />
          {typeof lastOption.limit != "undefined" && lastOption.limit > 1 && (
            <View
              style={{
                padding: spacing,
                borderTopWidth: 1,
                borderColor: Colors.border,
                paddingBottom: bottom == 0 ? spacing : bottom,
              }}
            >
              <Button
                title={`Conferma (${typeof selected != "undefined" ? selected.length : 0})`}
                action={() => {
                  if (typeof lastOption != "undefined" && typeof lastOption.type != "undefined") {
                    if (lastOption.type == "modulepicker") {
                      const { limit = 1, content, module_id, onSuccess = () => {} } = lastOption;

                      if (typeof selected != "undefined") {
                        SearchPickerController.hide();
                        onSuccess(
                          selected,
                          selected.map((x) => x.id)
                        );
                      }
                    }
                  }
                }}
              />
            </View>
          )}
        </View>
      )}

      {typeof lastOption.type == "undefined" && (
        <View style={{ flex: 1,backgroundColor:Colors.background}}>
          <ScreenDrawer data={data} setData={setData} content={lastOption.content} onChange={details => {
            setCanContinue(details.canContinue)
          }} />
          {typeof lastOption.footer != "undefined" && (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.border,
                paddingBottom: (bottom == 0 ? spacing : bottom) - spacing,
              }}
            >
              <ScreenDrawer data={data} setData={setData} content={lastOption.footer} />
              {!canContinue && (
                <View style={{...StyleSheet.absoluteFillObject,backgroundColor:Colors.gray, opacity:.3}} />
              )}
            </View>
          )}
        </View>
      )}
    </Modal>
  );
}
export { SearchPickerController };
export default SearchPicker;
