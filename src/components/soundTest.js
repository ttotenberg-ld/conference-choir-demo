import pop1 from "../media/popSound1.mp3";
import pop2 from "../media/popSound2.mp3";
import pop3 from "../media/popSound3.mp3";
import pop4 from "../media/popSound4.mp3";
import pop5 from "../media/popSound5.mp3";
import pop6 from "../media/popSound6.mp3";
import pop7 from "../media/popSound7.mp3";
import React, { useState } from 'react';
import useSound from "use-sound";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

const SoundTest = ({ flags }) => {
    

    const sounds = [
        pop1,
        pop2,
        pop3,
        pop4,
        pop5,
        pop6,
        pop7
      ];

    const [randomSound, setRandomSound] = useState(sounds[Math.floor(Math.random()*sounds.length)]);

    let [play] = useSound(randomSound);

    function clicked() {
        setRandomSound(sounds[Math.floor(Math.random()*sounds.length)]);
        play();
      }

    return (flags.showSoundTest && flags.showButtons) ? (
        <div>
            <br />
            <button className="soundTestButton" onClick={() => {clicked()}}>Play Test!</button>
        </div>
    ) : (
        <div />
    );
};

export default withLDConsumer()(SoundTest);