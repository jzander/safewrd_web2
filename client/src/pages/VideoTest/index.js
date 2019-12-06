import React, {useEffect, useState} from 'react';
import Webcam from "react-webcam";
import style from "./style.module.scss";
import ButtonLink from "../../components/ButtonLink";

export const VideoTest = (props) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const toggleStreaming = ()=>{
        setIsActive(!isActive);
        setSeconds(0)
    };

    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!isActive && seconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);


    return (
        <div className={style.videoWrapper}>
            <h1>Video Test</h1>
            {seconds > 0 &&
            <p><span>&#9673;</span>&nbsp;Streaming for {seconds}s</p>
            }
            <Webcam />
            <ButtonLink label={isActive ? 'Stop Streaming' : 'Start 30-sec Video Test with Friends'} onClick={toggleStreaming}/>
        </div>
    );
};