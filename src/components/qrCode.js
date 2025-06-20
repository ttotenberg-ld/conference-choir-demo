import QRCode from "react-qr-code";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

//Change QRURL to the URL where you'll be hosting this app
let QR_URL = document.location.toString();

const qrCodeHome = ({ flags }) => {

    // The React SDK automatically converts flag keys with dashes and periods to camelCase.
    // See this page for details: https://docs.launchdarkly.com/sdk/client-side/react/react-web#flag-keys
    return flags.showConferenceQrCode ? (
    <div>
      <br />
      <span style={{ color: 'black' }}><center>Scan me!</center></span>
      <div className="qr-wrapper">
        <QRCode value={QR_URL} />
      </div>
    </div>
  ) : (
    <div></div>
  );
};

export default withLDConsumer()(qrCodeHome);