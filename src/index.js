import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import { deviceType, osName } from "react-device-detect";
import getDeviceKey from "./util/getDeviceKey";
import getTable from "./util/getTable";

const CLIENTKEY = "609ead905193530d7c28647b";

let deviceKey = getDeviceKey();
let tableId = getTable();

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: CLIENTKEY,
    context: {
      kind: "device",
      key: deviceKey,
      //dynamically set these custom attributes using the deviceType and osName selectors from the npm package
      type: deviceType,
      os: osName,
      table: tableId
    },
  });

  ReactDOM.render(
    <LDProvider>
      <App />
    </LDProvider>,
    document.getElementById("root")
  );
})();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
