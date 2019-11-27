import React, { useState, useRef } from "react";

// Components
import style from "./style.module.scss";



// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";

// TODO: Move to config
const FORM_URL = 'https://api.tranzmt.it/v1/ambassador/lead';

const Input = (props) => {
  return <input {...props} onChange={e => props.onValue(e.target.value)} />;
};

const Row = (props) => {
  return <div className={style.row} {...props}>{props.children}</div>;
};


/**
 * Turn an object into a query string
 * @param {object} data 
 */
function toQueryString(data) {
  return '?' + Object.keys(data).map(key => `${key}=${data[key]}`).join('&');
}

export default () => {

  const [loading, setLoading] = useState(false);
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');

  const [formEl, setFormEl] = useState(null);
  const inputRef = useRef(null);

  function formIsInvalid() {

    const values = {
      nickname,
      phone,
    };

    const props = {
      nickname: 'your ambassador account handle',
      phone: 'patron\'s phone number',
    };

    for (const key in props) {
      if (!values[key]) {
        alert(`Please enter ${props[key]}`);
        return true;
      }
    }

    return false;
  }

  function resetForm() {
    setNickname('');
    setPhone('');
  }

  async function submit(e) {
    try {
      if (e) {
        e.preventDefault();
      }

      if (loading) return;
      setLoading(true);

      if (formIsInvalid()) {
        setLoading(false);
        return;
      }

      const resp = await fetch(FORM_URL, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nickname,
          phone,
        }),
      }).then(r => r.json());

      if (resp.Error) {
        alert(resp.Message);
        setLoading(false);
        return;
      }

      // TODO: Re-enable
      setTimeout(resetForm, 3000);

    } catch (e) {
      console.warn(e);
      alert(`Something went wrong. Please try again later.`);
    }

    setLoading(false);
  }

  return (
    <div className={style.contact}>
      <Header />
      <div className={style.content}>

        <h1>Become a VIP</h1>

        <form ref={setFormEl} onSubmit={submit}>
          <Row>
            <label>
              Ambassador Nickname
            <Input name="nickname" value={nickname} onValue={setNickname} />
            </label>

          </Row>

          <label>
            Patron's Phone Number
          <Input name="phone" type="tel" value={phone} onValue={setPhone} />
          </label>

          <button type="submit" disabled={loading}>Submit</button>

        </form>
      </div>
      <Footer/>
    </div>
  );
}
