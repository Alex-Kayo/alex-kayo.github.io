import React from 'https://esm.sh/react@18.2.0';
import ReactDOM from 'https://esm.sh/react-dom@18.2.0';
import { Provider, useSelector, useDispatch } from 'https://esm.sh/react-redux@8.0.5';
import { configureStore, createSlice } from "https://cdn.skypack.dev/@reduxjs/toolkit@1.9.3";

// Redux part

const soundSlice = createSlice({
  name: 'sound',
  initialState: {
    currentSound: '',
    currentLetter: ''
  },
  reducers: {
    setCurrentSound: (state, action) => {
      state.currentSound = action.payload.sound;
      state.currentLetter = action.payload.letter;
    },
  }
});

const store = configureStore({
  reducer: {
    sound: soundSlice.reducer,
  }
});

// React part

const DrumDisplayComponent = () => {
  const currentSound = useSelector((state) => state.sound.currentSound);

  return (
    <div id="display">
      {currentSound}
    </div>
  );
}

const DrumPadComponent = (props) => {
  const handleClick = (event) => {
    const audio = event.target.querySelector('audio');
    if (audio) {
      audio.play();
      store.dispatch(soundSlice.actions.setCurrentSound({ sound: props.id, letter: props.letter }));
    }
  }
  
  return (
    <div id={props.id} className="drum-pad" onClick={handleClick}>
      <audio id={props.letter} className="clip" src={props.src} type="audio/mpeg" />
      {props.letter}
    </div>
  );
}

const DrumMachineComponent = () => {
  const drumLetters = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];
  const soundSources = [
  ['Kick drum', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'],
  ['Snare drum', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'],
  ['Closed hi-hat', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'],
  ['Clap', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'],
  ['Percussion', 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'],
  ['Open hi-hat', 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'],
  ['Side stick', 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'],
  ['Cowbell', 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'],
  ['Bass hit', 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3']
  ];
  // I know I'm supposed to keep this separately, sorry
  
  const drumPads = drumLetters.map(
    (letter, index) => <DrumPadComponent
                         id={soundSources[index][0]}
                         src={soundSources[index][1]}
                         letter={letter} />
  );
  
  const handleKeyPress = (event) => {
    const key = event.key.toUpperCase();
    if (drumLetters.includes(key)) {
      const pad = document.getElementById(key).parentElement;
      if (pad) {
        pad.click();
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div id="drum-machine">
      <DrumDisplayComponent />
      <div id="drum-pads-container">
        {drumPads}
      </div>
    </div>
  );
}

const App = () => {
  return (
    <DrumMachineComponent />
  );
};

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);