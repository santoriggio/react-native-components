import { MessageController } from "../components/Message";
import { Action, ApiAction, ListenerAction, PickerAction } from "../types";
import keyExist from "./keyExist";
import sendApiRequest from "./sendApiRequest";
import * as Linking from "expo-linking";
import AppSettings from "../utils/AppSettings";
import { FlagPickerController } from "../components/FlagPicker";

/**
 *
 * trigger Action function help to trigger the action of this library
 *
 * //TODO: Add all the actions
 *
 */

async function triggerAction(action: Action) {
  if (typeof action != "undefined") {
    if (typeof action == "function") {
      return action();
    }

    switch (action.type) {
      case "api":
        const endpoint = keyExist<ApiAction["endpoint"]>(action.endpoint, "isString");
        const params = keyExist<ApiAction["params"]>(action.params, "isObject");

        if (typeof endpoint != "undefined") {
          const apiResult = await sendApiRequest(endpoint, params);

          console.log(apiResult);

          if (typeof apiResult.error != "undefined") {
            MessageController.show({
              type: "alert",
              title: "Ops",
              message: "Si è verificato un errore",
            });
            return;
          }

          const callback = keyExist<ApiAction["callback"]>(action.callback, "isObject");

          if (typeof callback != "undefined") {
            //callback exist
            triggerAction(callback);
          }
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

        if(typeof picker != 'undefined'){
            if(picker == 'flag'){
                const callback = keyExist<ApiAction["callback"]>(action.callback, "isObject");

                if (typeof callback != "undefined") {
                  //callback exist
                  triggerAction(callback);
                }
               
                FlagPickerController.showModal({

                })


            }
        }

    }
  }
}

export default triggerAction;
