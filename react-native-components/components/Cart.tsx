import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSafeAreaFrame } from "react-native-safe-area-context";

import sendApiRequest from "../functions/sendApiRequest";
import { ScreenDrawerComponent } from "../ScreenDrawerTypes";
import { CartProps } from "../types";
import AppSettings from "../utils/AppSettings";
import FlatList from "./FlatList";
import ScreenDrawer from "./ScreenDrawer";
import { SearchPickerController } from "./SearchPicker";

/**
 *
 * action: {
 * type: 'listener',
 *
 * }
 */

function Cart({ ...props }: CartProps) {
  const [cart, setCart] = useState<any>([
    {
      content: [{ component: "text", title: "Carrello", subtitle: "Caricamento..." }],
    },
  ]);

  const [header, setHeader] = useState<ScreenDrawerComponent[]>([]);

  const [raw_data, set_raw_data] = useState<any[]>(typeof props.data != "undefined" ? props.data : []);

  useEffect(() => {
    const listener = AppSettings.addListener(`onChange/${props.uniqueId}`, (event: any) => {
      if (event.event == "add") {
        SearchPickerController.hide();

        return prepare([...raw_data, event.item]);
      }

      if (event.event == "set") {
        SearchPickerController.hide();
        const index = raw_data.findIndex((x) => x.id == event.item.id && x.type == event.item.type);

        let toReturn = raw_data;

        toReturn[index] = event.item;

        return prepare(toReturn);
      }

      if (event.event == "remove") {
        return prepare(raw_data.filter((x) => x.id != event.item.id || x.type != event.item.type));
      }
    });

    return () => listener.remove();
  }, [JSON.stringify(raw_data)]);

  useEffect(() => {
    if (typeof props.data != "undefined" && typeof props.data == "string") {
      prepare(props.data);
    } else {
      prepare();
    }
  }, []);

  const prepare = async (newCart?: any) => {
    const apiResult = await sendApiRequest("/cart/prepare", { uniqueId: props.uniqueId, cart: newCart });

    if (typeof apiResult.error != "undefined") {
      return;
    }

    if (typeof apiResult.data.header != "undefined") {
      setHeader(apiResult.data.header);
    }

    if (typeof props.onChange != "undefined") {
      props.onChange(props, JSON.stringify(apiResult.data.data));
    }

    set_raw_data(apiResult.data.data);
    return setCart(apiResult.data.content);
  };

  return <FlatList data={cart} ListHeaderComponent={<ScreenDrawer content={header} />} />;
}

export default Cart;
