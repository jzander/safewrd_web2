import React, {useEffect, useState, useRef} from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';
import "./style.scss";

export const VideoTestFour = (props) => {
    const {match} = props;
    const {id, session} = match.params;
    const [error, setError] = useState(null);
    const [connection, setConnection] = useState('Connecting');
    const [publishVideo, setVideoPublish] = useState(false);
    const [user, setUser] = useState({});

    useEffect(() => {
        fetch(
            `https://api.tranzmt.it/v1/patron/contacts?user_id=${id}`,
            {
                method: "GET",
                headers: new Headers({
                    Accept: "application/vnd.github.cloak-preview"
                })
            }
        )
            .then(res => res.json())
            .then(response => {
                console.log(response, "response");
                setUser({
                    ...response['User']
                })
            })
            .catch(error => console.log(error));
    }, []);

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
    };

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
    const sessionId = session;
    const token = 'T1==cGFydG5lcl9pZD00NjQ3MzU2MiZzaWc9MzU5ZGJhZTc1MTYyZDA5ZTIwNzg0YmVlOTUxMWIzOWM2MzI3MzQxZDpzZXNzaW9uX2lkPTFfTVg0ME5qUTNNelUyTW41LU1UVTNOVFk0T1Rjek9UVXhPWDVWT0RocE4yY3hPSGxtYkVWUFdYTTBlVkJHWlVoVWEzVi1mZyZjcmVhdGVfdGltZT0xNTc1Njg5OTA0Jm5vbmNlPTAuOTQ5MjU3NTUzMTkzMDc3NCZyb2xlPXB1Ymxpc2hlciZleHBpcmVfdGltZT0xNTc1NjkzNTAyJmluaXRpYWxfbGF5b3V0X2NsYXNzX2xpc3Q9';

    return (

        <div>
            <div id="sessionStatus">Session Status: {connection} to User {id}</div>
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
                {/*<OTPublisher*/}
                {/*    properties={{publishVideo, width: 50, height: 50,}}*/}
                {/*    onPublish={onPublish}*/}
                {/*    onError={onPublishError}*/}
                {/*    eventHandlers={publisherEventHandlers}*/}
                {/*/>*/}
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