import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { ActivityIndicator, ListRenderItem, RefreshControl, FlatList as DefaultFlatList } from "react-native";
import keyExist from "../functions/keyExist";
import sendApiRequest from "../functions/sendApiRequest";
import { FlatListMethods, FlatListProps } from "../types";
import NoData from "./NoData";
import Text from "./Text";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import ListItem from "./ListItem";
import { Loading, useLayout, deepMerge, AppSettings } from "..";

const AnimatedFlatList = Animated.createAnimatedComponent<any>(DefaultFlatList);

const FlatList = forwardRef<DefaultFlatList<any>, FlatListProps<any>>(
  (
    {
      endpoint,
      query,
      params,
      unread,
      selected,
      //canRefresh,
      enableDebugLogs,
      structure,
      mergeParams = {},
      path,
      handleErrors,
      onPressItem,
      onLongPressItem,
      scrollY,
      scrollX,
      onLoadEnd,
      keysPath,
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
      const listener = AppSettings.addListener("refresh", (x) => {
      
        const module_id = typeof merged["module_id"] != "undefined" ? merged["module_id"] : undefined;

        if (typeof module_id != "undefined" && typeof x != "undefined" && typeof x[module_id] != "undefined") {
          if (x[module_id] == true) {
            refresh();
          }
        }
      });

      return () => listener.remove();
    }, []);

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        if (scrollY) {
          scrollY.value = event.contentOffset.y;
        }
      },
    });

    useImperativeHandle(ref, () => ({
      scrollToEnd(params?) {
        currentFlatlist.current.scrollToEnd(params);
      },
      scrollToIndex(params) {
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

    const keyExtractor = (item: any, index: number) => index.toString();

    if (typeof data == "undefined" && isLoading) {
      return <Loading skeletonPlaceholder={props.skeletonPlaceholder} />;
    }

    if (typeof data == "undefined") {
      return (
        <Text style={{ padding: spacing, textAlign: "center" }}>
          No data found, please provide one of these two keys to see some data data / endpoint
        </Text>
      );
    }

    if (data.length == 0) {
      return <NoData icon="database" onRefresh={refresh} refreshing={refreshing} />;
    }

    const renderItem = ({ item, index }: any) => {
      if (typeof props.renderItem != "undefined" && props.renderItem != null) {
        return props.renderItem;
      }

      return (
        <ListItem
          onPress={onPressItem}
          onLongPress={onLongPressItem}
          unread={typeof unread != "undefined" ? unread.some((x) => x == item.id) : undefined}
          selected={typeof selected != "undefined" ? selected.some((x) => x.id == item.id) : undefined}
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
        // refreshControl={
        //   typeof canRefresh == "undefined" || canRefresh == true ? (
        //     <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        //   ) : undefined
        // }
        ListFooterComponent={
          <>{hasMore && <ActivityIndicator style={{ alignSelf: "center", marginVertical: spacing }} size="small" />}</>
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
          props.onLoadEnd();
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
      props.onLoadEnd();
    }

    if (typeof apiResult.error != "undefined") {
      if (enableDebugLogs) {
        console.log(`🚨 Shit, something is wrong, see this error:`, apiResult.error);
      }

      setHasMore(false);

      if (params.page == 1) {
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

      console.log(toReturn.length);

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
