import React, {useEffect, useState, useRef} from 'react';
import Webcam from "react-webcam";
import style from "./style.module.scss";
import {ReactMediaRecorder} from "react-media-recorder";
import ButtonLink from "../../components/ButtonLink";

export const VideoTestTwo = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const toggleStreaming = () => {
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
            <ReactMediaRecorder
                video
                render={({previewStream, status, startRecording, stopRecording, mediaBlobUrl}) => {
                    console.log(previewStream, 'previewStream');
                    return (
                        <div>
                            <p>{status}</p>
                            {seconds > 0 &&
                            <p><span>&#9673;</span>&nbsp;Streaming for {seconds}s</p>
                            }
                            <ButtonLink label={status === 'recording' ? 'Stop Streaming' : 'Start 30-sec Video Test with Friends'} onClick={status === 'recording' ? stopRecording : startRecording}/>
                            {mediaBlobUrl ?
                                <video src={mediaBlobUrl} autoPlay loop controls/> :
                                <VideoPreview stream={previewStream}/>
                            }
                        </div>
                    )
                }}
            />
            {/*<Webcam/>*/}
        </div>
    );
};


const VideoPreview = ({stream, mediaBlobUrl}: { stream: MediaStream | null }) => {
    const videoRef = useRef(null);
    useEffect(() => {
        console.log(stream && stream.getVideoTracks(), "stream.getVideoTracks()")
    }, [stream && stream.getVideoTracks()]);
    useEffect(() => {
        console.log(stream, "STREAM1");
        console.log(mediaBlobUrl, "mediaBlobUrl");
        const track = stream ? stream.getVideoTracks() : '';
        console.log(track, "track");
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);
    useEffect(() => {
        console.log(mediaBlobUrl, "mediaBlobUrl?!!!")
    }, [mediaBlobUrl]);
    if (mediaBlobUrl) {
        return <video src={mediaBlobUrl} autoPlay loop controls/>
    }
    if (!stream) {
        return null;
    }
    return <video ref={videoRef} width={500} height={500} autoPlay/>;
};
