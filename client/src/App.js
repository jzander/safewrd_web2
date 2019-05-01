import React from 'react'

// Components
import Header from './components/Header'
import Player from './components/Player'

// Resources
import imgPhone from './assets/images/phone.png'
import imgFacebookMsg from './assets/images/facebook_msg.png'
import imgGoogleAssist from './assets/images/google_assist.png'

import style from './App.scss';

function App() {
  return (
    <div className={style.app}>
      <Header />
      <div className={style.content}>
        <div className={style.ads}>
          <img src={imgPhone} alt="image-phone" />
          <Player
            title="Henry"
            style={{
              position: "absolute",
              left: "0px",
              top: "0px"
            }}
          />
          <Player
            title="Mom"
            style={{
              position: "absolute",
              left: "20px",
              top: "20px"
            }}
          />
          <Player
            title="Dad"
            style={{
              position: "absolute",
              left: "50px",
              top: "50px"
            }}
          />
        </div>
        <div className={style.desc}>
          <h1>Say your SafeWrd, and stream for help.</h1>
          <p>Without ever reach for your phone, say your own personal safe word when in trouble and your phone wakes from locked screen, streaming live video to your friends and family.</p>
        </div>
        <div className={style.create}>
          <div className={style.title}>
            <h3>Create your SafeWrd now</h3>
          </div>
          <div className={style.buttons}>
            <div className={style.facebook}>
              <img src={imgFacebookMsg} alt="image-facebook-message" />
            </div>
            <div className={style.google}>
              <img src={imgGoogleAssist} alt="image-google-assist" />
            </div>
          </div>
        </div>
      </div>
      <div className={style.footer}>
        <div className={style.rating}>
          <div className={style.circleMark}>
          </div>
          <div className={style.desc}>
            <div className={style.title}>
              <span><strong>88 people</strong> are viewing this page</span>
            </div>
            <div className={style.verified}>
              Verified by Proof
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;