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
import {
  View,
  Modal,
  BackHandler,
  TouchableOpacity,
  Platform,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import Animated, { FadeIn, SlideInDown, SlideOutDown, useSharedValue } from "react-native-reanimated";
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
import Flag, { FlagType } from "./Flag";
import { TabNavigationProps } from "../types";
import Loading from "./Loading";
import { getSystemAvailableFeaturesSync } from "react-native-device-info";
import AppSettings from "../utils/AppSettings";
import { MessageController } from "./Message";
import { launchImageLibrary } from "react-native-image-picker";
import { Storage } from "../utils/Storages";
import FlatList from "./FlatList";
import { Flags } from "../utils/Flags";
import uploadMedia from "../functions/uploadMedia";

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
  global?: 1 | 0;
  module_id: string;
  content: ScreenDrawerComponent[];
  onSuccess?: (selected: any[], id: string[]) => void;
};

type SearchOptions = {
  type: "search";
  limit?: number;
  params?: any;
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
  hide: (count?: number) => void;
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

  static hide = (count?: number) => {
    this.modalRef.current?.hide(count);
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
  const [options, setOptions] = useState<Options[]>([]);
  const [selected, setSelected] = useState<any[] | undefined>([]);
  const [query, setQuery] = useState<string>("");
  const [data, setData] = useState<any>({});
  const screens = useRef<any>({});

  useLayoutEffect(() => {
    SearchPickerController.setModalRef(modalRef);
  }, []);

  useImperativeHandle(modalRef, () => ({
    show: (option) => {
      setModalVisible(true);

      if (typeof option != "undefined") {
        const { limit = 1, ...other } = option;

        if (limit == 1) {
          setSelected(undefined);
        } else {
          if (
            typeof option.preselected != "undefined" &&
            Object.keys(option.preselected).length > 0
          ) {
            setSelected(option.preselected);
          }
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

      setQuery("");
    },
    hide: (count?: number) => {
      //refresh always the selected

      setSelected([]);
      setData({});

      if (options.length > 1) {
        //remove last option
        setOptions((prevState) => {
          if (typeof count != "undefined") {
            return prevState.slice(0, prevState.length - count);
          }
          return [prevState[0]];
        });
      } else {
        //hide the modal
        setModalVisible(false);
        setOptions([]);
      }

      setQuery("");
    },
    getData: () => {
      const index = options.length;
      return screens.current[index - 1].getData();
    },
    getStatus: () => modalVisible,
  }));

  useEffect(() => {
    if (typeof selected != "undefined" && selected.length > 0 && options.length > 0) {
      const lastElement = options[options.length - 1];

      if (lastElement.type == "modulepicker") {
        const { limit = 1, content, module_id, onSuccess = () => {} } = lastElement;

        if (limit == 1) {
          SearchPickerController.hide(1);
          onSuccess([selected[0]], [selected[0].id]);
        }
      }
    }
  }, [JSON.stringify(selected)]);

  const lastOption: Options = options.length > 0 ? options[options.length - 1] : { content: [] };

  const getTabs = async (m: string) => {
    if (m == "contenuti_media") {

      return uploadMedia(
        {
          mimetype: lastOption.mimetype,
          limit: lastOption.limit,
          onLoadStart: () => {
            const lastIndex = options.length - 1;
            const currentRef = screens.current[lastIndex];

            console.log(lastIndex, screens.current)

            currentRef.setLoading(true)
          }
        },
        lastOption.global
      );
    }

    SearchPickerController.show({
      tabs: {
        //@ts-ignore
        endpoint: "/modules/get",
        path: "/details",
        params: {
          module_id: m,
        },
      },
      footer: [
        {
          component: "button",
          title: "Salva",
          checkData: true,
          action: {
            type: "api",
            mergeData: true,
            endpoint: "/modules/save",
            return_data: 1,
            params: {
              module_id: m,
            },
            callback: (returndata: any) => {
              if (typeof returndata.error != "undefined") {
                return MessageController.show({
                  type: "alert",
                  title: typeof returndata.title != "undefined" ? returndata.title : "Ops",
                  message:
                    typeof returndata.message != "undefined"
                      ? returndata.message
                      : "Si è verificato un errore",
                });
              }

              AppSettings.emitListener("refresh", { [m]: true });

              //  SearchPickerController.hide()
            },
          },
        },
      ],
    });
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
    if (typeof lastOption.type != "undefined") {
      if (lastOption.type == "modulepicker") {
        return (
          <TouchableOpacity
            onPress={() => {
              getTabs(lastOption.module_id);
            }}
            activeOpacity={0.5}
            style={{ paddingHorizontal: spacing }}
          >
            <Text style={{ color: Colors.info }} size="l" bold>
              Aggiungi
            </Text>
          </TouchableOpacity>
        );
      }
    }
  }, [JSON.stringify(lastOption)]);

  const onPressItem = useCallback(
    (item: any) => {
      setSelected((prevState) => {
        if (typeof options != "undefined" && options.length > 0) {
          const lastElement = options[options.length - 1];

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
            SearchPickerController.hide(1);
            onSuccess([item], [item.id]);
          }
        }
      });
    },
    [JSON.stringify(options)]
  );

  const searchBarOptions = useMemo(() => {
    if (
      lastOption.type == "modulepicker" ||
      lastOption.type == "search" ||
      lastOption.type == "flag"
    ) {
      return {
        placeholder: "Cerca",
        onChangeText: (text: string) => {
          setQuery(text);
        },
      };
    }

    return undefined;
  }, [JSON.stringify(lastOption)]);


  if(!modalVisible) return null
  
  return (
    <Animated.View
      entering={SlideInDown}
      exiting={SlideOutDown}
      style={StyleSheet.absoluteFillObject}
      // visible={modalVisible}
      // animationType="slide"
      // presentationStyle='overFullScreen'

      // onRequestClose={() => SearchPickerController.hide(1)}
    >
      <Header
        left={headerLeft}
        right={headerRight}
        searchBarOptions={searchBarOptions}
        borderBottom={typeof lastOption.tabs != "undefined" ? false : true}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "height" : undefined}
        keyboardVerticalOffset={
          -bottom + spacing - (typeof lastOption.tabs != "undefined" ? top : 0)
        }
        style={{ flex: 1 }}
      >
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
              setSelected={setSelected}
              onPressItem={onPressItem}
            />
          );
        })}
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

export { SearchPickerController };
export default SearchPicker;

const CustomScreen = forwardRef<any, any>(
  ({ query, selected, setSelected, onPressItem, ...option }, ref) => {
    const { Colors, spacing, icon_size } = useLayout();
    const { bottom } = useSafeAreaInsets();
    const [data, setData] = useState<any>({});

    const [tabs, setTabs] = useState<any>(undefined);

    const [flags, setFlags] = useState<any>(Flags);

    const [canContinue, setCanContinue] = useState<boolean>(false);

    const [loading,setLoading] = useState<boolean>(false)

    useEffect(() => {
      if (option.type == "flag") {
        const queryToLowerCase = query.toLowerCase();

        const newArray = Flags.filter((flag: FlagType) => {
          if (typeof flag.name != "undefined") {
            const nameToLowerCase = flag.name.toLowerCase();

            if (nameToLowerCase.includes(queryToLowerCase)) return flag;
          }
        });

        return setFlags(newArray);
      }
    }, [query]);

    useEffect(() => {
      if (typeof option.tabs != "undefined") {
        if (Array.isArray(option.tabs)) {
          setTabs(option.tabs);
        } else {
          getTabs();
        }
      }
    }, []);

    const getTabs = async () => {
      const info = option.tabs;

      const apiResult = await sendApiRequest(info.endpoint, info.params);

      if (typeof apiResult.error != "undefined") {
        return SearchPickerController.hide();
      }

      let toReturn = apiResult.data;

      if (typeof info.path != "undefined") {
        info.path.split("/").map((x) => {
          if (x.trim() != "" && typeof toReturn[x] != "undefined") {
            toReturn = toReturn[x];
          }
        });
      }

      setTabs(toReturn);
    };

    useImperativeHandle(ref, () => ({
      setData: (newData: any) => setData(newData),
      getData: () => data,
      setLoading
    }));

    if (option.type == "modulepicker") {
      return (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.background }}>
          <ScreenDrawer
            content={option.content}
            flatListProps={{
              query,
              selected,
              setSelected,
              onPressItem,
              onLoadingStateChange: (state) => {
                setLoading(state)
              }
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
                title={loading ? 'Attendi': `Conferma (${typeof selected != "undefined" ? selected.length : 0})`}
               active={!loading}
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

    if (option.type == "flag") {
      const renderItem: any = ({ item, index }: any) => {
        return (
          <TouchableOpacity
            onPress={() => {
              SearchPickerController.hide(1);
              option.onSuccess(item);
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
            {typeof option.prefixVisible !== "undefined" && option.prefixVisible === true && (
              <Text style={{ color: Colors.gray, marginLeft: spacing }}>({item.dial_code})</Text>
            )}
            <Text numberOfLines={1} style={{ flex: 1, marginLeft: spacing }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      };
      return (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.background }}>
          <FlatList
            data={flags}
            initialNumToRender={20}
            renderItem={renderItem}
            contentInset={{ bottom }}
          />
        </View>
      );
    }

    if (typeof option.type == "undefined" || option.type == "" || option.type == "search") {
      return (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: Colors.background }}>
          {typeof option.tabs != "undefined" && (
            <>
              {typeof tabs != "undefined" ? (
                <TabNavigation
                  data={data}
                  setData={setData}
                  tabs={tabs.map((tab: any) => {
                    return {
                      ...tab,
                      path: "/" + tab.id,
                    };
                  })}
                  onChange={(details) => {
                    setCanContinue(details.canContinue);
                  }}
                />
              ) : (
                <Loading />
              )}
            </>
          )}

          {typeof option.tabs == "undefined" && (
            <ScreenDrawer
              flatListProps={{
                selected,
                setSelected,
                query,
                onPressItem,
              }}
              data={data}
              setData={setData}
              content={option.content}
              onChange={(details) => {
                setCanContinue(details.canContinue);
              }}
            />
          )}

          {typeof option.footer != "undefined" && (
            <View
              style={{
                borderTopWidth: 1,
                borderColor: Colors.border,
                padding: spacing,
                paddingBottom: bottom == 0 ? spacing : bottom,
              }}
            >
              <ScreenDrawer
                canContinue={canContinue}
                data={data}
                hasScroll={false}
                setData={setData}
                content={option.footer}
                hasMargin={false}
              />
            </View>
          )}

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
                  if (typeof option != "undefined") {
                    const { limit = 1, content, module_id, onSuccess = () => {} } = option;

                    if (typeof selected != "undefined") {
                      SearchPickerController.hide();
                      onSuccess(
                        selected,
                        selected.map((x: any) => x.id)
                      );
                    }
                  }
                }}
              />
            </View>
          )}
        </View>
      );
    }

    return null;
  }
);
