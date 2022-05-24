// import uuid from "uuid-js";
import { parseMetadata, getBrowserData } from "./utils";

/**
 * 思路：
 * 1. 用户埋点数据统计：
 *  - 使用sessionStorage存储，在用户离开页面或固定时间将sessionStorage中的数据上报
 */

const CONSTANTS = {
  BLOCK_STR: "bp-data",
};

((window, document) => {
  const buryingPoint = () => {
    const str = CONSTANTS.BLOCK_STR;

    // 给文档添加点击事件，当点击到埋点dom触发记录
    document.addEventListener("click", (e: HTMLElementEvent<any>) => {
      let target = e.target;

      while (target && target.parentNode) {
        if (target.hasAttribute(str)) {
          // 解析用户的埋点数据
          const metadata = target.getAttribute(str);
          if (metadata) {
            const data = parseMetadata(metadata);
            const sData = sessionStorage.getItem("@@a-point") as string;

            // 当已有相同数据，在数据上加1
            const v = JSON.parse(sData);
            if (v[data.id]) {
              v[data.id].count += 1;
            } else {
              v[data.id] = {
                count: 1,
                type: data.evt,
              };
            }
            sessionStorage.setItem("@@a-point", JSON.stringify(v));
          }
          break;
        }
        target = target.parentNode;
      }
    });
  };

  // 监听页面加载，添加埋点事件
  window.addEventListener("load", () => {
    console.log("开始准备埋点");

    // 记录用户浏览器数据
    sessionStorage.setItem(
      "@@a-point",
      JSON.stringify({
        browser: getBrowserData(window),
        pv: {
          [window.location.href]: 1,
        },
      })
    );

    buryingPoint();
  });

  // 监听页面路由变化，记录pv
  window.addEventListener("hashchange", (e) => {
    console.log(e);
    const sData = sessionStorage.getItem("@@a-point") as string;
    const v = JSON.parse(sData);

    if (v.pv[e.newURL]) {
      v.pv[e.newURL] += 1;
    } else {
      v.pv[e.newURL] = 1;
    }
    sessionStorage.setItem("@@a-point", JSON.stringify(v));
  });

  window.addEventListener("beforeunload", (e) => {
    console.log(e);
  });
})(window, document);
