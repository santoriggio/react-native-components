import React, {
  forwardRef,
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
import Animated, { FadeIn, useSharedValue } from "react-native-reanimated";
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
  const { bottom, top } = useSafeAreaInsets();
  const [tabs, setTabs] = useState<any>(undefined);
  const [options, setOptions] = useState<Options[]>([]);
  const [selected, setSelected] = useState<any[] | undefined>([]);
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any>({});
  const [canContinue, setCanContinue] = useState<boolean>(true);
  const screens = useRef<any>({});

  useLayoutEffect(() => {
    SearchPickerController.setModalRef(modalRef);
  }, []);

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
          setTimeout(() => {
            if (typeof option.data != "undefined") {
              const index = prevState.length;
              screens.current[index].setData(option.data);
            }
          }, 100);

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
          return [prevState[0]];
        });
      } else {
        //hide the modal
        setModalVisible(false);
        setOptions([]);
      }
    },
    getData: () => {
      const index = options.length;
      return screens.current[index - 1].getData();
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
          if (options.length > 1) {
            setOptions((prevState) => {
              return prevState.slice(0, prevState.length - 1);
            });
            return;
          }

          SearchPickerController.hide();
        }}
        activeOpacity={0.5}
        style={{ paddingHorizontal: spacing }}
      >
        {options.length > 1 ? (
          <Icon name="chevron-back" size={icon_size * 1.2} />
        ) : (
          <Text style={{ color: Colors.gray }} size="l" bold>
            Chiudi
          </Text>
        )}
      </TouchableOpacity>
    );
  }, [JSON.stringify(options)]);

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
    <Modal
      visible={modalVisible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={SearchPickerController.hide}
    >
      <Header
        left={headerLeft}
        right={headerRight}
        searchBarOptions={searchBarOptions}
        borderBottom={typeof tabs != "undefined" ? false : true}
        containerStyle={{
          paddingTop: Platform.select({ ios: spacing }),
          paddingBottom: spacing * 0.5,
        }}
      />
      <View style={{ flex: 1 }}>
        {options.map((option: any, index: number) => {
          return (
            <CustomScreen
              key={index}
              ref={(ref) => (screens.current[index] = ref)}
              {...option}
              data={data}
              setData={setData}
              query={query}
              selected={selected}
              onPressItem={onPressItem}
            />
          );
        })}
      </View>
    </Modal>
  );
}
export { SearchPickerController };
export default SearchPicker;

const CustomScreen = forwardRef<any, any>(({ query, selected, onPressItem, ...option }, ref) => {
  const { Colors, spacing, icon_size } = useLayout();
  const { bottom } = useSafeAreaInsets();
  const [data, setData] = useState<any>({});

  useImperativeHandle(ref, () => ({
    setData: (newData: any) => setData(newData),
    getData: () => data,
  }));

  if (option.type == "modulepicker") {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.background }}>
        <ScreenDrawer
          content={option.content}
          flatListProps={{
            query,
            selected,
            onPressItem,
          }}
        />
        {typeof option.limit != "undefined" && option.limit > 1 && (
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
                if (typeof option != "undefined" && typeof option.type != "undefined") {
                  if (option.type == "modulepicker") {
                    const { limit = 1, content, module_id, onSuccess = () => {} } = option;

                    if (typeof selected != "undefined") {
                      SearchPickerController.hide();
                      onSuccess(
                        selected,
                        selected.map((x: any) => x.id)
                      );
                    }
                  }
                }
              }}
            />
          </View>
        )}
      </View>
    );
  }

  if (typeof option.type == "undefined") {
    return (
      <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.background }}>
        {typeof option.tabs != "undefined" && (
          <TabNavigation
            data={data}
            setData={setData}
            tabs={option.tabs.map((tab: any) => {
              return {
                ...tab,
                path: "/" + tab.id,
              };
            })}
          />
        )}

        {typeof option.tabs == "undefined" && (
          <ScreenDrawer
            data={data}
            setData={setData}
            content={option.content}
            // onChange={(details) => {
            //   setCanContinue(details.canContinue);
            // }}
          />
        )}
        {typeof option.footer != "undefined" && (
          <View
            style={{
              borderTopWidth: 1,
              borderColor: Colors.border,
              paddingBottom: (bottom == 0 ? spacing : bottom) - spacing,
            }}
          >
            <ScreenDrawer data={data} setData={setData} content={option.footer} />
            {/* {!canContinue && (
              <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.gray, opacity: 0.3 }} />
            )} */}
          </View>
        )}
      </View>
    );
  }
  return null;
});
