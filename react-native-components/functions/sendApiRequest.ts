interface I {
  enpoint: string;
  params: any;
  options: {
    useCache?: number;
  };
}

const sendApiRequest = async (endpoint: I["enpoint"], params: I["params"], options?: I["options"]) => {
  if (endpoint[0] != "/") {
    endpoint = "/" + endpoint;
  }

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

  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Fw360-Key": "global,2041",
    "X-Fw360-UserToken": "D0rSaGP1A2RzQcgXyBFpM3V4n7WZwd9OhINlEJH8",
    //   "X-Fw360-Useragent": globalThis.userAgent,
  };

  const result = await fetch("https://luigi.framework360.it/m/api/app" + endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(params),
  });
  const json = await result.json();

  if (typeof json == "undefined" || json == null || Array.isArray(json)) {
    return {
      error: json,
    };
  }

  if (typeof json.error != "undefined") {
    if (json.error == "customer_token_expired") {
      // Storage.clearStorage();
      // Cache.clear();
    }

    if (json.error == "obsolete_app_version") {
    }

    return json;
  }

  // if (typeof options !== "undefined" && typeof options.useCache !== "undefined") {
  //   Cache.set(cache_key, [json.data, now]);
  // }

  return json.data;
};

export default sendApiRequest;
