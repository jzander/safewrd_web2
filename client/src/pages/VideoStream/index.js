import React, {useEffect, useState, useRef} from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';
import {compose, withProps} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import "./style.scss";
import {toast} from "react-toastify";

export const UserLocation = compose(
    withProps({
        googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyDqrR39a8IilthyBcBjfdWdxaWYwufrDkg`,
        loadingElement: <div style={{height: `100%`}}/>,
        containerElement: <div style={{height: `200px`}}/>,
        mapElement: <div style={{height: `100%`}}/>,
    }),
    withScriptjs,
    withGoogleMap
)((props) => {
    const {userCoords} = props;
    return (
        <GoogleMap defaultZoom={12} defaultCenter={{lat: userCoords.latitude, lng: userCoords.longitude}}>
            <Marker position={{lat: userCoords.latitude, lng: userCoords.longitude}}/>
        </GoogleMap>
    );
});

export const VideoStream = (props) => {
    const {match} = props;
    const {id} = match.params;
    const [error, setError] = useState(null);
    const [connection, setConnection] = useState('Connecting');
    const [publishVideo, setVideoPublish] = useState(true);
    const [userCoords, setUserLocation] = useState({});

    const sessionEventHandlers = {
        sessionConnected: () => setConnection('Connected'),
        sessionDisconnected: () => setConnection('Disconnected'),
        sessionReconnected: () => setConnection('Reconnected'),
        sessionReconnecting: () => setConnection('Reconnecting'),
    };

    const publisherEventHandlers = {
        accessDenied: () => console.log('User denied access to media source'),
        streamCreated: () => console.log('Publisher stream created'),
        streamDestroyed: ({reason}) => console.log(`Publisher stream destroyed because: ${reason}`)
    };

    const subscriberEventHandlers = {
        videoEnabled: () => console.log('Subscriber video enabled'),
        videoDisabled: () => console.log('Subscriber video disabled')
    };

    const onPublish = () => console.log('Publish Success');

    const onPublishError = (error) => setError(error);

    const onSubscribe = () => console.log('Subscribe Success');

    const onSubscribeError = error => setError(error);

    const toggleVideo = () => setVideoPublish(!publishVideo);

    const onSessionError = error => setError(error);

    const apiKey = '46473562';
    const sessionId = '2_MX40NjQ3MzU2Mn5-MTU3NTY5NDA5OTIwMH41VWZtY0ZRbWp3aXAyU2J6NzV5NjNDbG9-fg';
    const token = 'T1==cGFydG5lcl9pZD00NjQ3MzU2MiZzaWc9NjIxMTVjZGIyZTJjZTg0OTAxZWIxNjdiZjI2MjM3ZDI2MGNmY2ZjZDpzZXNzaW9uX2lkPTJfTVg0ME5qUTNNelUyTW41LU1UVTNOVFk1TkRBNU9USXdNSDQxVldadFkwWlJiV3AzYVhBeVUySjZOelY1TmpORGJHOS1mZyZjcmVhdGVfdGltZT0xNTc1Njk0MjM0Jm5vbmNlPTAuMTE1MTM5NDQ5MzgyMTU0NDgmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTU3ODI4NjIzMiZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

    const showMap = (coords) => {
        console.log(coords, "coords");
        const data = {
            user_id: id,
            location: {
                lat: coords.latitude,
                lng: coords.longitude
            },
        };
        // fetch('https://api.tranzmt.it/v1/patron/event', {
        fetch('http://159.203.169.170/v1/patron/event', {
            method: 'POST',
            body: JSON.stringify(data)
        }).then(res => res.json())
            .then(response => {
                console.log(response, "response");
            });
        setUserLocation(coords)
    };

    useEffect(() => {
        window.navigator.geolocation.getCurrentPosition((position) => {
            showMap(position.coords);
        });
    }, []);

    return (
        <div>
            <div id="sessionStatus">Session Status: {connection}</div>
            {error ? (
                <div className="error">sad
                    <strong>Error:</strong> {error}
                </div>
            ) : null}
            <div className={'stream-wrapper'}>
                <OTSession
                    apiKey={apiKey}
                    sessionId={sessionId}
                    token={token}
                    onError={onSessionError}
                    eventHandlers={sessionEventHandlers}
                >
                    <div className={'button-wrapper'}>
                        <button id="videoButton" onClick={toggleVideo}>
                            {publishVideo ? 'STOP' : 'STREAM'}
                        </button>
                    </div>
                    <OTPublisher
                        properties={{publishVideo, width: 50, height: 50,}}
                        onPublish={onPublish}
                        onError={onPublishError}
                        eventHandlers={publisherEventHandlers}
                    />
                </OTSession>
            </div>
            <div className={'map-container'}>
                {userCoords &&
                <UserLocation userCoords={userCoords}
                              googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyDqrR39a8IilthyBcBjfdWdxaWYwufrDkg"
                              loadingElement={<div style={{height: `100%`}}/>}
                              containerElement={<div style={{height: `200px`}}/>}
                              mapElement={<div style={{height: `100%`}}/>}
                />
                }
            </div>
        </div>
    );
};