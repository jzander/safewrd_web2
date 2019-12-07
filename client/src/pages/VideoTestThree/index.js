import React, {useEffect, useState, useRef} from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';
import "./style.scss";

export const VideoTestThree = (props) => {
    const [error, setError] = useState(null);
    const [connection, setConnection] = useState('Connecting');
    const [publishVideo, setVideoPublish] = useState(true);

    const sessionEventHandlers = {
        sessionConnected: () => {
            setConnection('Connected')
        },
        sessionDisconnected: () => {
            setConnection('Disconnected')
        },
        sessionReconnected: () => {
            setConnection('Reconnected')
        },
        sessionReconnecting: () => {
            setConnection('Reconnecting')
        },
    }

    const publisherEventHandlers = {
        accessDenied: () => {
            console.log('User denied access to media source');
        },
        streamCreated: () => {
            console.log('Publisher stream created');
        },
        streamDestroyed: ({reason}) => {
            console.log(`Publisher stream destroyed because: ${reason}`);
        },
    }

    const subscriberEventHandlers = {
        videoEnabled: () => {
            console.log('Subscriber video enabled');
        },
        videoDisabled: () => {
            console.log('Subscriber video disabled');
        }
    }

    const onPublish = () => {
        console.log('Publish Success');
    };

    const onPublishError = () => setError(error);

    const onSubscribe = () => {
        console.log('Subscribe Success');
    };

    const onSubscribeError = error => setError(error);

    const toggleVideo = () => setVideoPublish(!publishVideo);

    const onSessionError = error => setError(error);


    const apiKey = '46473562';
    const sessionId = '1_MX40NjQ3MzU2Mn5-MTU3NTY4OTczOTUxOX5VODhpN2cxOHlmbEVPWXM0eVBGZUhUa3V-fg';
    const token = 'T1==cGFydG5lcl9pZD00NjQ3MzU2MiZzaWc9MzU5ZGJhZTc1MTYyZDA5ZTIwNzg0YmVlOTUxMWIzOWM2MzI3MzQxZDpzZXNzaW9uX2lkPTFfTVg0ME5qUTNNelUyTW41LU1UVTNOVFk0T1Rjek9UVXhPWDVWT0RocE4yY3hPSGxtYkVWUFdYTTBlVkJHWlVoVWEzVi1mZyZjcmVhdGVfdGltZT0xNTc1Njg5OTA0Jm5vbmNlPTAuOTQ5MjU3NTUzMTkzMDc3NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc1NjkzNTAyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

    return (

        <div>
            <div id="sessionStatus">Session Status: {connection}</div>
            {error ? (
                <div className="error">sad
                    <strong>Error:</strong> {error}
                </div>
            ) : null}
            <OTSession
                apiKey={apiKey}
                sessionId={sessionId}
                token={token}
                onError={onSessionError}
                eventHandlers={sessionEventHandlers}
            >
                <button id="videoButton" onClick={toggleVideo}>
                    {publishVideo ? 'Disable' : 'Enable'} Video
                </button>
                <OTPublisher
                    properties={{publishVideo, width: 50, height: 50,}}
                    onPublish={onPublish}
                    onError={onPublishError}
                    eventHandlers={publisherEventHandlers}
                />
                <OTStreams>
                    <OTSubscriber
                        properties={{width: 100, height: 100}}
                        onSubscribe={onSubscribe}
                        onError={onSubscribeError}
                        eventHandlers={subscriberEventHandlers}
                    />
                </OTStreams>
            </OTSession>
        </div>
    );
};