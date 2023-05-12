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
 * //TODO: Aggiungere i trigger dei picker
 *
 *
 */

async function triggerAction<T>(action: Action<T> | undefined, details?: T) {
  if (typeof action != "undefined") {
    if (typeof action == "function") {
      return action(details);
    }



    switch (action.type) {
      case "api":
        const endpoint = keyExist<ApiAction["endpoint"]>(action.endpoint, "isString");
        const params = keyExist<ApiAction["params"]>(action.params, "isObject");

        if (typeof endpoint != "undefined") {
          let merged = params
          if(typeof action.mergeData != 'undefined'&&action.mergeData ==true){
            merged =  deepMerge({ data: SearchPickerController.getData() }, params);
          }

          const apiResult = await sendApiRequest(endpoint, merged);



          if (typeof apiResult.error != "undefined") {
            //TODO:
            const message = apiResult.message;

            MessageController.show({
              type: "alert",
              title: "Ops",
              message: typeof message != "undefined" && message  != '' ? message.message : "Si è verificato un errore",
            });
            return;
          }

          const apiAction = keyExist<ApiAction["callback"]>(apiResult.data.action, "isObject");

          if (typeof apiAction != "undefined") {
            if (Array.isArray(apiAction)) {
              //array
              apiAction.forEach((act) => triggerAction(act));
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
            console.log(action.data);
            SearchPickerController.show({
              //@ts-ignore
              data: action.data,
              footer: action.footer,
              content: action.content,
            });
          }
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
