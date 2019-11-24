import React, { useState, useRef } from "react";

// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";

import style from "./style.module.scss";


// TODO: Move to config
const BASE_URL = 'http://localhost:5000';
// const BASE_URL = 'https://safewrd.app';


const Input = (props) => {
  return <input {...props} onChange={e => props.onValue(e.target.value)} />;
};

const Row = (props) => {
  return <div className={style.row} {...props}>{props.children}</div>;
};

export default () => {

  const [loading, setLoading]     = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName]   = useState('');
  const [phone, setPhone]         = useState('');
  const [email, setEmail]         = useState('');
  const [file, setFile]           = useState('');
  const [formEl, setFormEl]       = useState(null);

  function formIsInvalid() {

    const values = {
      firstName,
      lastName,
      phone,
      email,
    };

    const props = {
      firstName: 'your first name',
      lastName: 'your last name',
      phone: 'your phone number',
      email: 'your email address',
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
    setFirstName('');
    setLastName('');
    setPhone('');
    setEmail('');
    setFile('');
  }

  async function submit(e) {
    try {
      if (e) {
        e.preventDefault();
      }

      console.log({ loading });

      if (loading) return;
      setLoading(true);

      if (formIsInvalid()) {
        setLoading(false);
        return;
      }

      const form = new FormData(formEl);

      await fetch(`${BASE_URL}/api/form`, {
        method: 'post',
        body: form,
      }).then(r => r.json());

      // TODO: Re-enable
      // resetForm();

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
              First Name
            <Input name="firstName" value={firstName} onValue={setFirstName} />
            </label>

            <label>
              Last Name
            <Input name="lastName" value={lastName} onValue={setLastName} />
            </label>
          </Row>

          <label>
            Phone
          <Input  name="phone" type="tel" value={phone} onValue={setPhone} />
          </label>

          <label>
            Email
          <Input name="email" type="email" value={email} onValue={setEmail} />
          </label>

          <label htmlFor="file">
            Photo
          </label>
          
          <div className={style.fileWrapper}>
            { file && <button onClick={() => setFile(null)}>Remove File</button> }
            <Input name="file" id="file" type="file" value={file} onValue={setFile} />
          </div>
          
          <button type="submit" disabled={loading}>Submit</button>

        </form>
      </div>

      <Footer />
    </div>
  );
}

console.log(style);