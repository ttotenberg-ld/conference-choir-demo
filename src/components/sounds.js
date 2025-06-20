import getTable from '../util/getTable';
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import MIDISounds from 'midi-sounds-react';
import rr from "../media/rko_rr.mp3";
import popSound1 from "../media/popSound1.mp3";
import popSound2 from "../media/popSound2.mp3";
import popSound3 from "../media/popSound3.mp3";
import popSound4 from "../media/popSound4.mp3";
import popSound5 from "../media/popSound5.mp3";
import popSound6 from "../media/popSound6.mp3";
import popSound7 from "../media/popSound7.mp3";
import useSound from "use-sound";
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function Sounds ({ flags, ldClient }) {

  // Functions to play and stop the soloist mp3
  const [play, { stop }] = useSound(rr, {
    interrupt: true,
    // Optimize for mobile - preload and enable HTML5 audio
    preload: true,
    html5: true,
    // Reduce volume slightly for mobile speakers
    volume: 0.8
  });

  // Initialize the midiSounds instance
  const midiSounds = useRef();

  // Cache flag values to avoid repeated evaluations
  const [currentChord, setCurrentChord] = useState(null);
  const [currentPart, setCurrentPart] = useState(null);

  // Pop sound files array with lazy loading
  const popSounds = useMemo(() => [
    popSound1,
    popSound2,
    popSound3,
    popSound4,
    popSound5,
    popSound6,
    popSound7
  ], []);

  // Create sound players for pop sounds with optimized settings
  const popSoundPlayers = useMemo(() => {
    return popSounds.map((soundFile, index) => {
      // Create individual sound hooks for each pop sound
      // We'll use these in the play function
      return {
        file: soundFile,
        index: index + 1
      };
    });
  }, [popSounds]);

  // Current playing pop sound ref to manage cleanup
  const currentPopSound = useRef(null);

  // Memoize table value
  const table = useMemo(() => getTable(), []);

  // Cache LaunchDarkly flag values
  useEffect(() => {
    const updateChord = () => {
      try {
        const chord = ldClient.variation("config-chord")?.notes;
        setCurrentChord(chord);
      } catch (error) {
        console.warn('Error getting chord variation:', error);
      }
    };

    const updatePart = () => {
      try {
        const part = ldClient.variation("enable-sound");
        setCurrentPart(part);
      } catch (error) {
        console.warn('Error getting part variation:', error);
      }
    };

    // Initial load
    updateChord();
    updatePart();
  }, [ldClient]);

  // Memoized chord calculation
  const processedSound = useMemo(() => {
    if (!currentChord || !currentPart) return [0];

    switch (currentPart) {
      case 'bass':
        return [currentChord[0]];
      case 'tenor':
        return [currentChord[1]];
      case 'alto':
        return [currentChord[2]];
      case 'soprano':
        return [currentChord[3]];
      case 'all':
        return currentChord;
      default:
        return [0];
    }
  }, [currentChord, currentPart]);

  // Function to play a random pop sound
  const playRandomPopSound = useCallback(() => {
    // Stop any currently playing pop sound
    if (currentPopSound.current) {
      currentPopSound.current.stop();
    }

    // Select random pop sound
    const randomIndex = Math.floor(Math.random() * popSounds.length);
    const selectedSound = popSounds[randomIndex];

    // Create and play the sound
    const audio = new Audio(selectedSound);
    audio.volume = 0.7; // Slightly lower volume for pop sounds
    audio.preload = 'auto';
    
    // Store reference for cleanup
    currentPopSound.current = {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    // Play the sound
    audio.play().catch(error => {
      console.warn('Error playing pop sound:', error);
    });

    // Clean up reference when sound ends
    audio.addEventListener('ended', () => {
      if (currentPopSound.current) {
        currentPopSound.current = null;
      }
    });

  }, [popSounds]);

  // Function to play choir sounds (for LaunchDarkly flag changes)
  const playChoirSound = useCallback(() => {
    if (!midiSounds.current) return;
    
    // Get fresh flag values
    const part = ldClient.variation("enable-sound");
    
    if (part === 'solo') {
      play();
    } else if (part && part !== 'none') {
      // Get fresh chord data
      const chord = ldClient.variation("config-chord")?.notes;
      if (chord) {
        let soundToPlay = [0];
        switch (part) {
          case 'bass':
            soundToPlay = [chord[0]];
            break;
          case 'tenor':
            soundToPlay = [chord[1]];
            break;
          case 'alto':
            soundToPlay = [chord[2]];
            break;
          case 'soprano':
            soundToPlay = [chord[3]];
            break;
          case 'all':
            soundToPlay = chord;
            break;
        }
        midiSounds.current.playChordNow(590, soundToPlay, 9999);
      }
    }
  }, [ldClient, play]);

  // Function for manual play button - handles both test sounds and choir sounds
  const playTestInstrument = useCallback(() => {
    if (flags.showSoundTest) {
      // Play random pop sound
      playRandomPopSound();
    } else {
      // Play choir sound based on current flags
      playChoirSound();
    }
  }, [flags.showSoundTest, playRandomPopSound, playChoirSound]);

  // Memoized stop function
  const stopTestInstrument = useCallback(() => {
    stop();
    
    // Stop any playing pop sound
    if (currentPopSound.current) {
      currentPopSound.current.stop();
      currentPopSound.current = null;
    }
    
    if (midiSounds.current) {
      midiSounds.current.cancelQueue();
    }
  }, [stop]);

  // Handle flag changes with proper cleanup
  useEffect(() => {
    // Set up event listeners
    const unsubscribers = [
      ldClient.on('change:enable-sound', (settings) => {
        const newPart = ldClient.variation("enable-sound");
        setCurrentPart(newPart);
        
        if (!midiSounds.current) return;
        
        // Stop current sounds
        stop();
        if (currentPopSound.current) {
          currentPopSound.current.stop();
          currentPopSound.current = null;
        }
        if (midiSounds.current) {
          midiSounds.current.cancelQueue();
        }
        
        // Play new sound based on updated flag
        if (newPart === 'solo') {
          play();
        } else if (newPart && newPart !== 'none') {
          playChoirSound();
        }
      }),
      
      ldClient.on('change:config-chord', (settings) => {
        const newChord = ldClient.variation("config-chord")?.notes;
        setCurrentChord(newChord);
        
        if (!midiSounds.current) return;
        
        const currentPartValue = ldClient.variation("enable-sound");
        
        // Stop current sounds
        stop();
        if (currentPopSound.current) {
          currentPopSound.current.stop();
          currentPopSound.current = null;
        }
        if (midiSounds.current) {
          midiSounds.current.cancelQueue();
        }
        
        // Only play if we're not in 'none' mode
        if (currentPartValue && currentPartValue !== 'none') {
          playChoirSound();
        }
      }),
      
      ldClient.on('change:show-sound-test', (settings) => {
        if (midiSounds.current && flags.showSoundTest) {
          stop();
          if (currentPopSound.current) {
            currentPopSound.current.stop();
            currentPopSound.current = null;
          }
          if (midiSounds.current) {
            midiSounds.current.cancelQueue();
          }
        }
      }),
      
      ldClient.on('change:show-buttons', (settings) => {
        if (midiSounds.current && flags.showButtons === false) {
          stop();
          if (currentPopSound.current) {
            currentPopSound.current.stop();
            currentPopSound.current = null;
          }
          if (midiSounds.current) {
            midiSounds.current.cancelQueue();
          }
        }
      })
    ];

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }
      });
    };
  }, [ldClient, flags.showSoundTest, flags.showButtons, play, stop, playChoirSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (currentPopSound.current) {
        currentPopSound.current.stop();
      }
      if (midiSounds.current) {
        midiSounds.current.cancelQueue();
      }
    };
  }, [stop]);

  // Early return optimization
  if (flags.showButtons !== true) {
    return <div />;
  }

  return (
    <div className="buttonContainer">
      <p>
        <button className="joinButton" onClick={playTestInstrument}>
          Play
        </button>
      </p>
      <p>
        <button className="leaveButton" onClick={stopTestInstrument}>
          Stop
        </button>
      </p>
      <div className="midiControllerContainer">
        <MIDISounds 
          className="midiController" 
          ref={midiSounds} 
          appElementName="root" 
          instruments={[590, 1218, 1219]} 
        />
      </div>
    </div>
  );
}

export default withLDConsumer()(Sounds);