import { MessageController } from "../components/Message";
import { Action, ApiAction, ListenerAction, PickerAction, PopupAction } from "../types";
import keyExist from "./keyExist";
import sendApiRequest from "./sendApiRequest";
import * as Linking from "expo-linking";
import AppSettings from "../utils/AppSettings";
import { FlagPickerController } from "../components/FlagPicker";
import { BottomSheetController } from "../components/BottomSheet";
import { SearchPickerController } from "../components/SearchPicker";
import deepMerge from "./deepMerge";

/**
 *
 * trigger Action function help to trigger the action of this library
 *
 * //TODO: Possibilità di passare un array
 *
 *
 */

async function triggerAction<T>(
  action: Action<T> | Action<T>[] | undefined,
  details?: T,
  callback?: (details?: any) => void
) {
  if (typeof action != "undefined") {
    if (typeof action == "function") {
      return action(details);
    }

    if (Array.isArray(action)) {
      action.forEach((act: any) => triggerAction(act, details, callback));
      return;
    }

    switch (action.type) {
      case "api":
        const endpoint = keyExist<ApiAction["endpoint"]>(action.endpoint, "isString");
        const params = keyExist<ApiAction["params"]>(action.params, "isObject");

        if (typeof endpoint != "undefined") {
          let merged = params;

          if (typeof action.mergeData != "undefined" && action.mergeData == true) {
            merged = deepMerge({ data: SearchPickerController.getData() }, params);
          }

          if (typeof callback != "undefined") {
            callback({ loading: true });
          }

          const apiResult = await sendApiRequest(endpoint, merged);

          if (typeof callback != "undefined") {
            callback({ loading: false });
          }

          if (typeof apiResult.error != "undefined") {
            //TODO:
            const message = apiResult.message;
            const title = apiResult.title;
            MessageController.show({
              type: "alert",
              title: typeof title != "undefined" && title != "" ? title : "Ops",
              message: typeof message != "undefined" && message != "" ? message : "Si è verificato un errore",
            });
            return;
          }

          const apiAction = keyExist<ApiAction["callback"]>(apiResult.data.action, "isObject");

          if (typeof apiAction != "undefined") {
            if (Array.isArray(apiAction)) {
              //array
              apiAction.forEach((act, d, c) => triggerAction(act, d, c));
            } else {
              triggerAction(apiAction);
            }
          }

          // if (typeof callback != "undefined") {
          //   //callback exist
          //   triggerAction(callback);
          // }
        }
        break;
      case "link":
        const link = keyExist<string>(action.link, "isString");
        if (typeof link != "undefined") {
          //link exist
          Linking.openURL(link).catch((e) => {
            console.error(e);
            MessageController.show({
              type: "alert",
              title: "Ops",
              message: "Non siamo riusciti ad aprire questo link",
            });
          });
        }
        break;
      case "listener":
        const event = keyExist<ListenerAction["event"]>(action.event, "isString");

        if (typeof event != "undefined") {
          AppSettings.emitListener(event, action.params);
        }

        break;
      case "picker":
        const picker = keyExist<PickerAction["picker"]>(action.picker, "isString");

        if (typeof picker != "undefined") {
          if (picker == "flag") {
            FlagPickerController.show({
              content: [],
            });
          }

          if (picker == "search") {
            SearchPickerController.show({
              tabs: action.tabs,
              //@ts-ignore
              data: action.data,
              //@ts-ignore
              footer: action.footer,
              content: action.content,
            });
          }
        } else {
          SearchPickerController.hide();
        }
        break;
      case "popup":
        const content = keyExist<PopupAction["content"]>(action.content, "isArray");
        if (typeof content != "undefined") BottomSheetController.show(content);

        if (Object.keys(action).length == 1 && typeof content == "undefined") {
          BottomSheetController.hide();
        }

        break;
      case "message":
        MessageController.show(action.message);
        break;
    }
  }
}

export default triggerAction;
