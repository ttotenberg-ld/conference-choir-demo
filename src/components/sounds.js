import React, { useRef } from 'react';
import MIDISounds from 'midi-sounds-react';
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function Sounds ({ flags, ldClient }) {
  const midiSounds = useRef();

  function getChord() {
    const chord = ldClient.variation("config-chord").notes;
    return chord
  }
  
  function getPart() {
    const part = ldClient.variation("enable-sound");
    return part
  }
  

  let sound = getChord();
  
  function getNewSound() {
    if (getPart() === 'bass') {
      sound = [getChord()[0]];
    } else if (getPart() === 'tenor') {
      sound = [getChord()[1]];
    } else if (getPart() === 'alto') {
      sound = [getChord()[2]];
    } else if (getPart() === 'soprano') {
      sound = [getChord()[3]];
    } else if (getPart() === 'all') {
      sound = getChord();
    } else {
      sound = [0];
    }
    return sound;
  }
  

  ldClient.on('change:enable-sound', (settings) => {
    if ((midiSounds.current) && (getNewSound() === [0])) {
      stopTestInstrument();
    } else if (midiSounds.current) {
      stopTestInstrument();
      playTestInstrument();
    }
  });

  ldClient.on('change:config-chord', (settings) => {
    if ((midiSounds.current) && (getNewSound() === [0])) {
      stopTestInstrument();
    } else if (midiSounds.current) {
      stopTestInstrument();
      playTestInstrument();
    }
  });

  ldClient.on('change:show-sound-test', (settings) => {
    if ((midiSounds.current) && (flags.showSoundTest)) {
      stopTestInstrument();
    }
  });

  const playTestInstrument = () => {
    midiSounds.current.playChordNow(590, getNewSound(), 9999);
  };

  const stopTestInstrument = () => {
    midiSounds.current.cancelQueue();
  }


  return (flags.showSoundTest === false) ? (
      <div className="App">
          <p className="App-intro">Join the choir!</p>
          <p><button onClick={playTestInstrument}>Play</button></p>
          <p>You are currently in the {getPart()} section!</p>
          <p className="App-intro">Stop the choir!</p>
          <p><button onClick={stopTestInstrument}>Stop!</button></p>
          <MIDISounds ref={midiSounds} appElementName="root" instruments={[590]} />
      </div>
  ) : (
    <div />
  );
}

export default withLDConsumer()(Sounds);