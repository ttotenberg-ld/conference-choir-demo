import React, { useRef } from 'react';
import MIDISounds from 'midi-sounds-react';
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function Sounds ({ ldClient }) {

  const pitch = ldClient.variation("config-chord").notes;

  const midiSoundsRef = useRef();

  const playTestInstrument = () => {
    midiSoundsRef.current.playChordNow(472, [36], 2.5);
  };

  return (
      <div className="App">
          <p className="App-intro">Press Play to play instrument sound.</p>
          <p><button onClick={playTestInstrument}>Play</button></p>
          <MIDISounds ref={midiSoundsRef} appElementName="root" instruments={[3]} />
      </div>
  );
}

export default withLDConsumer()(Sounds);