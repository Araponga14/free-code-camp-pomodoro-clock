import { useState, useEffect, useRef } from 'react';
import './App.css';
import Controller from './components/controller';

const DEFAULT_SESSION = 25; // 25 minutos
const DEFAULT_BREAK = 5; // 5 minutos

const toMs = (minutes) => minutes * 60000;

function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function App() {
    const [sessionTime, setSessionTime] = useState(toMs(0.3)); 
    const [breakTime, setBreakTime] = useState(toMs(DEFAULT_BREAK));
    const [currentSession, setCurrentSession] = useState(DEFAULT_SESSION);
    const [currentBreak, setCurrentBreak] = useState(DEFAULT_BREAK);
    const [isRunning, setIsRunning] = useState(false);
    const [isSession, setIsSession] = useState(true);
    const audioRef = useRef(null);

    const beepBeep = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0; // Reinicia o áudio para tocar do início
            audioRef.current.play();
        }
    };

    // Atualiza o tempo do timer a cada segundo
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            if (isSession) {
                setSessionTime((prev) => (prev > 0 ? prev - 1000 : 0));
            } else {
                setBreakTime((prev) => (prev > 0 ? prev - 1000 : 0));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning, isSession]);

    // Separa a troca de sessão para evitar problemas de atualização assíncrona
    useEffect(() => {
        if (sessionTime === 0 && isSession) {
            beepBeep();
            setTimeout(() => {
                setIsSession(false);
                setBreakTime(toMs(currentBreak));
            }, 1000); // Garante que o timer fique em 0 por 1 segundo antes de trocar
        }

        if (breakTime === 0 && !isSession) {
            beepBeep();
            setTimeout(() => {
                setIsSession(true);
                setSessionTime(toMs(currentSession));
            }, 1000);
        }
    }, [sessionTime, breakTime, isSession]);

    const toggleStartStop = () => {
        setIsRunning(!isRunning);
    };

    const reset = () => {
        setSessionTime(toMs(DEFAULT_SESSION));
        setBreakTime(toMs(DEFAULT_BREAK));
        setCurrentSession(DEFAULT_SESSION);
        setCurrentBreak(DEFAULT_BREAK);
        setIsRunning(false);
        setIsSession(true);   
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0; // Reinicia o áudio ao resetar
        }
    };

    return (
        <>
            <Controller
                controllerId='session'
                controllerValue={currentSession}
                incrementFunction={() => {
                    if (currentSession < 60) {
                        setCurrentSession(currentSession + 1);
                        setSessionTime(toMs(currentSession + 1));
                    }
                }}
                decrementFunction={() => {
                    if (currentSession > 1) {
                        setCurrentSession(currentSession - 1);
                        setSessionTime(toMs(currentSession - 1));
                    }
                }}
            />

            <div className='timer-container'>
                <h2 id='timer-label'>{isSession ? 'Session' : 'Break'}</h2>
                <span id='time-left'>{formatTime(isSession ? sessionTime : breakTime)}</span>
                <div className="buttons">
                     <button id='start_stop' onClick={toggleStartStop}>{isRunning ? 'Stop' : 'Start'}</button>
                     <button id='reset' onClick={reset}>Reset</button>
                </div>
            </div>

            <Controller
                controllerId='break'
                controllerValue={currentBreak}
                incrementFunction={() => {
                    if (currentBreak < 60) {
                        setCurrentBreak(currentBreak + 1);
                        setBreakTime(toMs(currentBreak + 1));
                    }
                }}
                decrementFunction={() => {
                    if (currentBreak > 1) {
                        setCurrentBreak(currentBreak - 1);
                        setBreakTime(toMs(currentBreak - 1));
                    }
                }}
            />

            <audio id="beep" ref={audioRef} src="/src/assets/beep.mp3" />
        </>
    );
}

export default App;
