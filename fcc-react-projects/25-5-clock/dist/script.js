import React, { useState, useEffect, useRef } from 'https://esm.sh/react@18.2.0';
import ReactDOM, { createRoot } from 'https://esm.sh/react-dom@18.2.0';

const initState = {
  session: {
    name: 'session',
    length: 25 * 60 },

  break: {
    name: 'break',
    length: 5 * 60 },

  start: 'start',
  stop: 'stop' };


function LengthControl(props) {
  const handleClick = event => {
    const increment = event.target.dataset.type === "increment";
    props.changeLength({
      type: props.type,
      length: props.length,
      increment: increment });

  };

  return /*#__PURE__*/(
    React.createElement("div", { class: "length-control-container" }, /*#__PURE__*/
    React.createElement("div", { id: props.type + "-label", class: "length-control-label" },
    props.type + " length"), /*#__PURE__*/

    React.createElement("div", { class: "length-control-timer" }, /*#__PURE__*/
    React.createElement("button", { id: props.type + "-decrement", class: "length-control-decrement",
      onClick: handleClick }, /*#__PURE__*/
    React.createElement("i", { class: "fa fa-caret-down", "aria-hidden": "true", "data-type": "decrement" })), /*#__PURE__*/

    React.createElement("div", { id: props.type + "-length" }, props.length / 60), /*#__PURE__*/
    React.createElement("button", { id: props.type + "-increment", class: "length-control-increment",
      onClick: handleClick }, /*#__PURE__*/
    React.createElement("i", { class: "fa fa-caret-up", "aria-hidden": "true", "data-type": "increment" })))));




}

function Timer(props) {
  const minutes = ('0' + Math.floor(props.value / 60)).slice(-2);
  const seconds = ('0' + props.value % 60).slice(-2) === '60' ? '00' : ('0' + props.value % 60).slice(-2);


  return /*#__PURE__*/(
    React.createElement("div", { id: "timer-container" }, /*#__PURE__*/
    React.createElement("div", { id: "timer-label" }, props.type), /*#__PURE__*/
    React.createElement("div", { id: "time-left" },
    `${minutes}:${seconds}`)));



}

function TimerControl(props) {
  return /*#__PURE__*/(
    React.createElement("div", { id: "timer-control-container" }, /*#__PURE__*/
    React.createElement("div", { id: "start_stop", onClick: props.toggleTimer }, /*#__PURE__*/
    React.createElement("i", { id: "start", className: "fa fa-play", "aria-hidden": "true" }), /*#__PURE__*/
    React.createElement("i", { id: "stop", className: "fa fa-pause", "aria-hidden": "true" })), /*#__PURE__*/

    React.createElement("div", { id: "reset", onClick: props.restartTimer }, /*#__PURE__*/
    React.createElement("i", { class: "fa fa-repeat", "aria-hidden": "true" }))));



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

  const changeLength = props => {
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
  };

  useEffect(() => {
    if (timerState === initState.start) {
      timer = setInterval(() => {
        setTimeLeft(prevTimeLeft => {
          if (prevTimeLeft > 0)
          return prevTimeLeft - 1;

          clearInterval(timer);
          return 0;
        });
      }, 1000);
    } else
    {
      clearInterval(timer);
    }

    return () => {
      clearInterval(timer);
    };
  }, [timerState, timerLabel]);

  useEffect(() => {
    let timeout;

    if (timeLeft === 0) {
      const newType = timerLabel === initState.session.name ?
      initState.break.name :
      initState.session.name;

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

  return /*#__PURE__*/(
    React.createElement("div", { id: "pomodoro-container" }, /*#__PURE__*/
    React.createElement("div", { id: "length-control-panel" }, /*#__PURE__*/
    React.createElement(LengthControl, { type: initState.break.name, length: breakLength, changeLength: changeLength }), /*#__PURE__*/
    React.createElement(LengthControl, { type: initState.session.name, length: sessionLength, changeLength: changeLength })), /*#__PURE__*/

    React.createElement(Timer, { type: timerLabel, value: timeLeft }), /*#__PURE__*/
    React.createElement(TimerControl, { toggleTimer: toggleTimer, restartTimer: restartTimer }), /*#__PURE__*/
    React.createElement("audio", { ref: audioRef, id: "beep", src: "https://cdn.freesound.org/previews/74/74410_1116629-lq.mp3" })));


}

const root = createRoot(document.getElementById('root'));
root.render( /*#__PURE__*/
React.createElement(React.StrictMode, null, /*#__PURE__*/
React.createElement(PomodoroApp, null)));