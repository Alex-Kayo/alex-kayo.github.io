import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0';

const initState = {
  session: {
    name: 'session',
    length: 25 * 60
  },
  break: {
    name: 'break',
    length: 5 * 60
  },
  start: 'start',
  stop: 'stop'
};

function LengthControl(props) {
  const handleClick = (event) => {
    const increment = event.target.dataset.type === "increment";
    props.changeLength({
      type: props.type,
      length: props.length,
      increment: increment
    });
  }
  
  return (
    <div className="length-control-container">
      <div id={props.type + "-label"} className="length-control-label">
        {props.type + " length"}
      </div>
      <div className="length-control-timer">
        <button id={props.type + "-decrement"} className="length-control-decrement"
          onClick={handleClick}>
          <i className="fa fa-caret-down" aria-hidden="true" data-type="decrement"></i>
          </button>
        <div id={props.type + "-length"}>{props.length / 60}</div>
        <button id={props.type + "-increment"} className="length-control-increment"
          onClick={handleClick}>
          <i className="fa fa-caret-up" aria-hidden="true" data-type="increment"></i>
          </button>
      </div>
    </div>
  );
}

function Timer(props) {
  const minutes = ('0' + Math.floor((props.value) / 60)).slice(-2);
  const seconds = ('0' + ((props.value) % 60)).slice(-2) === '60' ? '00' : ('0' + ((props.value) % 60)).slice(-2);

  
  return (
    <div id="timer-container">
      <div id="timer-label">{props.type}</div>
      <div id="time-left">
        {`${minutes}:${seconds}`}
      </div>
    </div>
  );
}

function TimerControl(props) {  
  return (
    <div id="timer-control-container">
      <div id="start_stop" onClick={props.toggleTimer}>
        <i id="start" className="fa fa-play" aria-hidden="true"></i>
        <i id="stop" className="fa fa-pause" aria-hidden="true"></i>
        </div>
      <div id="reset" onClick={props.restartTimer}>
        <i className="fa fa-repeat" aria-hidden="true"></i>
      </div>
    </div>
  );
}

function PomodoroApp() {
  const [breakLength, setBreakLength] = useState(initState.break.length);
  const [sessionLength, setSessionLength] = useState(initState.session.length);
  const [timerLabel, setTimerLabel] = useState(initState.session.name);
  const [timerState, setTimerState] = useState(initState.stop);
  const [timeLeft, setTimeLeft] = useState(initState.session.length);
  const audioRef = useRef(null);
  const timerStateRef = useRef(timerState);
  
  let timer;
  
  const changeLength = (props) => {
    if (timerState === initState.start) return;

    const newLength = (props.length + (props.increment ? 60 : -60)) % 3600;
    if (newLength > 0 && newLength <= 3600) {
      if (props.type === initState.session.name) {
        setSessionLength(newLength);
      } else {
        setBreakLength(newLength);
      }
      if (props.type === timerLabel) setTimeLeft(newLength);
    }
  };
  
  const toggleTimer = () => {
    if (timerState === initState.stop) {
      setTimerState(initState.start);
    } else {
      setTimerState(initState.stop);
      clearInterval(timer);
    }
  };
  
  const restartTimer = () => {
    clearInterval(timer);
    setTimerState(() => initState.stop);
    setBreakLength(() => initState.break.length);
    setSessionLength(() => initState.session.length);
    setTimerLabel(() => initState.session.name);
    setTimeLeft(() => initState.session.length);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }
  
  useEffect(() => {
    if (timerState === initState.start) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft > 0)
            return prevTimeLeft - 1;

          clearInterval(timer);
          return 0;
        });
      }, 1000);
    }
    else {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    }
  }, [timerState, timerLabel]);
  
  useEffect(() => {
    let timeout;

    if (timeLeft === 0) {
      const newType = timerLabel === initState.session.name
        ? initState.break.name
        : initState.session.name;

      if (timerState === initState.start) {
        timeout = setTimeout(() => {
          if (timerStateRef.current === initState.start) {
            setTimeLeft(newType === initState.break.name ? breakLength : sessionLength);
            setTimerLabel(newType);
          }
        }, 3000);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [timeLeft]);
  
  useEffect(() => {
    timerStateRef.current = timerState;
  }, [timerState]);
  
  useEffect(() => {
    if (timeLeft === 0) {
      audioRef.current.play();
    }
  }, [timeLeft]);
  
  useEffect(() => {
    if (timerState === initState.stop && timeLeft === initState.session.length) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [timerState, timeLeft]);
  
  return (
    <div id="pomodoro-container">
      <div id="length-control-panel">
        <LengthControl type={initState.break.name} length={breakLength} changeLength={changeLength} />
        <LengthControl type={initState.session.name} length={sessionLength} changeLength={changeLength} />
      </div>
      <Timer type={timerLabel} value={timeLeft} />
      <TimerControl toggleTimer={toggleTimer} restartTimer={restartTimer} />
      <audio ref={audioRef} id="beep" src="https://cdn.freesound.org/previews/74/74410_1116629-lq.mp3" />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <PomodoroApp />
  </React.StrictMode>
);