import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";

import sendApiRequest from "../functions/sendApiRequest";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import { CartProps } from "../types";
import AppSettings from "../utils/AppSettings";
import FlatList from "./FlatList";
import ScreenDrawer from "./ScreenDrawer";

/**
 *
 * action: {
 * type: 'listener',
 *
 * }
 */

function Cart({ ...props }: CartProps) {
  const [cart, setCart] = useState<any>(typeof props.data != "undefined" ? props.data : [{}]);

  const [header, setHeader] = useState<ScreenDrawerComponent[]>([]);

  const [raw_data, set_raw_data] = useState<any[]>(typeof props.data != "undefined" ? props.data : []);

  useEffect(() => {
    const listener = AppSettings.addListener(`onChange/${props.uniqueId}`, (event: any) => {
      console.log(event);
      if (event.event == "add") {
        return prepare([...raw_data, event.item]);
      }
      if (event.event == "remove") {
        return prepare(raw_data.filter((x) => x.id != event.item.id || x.type != event.item.type));
      }
    });

    return () => listener.remove();
  }, [JSON.stringify(raw_data)]);

  useEffect(() => {
    prepare(props.data);
  }, []);

  const prepare = async (newCart: any) => {
    const apiResult = await sendApiRequest("/cart/prepare", { uniqueId: props.uniqueId, cart: newCart });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    if (typeof apiResult.header != "undefined") {
      setHeader(apiResult.header);
    }

    set_raw_data(apiResult.data);
    return setCart(apiResult.content);
  };

  return <FlatList data={cart} ListHeaderComponent={<ScreenDrawer content={header} />} />;
}

export default Cart;
