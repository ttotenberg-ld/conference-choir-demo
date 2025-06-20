import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";
import Observability from '@launchdarkly/observability';
import { deviceType, osName } from "react-device-detect";
import getDeviceKey from "./util/getDeviceKey";

const CLIENTKEY = "609ead905193530d7c28647b";

let deviceKey = getDeviceKey();

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: CLIENTKEY,
    context: {
      kind: "device",
      key: deviceKey,
      //dynamically set these custom attributes using the deviceType and osName selectors from the npm package
      type: deviceType,
      os: osName
    },
    plugins: [ new Observability() ]
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
