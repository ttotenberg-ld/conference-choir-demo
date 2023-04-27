import React, { useRef } from 'react';
import MIDISounds from 'midi-sounds-react';
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function Sounds ({ flags, ldClient }) {

  const chord = ldClient.variation("config-chord").notes;

  const part = ldClient.variation("enable-sound");

  let sound = chord;

  if (part === 'bass') {
    sound = [chord[0]]
  } else if (part === 'tenor') {
    sound = [chord[1]]
  } else if (part === 'alto') {
    sound = [chord[2]]
  } else if (part === 'soprano') {
    sound = [chord[3]]
  } else if (part === 'all') {
    sound = chord
  } else {
    sound = null
  }


  const midiSoundsRef = useRef();

  const playTestInstrument = () => {
    midiSoundsRef.current.playChordNow(590, sound, 1.5);
  };

  return (
      <div className="App">
          <p className="App-intro">Join the choir!</p>
          <p><button onClick={playTestInstrument}>Play</button></p>
          <MIDISounds ref={midiSoundsRef} appElementName="root" instruments={[3]} />
      </div>
  );
}

export default withLDConsumer()(Sounds);