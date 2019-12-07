import React, {useEffect, useState, useRef} from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';
import "./style.scss";
import {UserLocation} from "../VideoStream";

export const SafeGroup = (props) => {
    const {match} = props;
    const {id, token} = match.params;
    const [error, setError] = useState(null);
    const [connection, setConnection] = useState('Connecting');
    const [publishVideo, setVideoPublish] = useState(false);
    const [session, setSession] = useState('');
    const [userCoords, setLocation] = useState('');
    const [name, setName] = useState('');
    const [apiKey, setApikey] = useState('');

    useEffect(() => {
        fetch(
            `https://api.tranzmt.it/v1/patron/event?id=${id}`,
            {
                method: "GET",
                headers: new Headers({
                    Accept: "application/vnd.github.cloak-preview"
                })
            }
        )
            .then(res => res.json())
            .then(response => {
                setSession(response['Session_id']);
                setLocation({
                    latitude: response['Location'].lat,
                    longitude: response['Location'].lng
                });
                setApikey(response['Api_key']);
                setName(response['Name']);
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
    };

    const onPublish = () => {
        console.log('Publish Success');
    };

    const onPublishError = (error) => setError(error);

    const onSubscribe = () => {
        console.log('Subscribe Success');
    };

    const onSubscribeError = error => setError(error);

    const toggleVideo = () => setVideoPublish(!publishVideo);

    const onSessionError = error => setError(error);


    if (!apiKey) {
        return (<></>)
    }
    return (
        <div>
            <div id="sessionStatus">Session Status: {connection} to {name}</div>
            {error ? (
                <div className="error">sad
                    <strong>Error:</strong> {error}
                </div>
            ) : null}
            <OTSession
                apiKey={apiKey}
                sessionId={session}
                token={token}
                onError={onSessionError}
                eventHandlers={sessionEventHandlers}
            >
                <OTStreams>
                    <OTSubscriber
                        properties={{width: 100, height: 100}}
                        onSubscribe={onSubscribe}
                        onError={onSubscribeError}
                        eventHandlers={subscriberEventHandlers}
                    />
                </OTStreams>
            </OTSession>

            <div className={'map-container'}>
                <UserLocation userCoords={userCoords}
                              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDqrR39a8IilthyBcBjfdWdxaWYwufrDkg"
                              loadingElement={<div style={{height: `100%`}}/>}
                              containerElement={<div style={{height: `200px`}}/>}
                              mapElement={<div style={{height: `100%`}}/>}
                />
            </div>
        </div>
    );
};