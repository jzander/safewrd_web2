import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";

import style from "./style.module.scss";

function getSearchParams() {
  return window.location.search
    .slice(1)
    .split('&')
    .reduce((acc, n) => {
      const [key, value] = n.split('=');
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}


class SafetyNetwork extends Component {
  render() {

    const params = getSearchParams();

    /*
    if (!params.id) {
      return <Redirect to="/Patron?error=1" />;
    }
    */

    return (
      <div className={style.home}>
        <Header />
        <div className={style.content}>

          <h1>Congratulations! </h1>
          <p>
          Your safety network is almost ready to get started. 
          <br/>Stand by - we'll be sending you information for the next steps soon.
          </p>

        </div>
        <Footer />
      </div>
    );
  }
}

export default SafetyNetwork;
