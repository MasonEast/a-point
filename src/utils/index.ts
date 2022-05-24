import UA from "ua-device";

export function parseMetadata(metadata: string) {
  let data: Record<string, string> = {};

  if (metadata.includes("{")) {
    metadata = metadata.replace(/\s/g, "");
    const str = metadata.substring(1, metadata.length - 1);
    str.split(",").forEach((item) => {
      const kvArr = item.split(":");
      const k = kvArr[0];
      const v = kvArr[1];
      data[k] = v;
    });
  } else {
    data = {
      id: metadata,
      evt: "click",
    };
  }

  return data;
}

export function getBrowserData(parent: Window) {
  const scr = parent.screen,
    nav = navigator,
    ua = nav.userAgent,
    protocol = "https:" === parent.location.protocol ? "https://" : "http://",
    // 上报地址，根据项目情况配置
    host = "localhost:6869",
    baseUrl = protocol + host;

  const uaOutput = new UA(ua);
  const { os, browser, engine } = uaOutput;

  // 浏览器信息
  return {
    // 屏幕宽高
    size: scr.width + "x" + scr.height,
    // 网络类型
    network: nav?.connection.type ? nav.connection.type : "",
    // 语言
    language: nav.language || "",
    timezone: new Date().getTimezoneOffset() / 60 || "",
    ua: encodeURIComponent(ua),
    os: encodeURIComponent(os.name + "_" + os.version.original),
    browser: browser.name + "_" + browser.version.original,
    engine: engine.name + "_" + engine.version.original,
  };
}
