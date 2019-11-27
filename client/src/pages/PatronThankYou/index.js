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


class PatronThankYou extends Component {
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
        <h1>Congratulations! We will be texting you to get started shortly.</h1>
        <div className={style.content}>

          <p>
          We sent a message to {params.phone} to get you started!
          </p>

        </div>
        <Footer />
      </div>
    );
  }
}

export default PatronThankYou;
