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

    const showMap = (coords) => {
        console.log(coords, "position.coords")
    };

    window.navigator.geolocation.getCurrentPosition((position) => {
        showMap(position.coords);
    });


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
    const token = 'T1==cGFydG5lcl9pZD00NjQ3MzU2MiZzaWc9NjIxMTVjZGIyZTJjZTg0OTAxZWIxNjdiZjI2MjM3ZDI2MGNmY2ZjZDpzZXNzaW9uX2lkPTJfTVg0ME5qUTNNelUyTW41LU1UVTNOVFk1TkRBNU9USXdNSDQxVldadFkwWlJiV3AzYVhBeVUySjZOelY1TmpORGJHOS1mZyZjcmVhdGVfdGltZT0xNTc1Njk0MjM0Jm5vbmNlPTAuMTE1MTM5NDQ5MzgyMTU0NDgmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU3ODI4NjIzMiZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

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