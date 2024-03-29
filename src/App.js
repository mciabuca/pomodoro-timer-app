import React, { useState, useEffect, useRef } from 'react';
import './App.css';
const App = () => {
    const [sessionLength, setSessionLength] = useState(25);
    const [breakLength, setBreakLength] = useState(5);
    const [timerLabel, setTimerLabel] = useState('Session');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef(null);

    // Start the timer
    const startTimer = () => {
      if (!isRunning) {
          setIsRunning(true);
          timerRef.current = setInterval(() => {
              setTimeLeft(prev => Math.max(prev - 1, 0));
          }, 1000);
      }
  };
  

    // Stop the timer
    const stopTimer = () => {
        setIsRunning(false);
        clearInterval(timerRef.current);
    };

    // Reset the timer
    const resetTimer = () => {
        stopTimer();
        setSessionLength(25);
        setBreakLength(5);
        setTimeLeft(25 * 60);
        setTimerLabel('Session');
        // Reset audio
        const audio = document.getElementById('beep');
        audio.pause();
        audio.currentTime = 0;
    };

    // Increment session length
    const incrementSession = () => {
        if (sessionLength < 60) {
            setSessionLength(prev => prev + 1);
            if (timerLabel === 'Session') {
                setTimeLeft((sessionLength + 1) * 60);
            }
        }
    };

    // Decrement session length
    const decrementSession = () => {
        if (sessionLength > 1) {
            setSessionLength(prev => prev - 1);
            if (timerLabel === 'Session') {
                setTimeLeft((sessionLength - 1) * 60);
            }
        }
    };

    // Increment break length
    const incrementBreak = () => {
        if (breakLength < 60) setBreakLength(prev => prev + 1);
    };

    // Decrement break length
    const decrementBreak = () => {
        if (breakLength > 1) setBreakLength(prev => prev - 1);
    };

    useEffect(() => {
      if (isRunning && timeLeft === 0) {
        const audio = document.getElementById('beep');
        audio.play();
    
        setTimeout(() => {
          if (timerLabel === 'Session') {
            setTimerLabel('Break');
            setTimeLeft(breakLength * 60);
          } else {
            setTimerLabel('Session');
            setTimeLeft(sessionLength * 60);
          }
        }, 1);
      }
    }, [isRunning, timeLeft, sessionLength, breakLength, timerLabel]);
    
    

// Format time
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

return (
    <div className="app-container">
        <h1>Pomodoro Timer</h1>

        <div className="card">
            <div id="timer-label">{timerLabel}</div>
            <div id="time-left">{formatTime(timeLeft)}</div>

            <button id="start_stop" onClick={isRunning ? stopTimer : startTimer}>
                {isRunning ? 'Stop' : 'Start'}
            </button>
            <button id="reset" onClick={resetTimer}>Reset</button>
        </div>

        <div className="card">
            <div id="break-label">Break Length</div>
            <div className="control-group">
                <button id="break-decrement" onClick={decrementBreak}>-</button>
                <div id="break-length">{breakLength}</div>
                <button id="break-increment" onClick={incrementBreak}>+</button>
            </div>
        </div>

        <div className="card">
            <div id="session-label">Session Length</div>
            <div className="control-group">
                <button id="session-decrement" onClick={decrementSession}>-</button>
                <div id="session-length">{sessionLength}</div>
                <button id="session-increment" onClick={incrementSession}>+</button>
            </div>
        </div>

        <audio id="beep" preload="auto" src="https://example.com/beep.mp3" />
    </div>
  );
};

export default App;
