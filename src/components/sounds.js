import getTable from '../util/getTable';
import React, { useRef, useState } from 'react';
import MIDISounds from 'midi-sounds-react';
import rr from "../media/rko_rr.mp3";
import useSound from "use-sound";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function Sounds ({ flags, ldClient }) {

  // Functions to play and stop the soloist mp3
  let [play, { stop }] = useSound(rr, {interrupt: true});

  // Initialize the midiSounds instance
  const midiSounds = useRef();

  // Call LD and return a JSON of notes in a chord
  function getChord() {
    const chord = ldClient.variation("config-chord").notes;
    return chord
  }
  
  // Call LD and return the part of the chord that should play
  function getPart() {
    const part = ldClient.variation("enable-sound");
    return part
  }
  
  let sound = getChord();
  
  // Assign the part of the overall chord that should be played
  // 'solo' and 'none' both don't play anything through the midi function
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
  
  // Listen to flag changes. Stop sounds if 'enable-sound' is set to 'none
  // Play sounds otherwise
  ldClient.on('change:enable-sound', (settings) => {
    if ((midiSounds.current) && (getPart() === 'none')) {
      stop();
      stopTestInstrument();
    } else if ((midiSounds.current) && (getPart() === 'solo')) {
      stop();
      stopTestInstrument();
      play();
    } else if (midiSounds.current) {
      stop();
      stopTestInstrument();
      playTestInstrument();
    }
  });

  ldClient.on('change:config-chord', (settings) => {
    if ((midiSounds.current) && (getPart() === 'none')) {
      stop();
      stopTestInstrument();
    } else if (midiSounds.current) {
      stop();
      stopTestInstrument();
      playTestInstrument();
    }
  });

  const soundTestList = [
    1218,
    1219
  ];

  const pitchTestList = [
    65,
    66,
    67,
    69,
    70,
    72
  ]

  const [randomSound, setRandomSound] = useState(soundTestList[Math.floor(Math.random()*soundTestList.length)]);
  const [randomPitch, setRandomPitch] = useState(pitchTestList[Math.floor(Math.random()*pitchTestList.length)]);

  // Stop sounds if we show sound test
  ldClient.on('change:show-sound-test', (settings) => {
    if ((midiSounds.current) && (flags.showSoundTest)) {
      stop();
      stopTestInstrument();
    }
  });

  // Stop sounds if we hide buttons
  ldClient.on('change:show-buttons', (settings) => {
    if ((midiSounds.current) && (flags.showButtons === false)) {
      stop();
      stopTestInstrument();
    }
  });

  // Function that plays the sounds
  const playTestInstrument = () => {
    if (flags.showSoundTest) {
      setRandomSound(soundTestList[Math.floor(Math.random()*soundTestList.length)]);
      setRandomPitch(pitchTestList[Math.floor(Math.random()*pitchTestList.length)]);
      midiSounds.current.playChordNow(randomSound, [randomPitch], 1)
    }
    if (getPart() === 'solo') {
      play();
    } else if (getPart() !== 'none') {
      midiSounds.current.playChordNow(590, getNewSound(), 9999);
    }
  };

  // Function that stops the sounds
  const stopTestInstrument = () => {
    stop();
    if (midiSounds.current) {
      midiSounds.current.cancelQueue();
    }
  }

  const table = getTable();

  if (flags.showButtons === true) {
    return (
    <div className="buttonContainer">
      <p><button className="joinButton" onClick={playTestInstrument}>Play</button></p>
      <br />
      
      <br />
      <p><button className="leaveButton" onClick={stopTestInstrument}>Stop</button></p>
      <div className="midiControllerContainer">
        <MIDISounds className="midiController" ref={midiSounds} appElementName="root" instruments={[590, 1218,
    1219]} />
      </div>
      <div className="part">
        <p>Hey table {table}. You're my favorite table.</p>
        <p>Don't tell the others.</p>
      </div>
    </div>
    );
  } else {
    return (
    <div />
    );
  }
}

export default withLDConsumer()(Sounds);