import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import Animated, { useAnimatedScrollHandler } from "react-native-reanimated";
import { ActivityIndicator, ListRenderItem, RefreshControl } from "react-native";
import keyExist from "../functions/keyExist";
import sendApiRequest from "../functions/sendApiRequest";
import { FlatListMethods, FlatListProps } from "../types";
import NoData from "./NoData";
import Text from "./Text";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import ListItem from "./ListItem";
import { Loading, useLayout } from "..";

const FlatList = forwardRef<FlatListMethods, FlatListProps>(
  (
    { endpoint, query, params, canRefresh, enableDebugLogs, structure, path, handleErrors, scrollY, scrollX, ...props },
    ref
  ) => {
    const { spacing } = useLayout();
    const { data, isLoading, refresh, refreshing, hasMore, loadMore, details } = useGetListData({
      data: props.data,
      endpoint,
      query,
      params,
      enableDebugLogs,
      structure,
      path,
      handleErrors,
    });

    const onScroll = useAnimatedScrollHandler({
      onScroll: (event) => {
        if (scrollY) {
          scrollY.value = event.contentOffset.y;
        }
      },
    });

    const onEndReached = useCallback(() => {
      loadMore();
    }, [hasMore]);

    const keyExtractor = (item: any, index: number) => index.toString();

    if (typeof data == "undefined" && isLoading) {
      return <Loading skeletonPlaceholder={props.skeletonPlaceholder} />;
    }

    if (typeof data == "undefined") {
      return (
        <Text style={{ padding: 10, textAlign: "center" }}>
          No data found, please provide one of these two keys to see some data data / endpoint
        </Text>
      );
    }

    if (data.length == 0) {
      return <NoData icon="database" onRefresh={refresh} refreshing={refreshing} />;
    }

    const renderItem: ListRenderItem<{
      content: ScreenDrawerComponent[];
    }> = ({ item, index }) => {
      if (typeof props.renderItem != "undefined" && props.renderItem != null) {
        return props.renderItem;
      }

      return <ListItem {...item} defaultDetails={details} />;
    };

    return (
      <Animated.FlatList
        ref={ref}
        data={data}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={props.onEndReachedThreshold ? props.onEndReachedThreshold : 0.8}
        refreshControl={
          typeof canRefresh == "undefined" || canRefresh == true ? (
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          ) : undefined
        }
        ListFooterComponent={
          <>{hasMore && <ActivityIndicator style={{ alignSelf: "center", marginVertical: spacing }} size="small" />}</>
        }
        {...props}
      />
    );
  }
);

export { ListItem };
export default FlatList;

function useGetListData({ ...props }: Partial<FlatListProps>) {
  const enableDebugLogs = keyExist<FlatListProps["enableDebugLogs"]>(props.enableDebugLogs);
  const endpoint = keyExist<FlatListProps["endpoint"]>(props.endpoint);

  const [data, setData] = useState<any[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  const page = useRef<number>(1);
  const timeout = useRef<NodeJS.Timeout>();

  const [details, setDetails] = useState<any>(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async (newPage?: number) => {
    if (typeof endpoint == "undefined" || endpoint == "") {
      if (typeof keyExist(props.data) != "undefined" && props.data != null) {
        setData(props.data);
      }
      return setIsLoading(false);
    }

    setIsLoading(true);

    let params: any = {
      limit: typeof props.limit != "undefined" && typeof props.limit == "number" ? props.limit : 12,
      page: typeof newPage != "undefined" ? newPage : 1,
    };

    if (typeof props.structure != "undefined" && props.structure != "") {
      params["structure"] = props.structure;
    }

    if (typeof props.params != "undefined" && typeof props.params == "object") {
      params = {
        ...params,
        ...props.params,
      };
    }

    if (enableDebugLogs) {
      console.log(`📞 Fetch at ${endpoint} with`, params);
    }

    const apiResult = await sendApiRequest(endpoint, params);

    setIsLoading(false);
    setRefreshing(false);

    if (typeof apiResult.error != "undefined") {
      if (enableDebugLogs) {
        console.log(`🚨 Shit, something is wrong, see this error:`, apiResult.error);
      }

      setHasMore(false);

      const handleErrors = keyExist<FlatListProps["handleErrors"]>(props.handleErrors);

      if (typeof handleErrors != "undefined") {
        if (typeof handleErrors[apiResult.error] != "undefined") {
          //The handler for this error exist

          if (params.page == 1) {
            setData([]);
          }

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
        if (x.trim() != "") {
          toReturn = apiResult[x];
        }
      });
    }

    setDetails(apiResult.details);

    setHasMore(toReturn.length >= params.limit);

    setData((prevState) => {
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

  return { data, isLoading, refreshing, hasMore, refresh, loadMore, details };
}
