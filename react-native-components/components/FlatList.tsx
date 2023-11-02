import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import {
  ActivityIndicator,
  ListRenderItem,
  RefreshControl,
  FlatList as DefaultFlatList,
} from "react-native";
import keyExist from "../functions/keyExist";
import sendApiRequest from "../functions/sendApiRequest";
import { FlatListMethods, FlatListProps } from "../types";
import NoData from "./NoData";
import Text from "./Text";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import ListItem from "./ListItem";
import { Loading, useLayout, deepMerge, AppSettings } from "..";
import { SearchPickerController } from "./SearchPicker";
const AnimatedFlatList = Animated.createAnimatedComponent<any>(DefaultFlatList);

const FlatList = forwardRef<DefaultFlatList<any>, FlatListProps<any>>(
  (
    {
      endpoint,
      query,
      params,
      unread,
      selected,
      setSelected,
      canRefresh,
      enableDebugLogs,
      structure,
      mergeParams = {},
      path,
      emptyList = {
        icon: "database",
        title: "Ancora nulla",
        subtitle: "Non esistono ancora dati in questa sezione",
        content: [],
      },
      handleErrors,
      onPressItem,
      onLongPressItem,
      scrollY,
      scrollX,
      onLoadEnd,
      keysPath,
      showLoading,
      ...props
    },
    ref
  ) => {
    const { spacing } = useLayout();

    const currentFlatlist = useRef<any>();

    const merged = deepMerge(params, mergeParams);

    const { data, isLoading, refresh, refreshing, hasMore, loadMore } = useGetListData({
      data: props.data,
      endpoint,
      query,
      params: merged,
      onLoadEnd,
      enableDebugLogs,
      structure,
      path,
      keysPath,
      handleErrors,
    });

    useEffect(() => { 
      if (props.onLoadingStateChange) {
        props.onLoadingStateChange(isLoading)
      }
    },[isLoading])

    useEffect(() => {
      const listener = AppSettings.addListener("refresh", (x) => {
        const module_id =
          typeof merged["module_id"] != "undefined" ? merged["module_id"] : undefined;

        if (
          typeof module_id != "undefined" &&
          typeof x != "undefined" &&
          typeof x[module_id] != "undefined"
        ) {
          if (x[module_id] == true) {
            refresh();

            if (typeof x.preselected != "undefined") {
              //in picker

              if (SearchPickerController.isVisible()) {
                updateP(x.preselected);
              }
            }
          }
        }
      });

      return () => listener.remove();
    }, []);

    const updateP = (p: any) => {
      if (typeof setSelected != "undefined") {
        setSelected((prevState: any) => {
          if (typeof prevState != "undefined") {
            return [...prevState, ...p];
          }
          return p;
        });
      }
    };

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        if (scrollY) {
          scrollY.value = event.contentOffset.y;
        }
      },
    });

    useImperativeHandle(ref, () => ({
      scrollToEnd(params?) {
        if (typeof currentFlatlist.current == "undefined") return;

        currentFlatlist.current.scrollToEnd(params);
      },
      scrollToIndex(params) {
        if (typeof currentFlatlist.current == "undefined") return;

        currentFlatlist.current.scrollToIndex(params);
      },
      refresh,
    }));

    // const onPress = useCallback(
    //   (item: any) => {
    //     if (typeof onPressItem != "undefined") {
    //       return onPressItem(item);
    //     }
    //   },
    //   [JSON.stringify(onPressItem)]
    // );

    // const onLongPress = useCallback(
    //   (item: any) => {
    //     if (typeof onLongPressItem != "undefined") {
    //       onLongPressItem(item);
    //     }
    //   },
    //   [JSON.stringify(onLongPressItem)]
    // );

    const onEndReached = useCallback(() => {
      loadMore();
    }, [hasMore]);

    const keyExtractor = (item: any, index: number) => {
      let toReturn = index + "-";
      if (typeof item.id != "undefined" && item.id != null && item.id != "") {
        toReturn = toReturn + item.id;
      }

      return toReturn;
    };

    if (
      (typeof showLoading == "undefined" || showLoading == true) &&
      typeof data == "undefined" &&
      isLoading
    ) {
      return <Loading skeletonPlaceholder={props.skeletonPlaceholder} />;
    }

    if (typeof data == "undefined" && isLoading == false) {
      return (
        <NoData
          icon={emptyList.icon}
          title={emptyList.title}
          subtitle={emptyList.subtitle}
          onRefresh={refresh}
          refreshing={refreshing}
          content={emptyList.content}
        />
      );
    }

    if (typeof data != "undefined" && data.length == 0 && isLoading == false) {
      return (
        <NoData
          icon={emptyList.icon}
          title={emptyList.title}
          subtitle={emptyList.subtitle}
          onRefresh={refresh}
          refreshing={refreshing}
          content={emptyList.content}
        />
      );
    }

    const renderItem = ({ item, index }: any) => {
      if (typeof props.renderItem != "undefined" && props.renderItem != null) {
        return props.renderItem;
      }

      const isLast = typeof data != "undefined" && typeof data[index + 1] == "undefined";

      return (
        <ListItem
          onPress={onPressItem}
          onLongPress={onLongPressItem}
          unread={typeof unread != "undefined" ? unread.some((x) => x == item.id) : undefined}
          selected={
            typeof selected != "undefined" ? selected.some((x) => x.id == item.id) : undefined
          }
          isLast={isLast}
          {...item}
        />
      );
    };

    return (
      <AnimatedFlatList
        ref={currentFlatlist}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold ? props.onEndReachedThreshold : 0.8}
        refreshControl={
          typeof canRefresh == "undefined" || canRefresh == true ? (
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          ) : undefined
        }
        ListFooterComponent={
          <>
            {hasMore && (
              <ActivityIndicator
                style={{ alignSelf: "center", marginVertical: spacing }}
                size="small"
              />
            )}
          </>
        }
        renderItem={renderItem}
        data={data}
        {...props}
      />
    );
  }
);

export { ListItem };
export default FlatList;

const _millis = 350;

function useGetListData<T>({ ...props }: Partial<FlatListProps<T>>) {
  const firstRun = useRef<boolean>(true);
  const enableDebugLogs = keyExist<FlatListProps<T>["enableDebugLogs"]>(props.enableDebugLogs);
  const endpoint = keyExist<FlatListProps<T>["endpoint"]>(props.endpoint);

  const [data, setData] = useState<T[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const page = useRef<number>(1);
  const timeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (firstRun.current) {
      //first run
      getData();
    } else {
      if (timeout.current) clearTimeout(timeout.current);

      setIsLoading(true);
      setData(undefined);

      timeout.current = setTimeout(() => {
        page.current = 1;
        getData();
      }, _millis);
    }

    firstRun.current = false;
  }, [props.query, JSON.stringify(props.params)]);

  const getData = async (newPage?: number) => {
    if (typeof endpoint == "undefined" || endpoint == "") {
      if (typeof keyExist(props.data) != "undefined" && props.data != null) {
        setData(props.data as any);
        if (typeof props.onLoadEnd != "undefined" && typeof props.onLoadEnd == "function") {
          props.onLoadEnd(props.data);
        }
      }
      return setIsLoading(false);
    }

    setIsLoading(true);

    let params: any = {
      query: props.query,
      limit: 12,
      page: typeof newPage != "undefined" ? newPage : 1,
    };

    if (typeof props.structure != "undefined" && props.structure != "") {
      params["structure"] = props.structure;
    }

    if (typeof props.params != "undefined" && typeof props.params == "object") {
      params = deepMerge(params, props.params);
    }

    if (enableDebugLogs) {
      console.log(`📞 Fetch at ${endpoint} with`, params);
    }

    const apiResult = await sendApiRequest(endpoint, params);

    setIsLoading(false);
    setRefreshing(false);

    if (typeof data == "undefined" && params.page == 1 && typeof props.onLoadEnd != "undefined") {
      props.onLoadEnd(apiResult.data);
    }

    if (typeof apiResult.error != "undefined") {
      if (enableDebugLogs) {
        console.log(`🚨 Shit, something is wrong, see this error:`, apiResult.error);
      }

      setHasMore(false);

      if (params.page == 1) {
        console.log(params.page);
        setData([]);
      }

      const handleErrors = keyExist<FlatListProps<T>["handleErrors"]>(props.handleErrors);

      if (typeof handleErrors != "undefined") {
        if (typeof handleErrors[apiResult.error] != "undefined") {
          //The handler for this error exist

          return;
        }
      }

      return;
    }

    if (enableDebugLogs) {
      console.log(`✅ Good work`);
    }

    let toReturn = apiResult;

    if (typeof props.path != "undefined") {
      props.path.split("/").map((x) => {
        if (x.trim() != "" && typeof toReturn[x] != "undefined") {
          toReturn = toReturn[x];
        }
      });
    }

    if (typeof props.keysPath != "undefined" && Array.isArray(props.keysPath)) {
      props.keysPath.forEach((key) => {
        let dataToReturn = apiResult;

        key.path.split("/").map((x) => {
          if (x.trim() != "" && typeof dataToReturn[x] != "undefined") {
            dataToReturn = dataToReturn[x];
          }
        });

        if (typeof key.onKeyFound != "undefined") {
          key.onKeyFound(dataToReturn);
        }
      });
    }

    setHasMore(toReturn.length >= params.limit);

    setData((prevState) => {
      if (typeof prevState == "undefined" && toReturn.length == 0) {
        return [];
      }

      if (typeof prevState == "undefined" || params.page == 1) {
        return toReturn;
      }

      return [...prevState, ...toReturn];
    });
  };

  const refresh = () => {
    if (typeof endpoint != "undefined" && !refreshing) {
      if (enableDebugLogs) {
        console.log(`REFRESHINGGGG`);
      }

      page.current = 1;

      setRefreshing(true);
      getData();
    }
  };

  const loadMore = () => {
    if (typeof endpoint != "undefined" && !isLoading && hasMore) {
      const newPage = page.current + 1;
      page.current = newPage;

      if (enableDebugLogs) {
        console.log(`💁‍♀️ I need more Daddy, let's go to ${newPage} page!`);
      }

      getData(newPage);
    }
  };

  return { data, isLoading, refreshing, hasMore, refresh, loadMore };
}
