import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Contact from "./pages/Contact";

import Form from "./pages/Form";
import ThankYou from "./pages/ThankYou";

import Patron from "./pages/Patron"
import PatronThankYou from "./pages/PatronThankYou"

import FinishLine from "./pages/FinishLine"
import {AwesomeSauce} from "./components/AwesomeSauce";
import {VideoTest} from "./pages/VideoTest";
import {VideoTestTwo} from "./pages/VideoTestTwo";

function App() {

  if (window.location.host.match(/^vip\./)) {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Form} />
          <Route exact path="/about" component={Home} />
          <Route exact path="/thankyou" component={ThankYou} />
          <Route exact path="/patron" component={Patron} />
          <Route exact path="/patronthankyou" component={PatronThankYou} />
          <Route exact path="/finishline/:id" component={AwesomeSauce} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/video-test" component={VideoTest} />
          <Route exact path="/video-test-two" component={VideoTestTwo} />
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <div className="App">
          <Route exact path="/" component={Home} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/thankyou" component={ThankYou} />
          <Route exact path="/vip" component={Form} />
          <Route exact path="/finishline/:id" component={AwesomeSauce} />
          <Route exact path="/video-test" component={VideoTest} />
          <Route exact path="/video-test-two" component={VideoTestTwo} />
          <Route exact path="/patron" component={Patron} />
          <Route exact path="/patronthankyou" component={PatronThankYou} />
        </div>
      </Router>
    );
  }

}

export default App;
