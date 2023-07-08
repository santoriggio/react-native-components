import config from "../utils/Config";
import deepMerge from "./deepMerge";
import triggerAction from "./triggerAction";
interface I {
  enpoint: string;
  params: any;
  options: {
    /**
     * @default 'POST'
     */
    method?: "POST" | "GET" | "PUT" | "DELETE";
    /**
     * Milliseconds to remain in cache
     * @example 60000 is 10 minutes
     */
    useCache?: number;
    headers?: {
      [key: string]: any;
    };
  };
}

/**


{
  type: 'listener',
  event: 'refreshUser',
  params: {}
}

 */

const sendApiRequest = async (
  endpoint: I["enpoint"],
  params: I["params"],
  options: I["options"] = {}
) => {
  const { method = "POST", useCache = 0, headers = {} } = options;

  if (endpoint[0] != "/") {
    endpoint = "/" + endpoint;
  }

  const currentConfig = config.getConfig();

  // if (typeof options !== "undefined") {
  //   if (typeof options.useCache !== "undefined" && options.useCache > 0) {
  //     const milliseconds = options.useCache * 60000;
  //     const cached: Cache = Cache.get(cache_key);

  //     if (typeof cached !== "undefined") {
  //       const cached_date = cached[1];

  //       if (cached_date + milliseconds > now) {
  //         return cached[0];
  //       }
  //     }
  //   }
  // }

  if (typeof currentConfig.sendApiRequest.url == "undefined") {
    throw new Error("'url' must be set before fetch data");
  }

  const result = await fetch(currentConfig.sendApiRequest.url + endpoint, {
    method,
    headers: deepMerge(currentConfig.sendApiRequest.headers, headers),
    body: JSON.stringify(params),
  });

  try {
    const json = await result.json();

    if (typeof result.headers != "undefined" && result.headers.map["x-fw360-action"]) {
      if (isJSON(result.headers.map["x-fw360-action"])) {
        const formatted = JSON.parse(result.headers.map["x-fw360-action"]);

        triggerAction(formatted);
      }
    }

    if (typeof json == "undefined" || json == null || Array.isArray(json)) {
      return {
        error: json,
      };
    }

    if (typeof json.error != "undefined") {
      if (typeof currentConfig.sendApiRequest.errors != "undefined") {
        if (typeof currentConfig.sendApiRequest.errors[json.error] != "undefined") {
          currentConfig.sendApiRequest.errors[json.error](json);
        }
      }

      // if (json.error == "customer_token_expired") {
      //   // Storage.clearStorage();
      //   // Cache.clear();
      // }

      // if (json.error == "obsolete_app_version") {
      // }
    }

    // if (typeof options !== "undefined" && typeof options.useCache !== "undefined") {
    //   Cache.set(cache_key, [json.data, now]);
    // }

    return json;
  } catch (e) {
    return {
      error: true,
      message: "Si è verificato un errore durante il collegamento, riprova.",
    };
  }
};

export default sendApiRequest;

function isJSON(json: string) {
  try {
    JSON.parse(json);
    return true;
  } catch (error) {
    return false;
  }
}
