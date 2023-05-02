import pop1 from "../media/popSound1.mp3";
import pop2 from "../media/popSound2.mp3";
import pop3 from "../media/popSound3.mp3";
import pop4 from "../media/popSound4.mp3";
import pop5 from "../media/popSound5.mp3";
import pop6 from "../media/popSound6.mp3";
import pop7 from "../media/popSound7.mp3";
import styled from "styled-components";
import React, { useState } from 'react';
import useSound from "use-sound";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

const Button = styled.button`
        background-color: black;
        color: white;
        font-size: 20px;
        padding: 10px 60px;
        border-radius: 5px;
        margin: 10px 10px;
        cursor: pointer;

        &:disabled {
            color: grey;
            opacity: 0.7;
            cursor: default;
    }
    `;

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

    return flags.showSoundTest ? (
        <div>
            <br />
            <Button onClick={() => {clicked()}}>
            <b>Play Test!</b>
            </Button>
        </div>
    ) : (
        <div />
    );
};

export default withLDConsumer()(SoundTest);