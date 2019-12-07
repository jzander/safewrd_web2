import React, {useEffect, useState, useRef, createRef} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {ToastContainer, toast} from 'react-toastify';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";
import style from "./style.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import NumberFormat from 'react-number-format';
import imgPhone from "../../assets/images/phone.png";
import Player from "../Player";
import ButtonLink from "../ButtonLink";
import './config.scss'
// import { Redirect } from 'react-router-dom'
import {Redirect} from 'react-router';

const useStyles = makeStyles({
    underline: {
        "&&&:before": {
            borderBottom: "none"
        },
        "&&:after": {
            borderBottom: "none"
        }
    }
});

export const VALIDATION_REGEX = {
    email: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@(\.*[a-zA-Z0-9-]+)+(?:\.[a-zA-Z]+)+$/i,
    phone: /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/,
    phoneNumber: /^(?:\+?1[-. ]?)?(?:\(?([0-9]{3})\)?[-. ]?)?([0-9]{3})[-. ]?([0-9]{4})$/,
};

export const AwesomeSauce = (props) => {
    const classes = useStyles();
    const {match} = props;
    const {id} = match.params;
    const [pageLoaded, setPageLoaded] = useState(false);
    const [user, setUser] = useState({email: '', emailConfirm: '', id: ''});
    const [contacts, setContacts] = useState([]);
    const [groupInfo, setGroupInfo] = useState('');

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
                setContacts(response['Contacts']);
                setGroupInfo(response['Group']);
                setUser({
                    ...user,
                    ...response['User']
                });
                setPageLoaded(true)
            })
            .catch(error => {
                setPageLoaded(true);
                console.log(error)
            });

    }, []);

    const handleInputChange = (e, contact) => {
        let updatedContacts = contacts;
        const objIndex = updatedContacts.findIndex((c => {
            if (c && c.id) {
                return c.id === contact.id
            }
        }));
        updatedContacts[objIndex].phone = e.target.value;
        setContacts(updatedContacts);
    };
    const handleUserInputChange = (e, value) => {
        let updatedUser = {
            ...user
        };
        updatedUser[value] = e.target.value;
        setUser(updatedUser)
    };
    const validateForm = () => {
        const validEmails = VALIDATION_REGEX.email.test(user.email);
        const validPhones = contacts.every((contact) => {
            return VALIDATION_REGEX.phoneNumber.test(contact.phone);
        });
        const emailsMatching = user.emailConfirm === user.email;
        return validEmails && validPhones && emailsMatching;
    };
    const redirectOnSuccess = () => {
        props.history.push(`/publisher/${id}`);
    };

    const submitForm = () => {
        const isFormValid = validateForm();
        if (isFormValid) {
            const data = {
                "User": {
                    user_id: id,
                    email: user.email,
                },
                "Contacts": contacts
            };
            fetch('https://api.tranzmt.it/v1/patron/contacts', {
                method: 'POST',
                body: JSON.stringify(data)
            }).then(res => res.json())
                .then(response => {
                    console.log(response, "response");
                    redirectOnSuccess()
                    // if (response["Success"] === 'partial'){
                    //     toast.error("Something went wrong, please try again.", {
                    //         position: toast.POSITION.TOP_CENTER
                    //     });
                    // }
                });
        } else {
            toast.error("Please make sure your phone numbers and emails are valid", {
                position: toast.POSITION.TOP_CENTER
            });
        }
    };
    if (pageLoaded && contacts.length < 1) {
        return (<>
            <div className={style.home}>
                <Header/>
                <h1 style={{color: '#fff', textAlign: 'center', margin: '100px auto 0'}}>Not Found.<br/>Please Try again Later</h1>
            </div>
        </>)
    }
    return (
        <>
            <ToastContainer/>
            <div className={style.home}>
                <Header/>
                <div className={`${style.content} awesome-sauce-container`}>
                    <h2>#Stream4Help</h2>
                    <h1>Awesome Sauce!</h1>
                    <p><b>Your SAFEWRD is: </b><span>{groupInfo && groupInfo.safeword ? groupInfo.safeword : ''}</span></p>
                    <p><b>The name of your SAFETY GROUP is: </b><span>{groupInfo && groupInfo.name ? groupInfo.name : ''}</span></p>
                    <p><b>The Friends or family members that you added to it are:</b></p>
                    <div className={style.sms}>
                        {contacts.map((contact, i) => {
                            return (
                                <Grid container spacing={2} key={contact.id} className={style.contacts}
                                      alignItems={"center"} justify={'center'}>
                                    <Grid item xs={12} sm={4} className={style.name}>
                                        <p className={'contact-name'}>{contact.name}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={8} className={style.textField}>
                                        <NumberFormat format="+1 (###) ###-####" mask="_" value={contact.phone}
                                                      onChange={(e) => handleInputChange(e, contact)}
                                                      placeholder={`Enter SMS for ${contact.name}`}/>
                                        {contact.phone && !VALIDATION_REGEX.phoneNumber.test(contact.phone) &&
                                        <p>Must be a valid phone number</p>
                                        }
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </div>
                    <p><b>Finally, provide their mobile number in the fields above. Please be sure to include their
                        10-digit Area Code+mobile Number; and we'll let them know that you added them to your SAFETY
                        GROUP.</b></p>
                    <Grid container spacing={2} className={style.contacts}
                          alignItems={"center"} justify={'center'}>
                        <Grid item xs={12} sm={4}>
                            <p className={'form-label'}>Your Email address:</p>
                        </Grid>
                        <Grid item xs={12} sm={8} className={style.textField}>

                            <TextField id={`user-email`}
                                       InputProps={{classes}}
                                       className={style.input}
                                       error={!VALIDATION_REGEX.email.test(user.email)}
                                       helperText={user.email && !VALIDATION_REGEX.email.test(user.email) ? 'Enter a valid email address' : ''}
                                       InputLabelProps={{
                                           shrink: false,
                                           floatingLabel: false,
                                       }}
                                       onChange={(e) => handleUserInputChange(e, 'email')}
                                       placeholder={'Enter Email'}
                                       value={user.email}/>

                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <p className={'form-label'}>Confirm Email:</p>
                        </Grid>
                        <Grid item xs={12} sm={8} className={style.textField}>
                            <TextField id={`user-email-confirm`}
                                       InputProps={{classes}}
                                       className={style.input}
                                       InputLabelProps={{
                                           shrink: false,
                                           floatingLabel: false,
                                       }}
                                       onChange={(e) => handleUserInputChange(e, 'emailConfirm')}
                                       placeholder={'Confirm Email'}
                                       error={user.emailConfirm !== user.email}
                                       helperText={user.emailConfirm && user.email && (user.emailConfirm !== user.email) ? 'Your emails do not match' : ''}
                                       value={user.emailConfirm}/>
                        </Grid>
                    </Grid>
                    <ButtonLink label={'Start 30-sec Video Test with Friends'} onClick={submitForm}/>
                    <Grid container spacing={2} className={style.lowerImage}>
                        <div className={style.ads}>
                            <div className={style.bright}/>
                            <img src={imgPhone} alt="phone"/>
                            <div className={style.playerHenry}>
                                <Player title="Henry"/>
                            </div>
                            <div className={style.playerMom}>
                                <Player title="Mom" delay={2}/>
                            </div>
                            <div className={style.playerDad}>
                                <Player title="Dad" delay={1}/>
                            </div>
                        </div>
                    </Grid>
                </div>
                <Footer/>
            </div>
        </>
    );
};