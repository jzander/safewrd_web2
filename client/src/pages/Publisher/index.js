import React, {useEffect, useState, useRef} from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber} from 'opentok-react';
import {compose, withProps} from "recompose"
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from "react-google-maps"
import "./style.scss";
import {toast} from "react-toastify";


export const sec2time = (timeInSeconds) => {
    const pad = function (num, size) {
            return ('000' + num).slice(size * -1);
        },
        time = parseFloat(timeInSeconds).toFixed(3),
        hours = Math.floor(time / 60 / 60),
        minutes = Math.floor(time / 60) % 60,
        seconds = Math.floor(time - minutes * 60),
        milliseconds = time.slice(-3);

    return pad(minutes, 2) + ':' + pad(seconds, 2);
};

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
        <GoogleMap defaultZoom={12} defaultCenter={{lat: userCoords.latitude, lng: userCoords.longitude}}
                   options={{mapTypeControl: false, streetViewControl: false}}>
            <Marker position={{lat: userCoords.latitude, lng: userCoords.longitude}}/>
        </GoogleMap>
    );
});

export const Publisher = (props) => {
        const {match} = props;
        const {id} = match.params;
        const [error, setError] = useState(null);
        const [connection, setConnection] = useState('Connecting');
        const [publishVideo, setVideoPublish] = useState(true);
        const [userCoords, setUserLocation] = useState({});
        const [session, setSession] = useState('');
        const [token, setToken] = useState('');
        const [apiKey, setApikey] = useState('');
        const [testURL, setTestURL] = useState('');
        const [seconds, setSeconds] = useState(0);
        const [streamComplete, setStreamComplete] = useState(false);

        useEffect(() => {
            let timeout;
            if (publishVideo && seconds < 30 && !streamComplete) {
                timeout = setTimeout(() => {
                    setSeconds(seconds + 1);
                }, 1000);
            } else {
                clearTimeout(timeout);
                setSeconds(0);
                stopVideo();
            }
            return () => {
                clearTimeout(timeout);
            };
        }, [connection, seconds]);


        const sessionEventHandlers = {
            sessionConnected: () => {
                setConnection('Connected')
            },
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

        const toggleVideo = () => {
            setVideoPublish(!publishVideo);
            setStreamComplete(!streamComplete);
            setSeconds(seconds + 1);
        };

        const stopVideo = ()=>{
            setVideoPublish(false);
            setStreamComplete(true);
        }

        const onSessionError = error => setError(error);

        const showMap = (coords) => {
            const data = {
                user_id: id,
                location: {
                    lat: coords.latitude,
                    lng: coords.longitude
                },
            };
            fetch('https://api.tranzmt.it/v1/patron/event', {
                // fetch('http://159.203.169.170/v1/patron/event', {
                method: 'POST',
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(response => {
                    setSession(response['Session_id']);
                    setToken(response['Token']);
                    setApikey(response['Api_key']);
                    setTestURL(response['TestURL']);
                });
            setUserLocation(coords)
        };

        useEffect(() => {
            window.navigator.geolocation.getCurrentPosition((position) => {
                showMap(position.coords);
            });
        }, []);


        if (!apiKey) {
            return (<></>)
        }
        return (
            <div>{seconds < 31 &&
            <div id="sessionStatus">Session Status: {!streamComplete ? connection : 'Offline'}</div>
            }
                {error ? (
                    <div className="error">sad
                        <strong>Error:</strong> {error}
                    </div>
                ) : null}
                {seconds < 31 &&
                <div>
                    <p style={{
                        textAlign: 'center', background: '#fff',
                        color: '#395ee5',
                        maxWidth: '479px',
                        margin: '0 auto 10px',
                        height: '40px',
                        lineHeight: '40px',
                        borderRadius: '10px'
                    }} className={'status'}><span style={{
                        color: '#b00',
                        fontSize: '25px',
                        lineHeight: '0',
                        position: 'relative',
                        top: '4px',
                    }}>&#9673;</span>&nbsp;&nbsp;<b>Emergency Call: {sec2time(seconds)}</b></p></div>
                }
                <div className={'stream-wrapper'}>
                    {seconds < 31 &&
                    <OTSession
                        apiKey={apiKey}
                        sessionId={session}
                        token={token}
                        onError={onSessionError}
                        eventHandlers={sessionEventHandlers}
                    >
                        <div className={'button-wrapper'}>
                            <button id="videoButton" onClick={toggleVideo}>
                                {publishVideo && !streamComplete ? 'STOP' : 'STREAM'}
                            </button>
                        </div>
                        <OTPublisher
                            properties={{publishVideo, width: 50, height: 50,}}
                            onPublish={onPublish}
                            onError={onPublishError}
                            eventHandlers={publisherEventHandlers}
                        />
                    </OTSession>
                    }
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
                {testURL &&
                <a href={testURL} target="_blank" style={{
                    color: '#fff', textAlign: 'center', display: 'block',
                    margin: '30px'
                }}>View Link</a>
                }
            </div>
        );
    }
;