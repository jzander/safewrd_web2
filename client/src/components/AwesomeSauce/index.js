import React, {useEffect, useState, useRef, createRef} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";
import style from "./style.module.scss";
import {makeStyles} from "@material-ui/core/styles";
import NumberFormat from 'react-number-format';
import imgPhone from "../../assets/images/phone.png";
import Player from "../Player";
import ButtonLink from "../ButtonLink";

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

export const AwesomeSauce = (props) => {
    const classes = useStyles();
    const {match} = props;
    const {id} = match.params;
    const [user, setUser] = useState({email: '', emailConfirm: '', id: ''});
    const [contacts, setContacts] = useState([{name: 'test', id: '12312'}, {
        name: 'test',
        id: '23432432'
    }, {name: 'test', id: '2341232'}, {name: 'test', id: '12341234'}, {name: 'test', id: '987234'}]);
    useEffect(() => {
        fetch(
            `http://159.203.169.170/v1/patron/contacts?user_id=${id}`,
            {
                method: "GET",
                headers: new Headers({
                    Accept: "application/vnd.github.cloak-preview"
                })
            }
        )
            .then(res => res.json())
            .then(response => {
                setContacts(response['Contacts'])
            })
            .catch(error => console.log(error));
    });

    const handleInputChange = (e, contact) => {
        let updatedContacts = contacts;
        const objIndex = updatedContacts.findIndex((c => {
            if (c && c.id) {
                return c.id === contact.id
            }
        }));
        updatedContacts[objIndex].sms = e.target.value;
        setContacts(updatedContacts);
    };
    const handleUserInputChange = (e, value) => {
        let updatedUser = {
            ...user
        };
        updatedUser[value] = e.target.value;
        console.log(updatedUser, "user");
        setUser(updatedUser)
    };
    const submitForm = () => {
        console.log("submitting")
    }
    return (
        <>
            <div className={style.home}>
                <Header/>
                <div className={`${style.content} awesome-sauce-container`}>
                    <h2>#Stream4Help</h2>
                    <h1>Awesome Sauce!</h1>
                    <p><b>Your SAFEWRD is: </b></p>
                    <p><b>The name of your SAFETY GROUP is: </b></p>
                    <p><b>The Friends or family members that you added to it are:</b></p>
                    <div className={style.sms}>
                        {contacts.map((contact, i) => {
                            return (
                                <Grid container spacing={2} key={contact.id} className={style.contacts}
                                      alignItems={"center"} justify={'center'}>
                                    <Grid item xs={12} sm={4}>
                                        <p className={'contact-name'}>{contact.name}</p>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <NumberFormat format="+1 (###) ###-####" mask="_" value={contact.sms}
                                                      onChange={(e) => handleInputChange(e, contact)}
                                                      placeholder={'Enter SMS'}/>

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
                        <Grid item xs={12} sm={8}>
                            <TextField id={`user-email`}
                                       InputProps={{classes}}
                                       className={style.input}
                                       InputLabelProps={{
                                           shrink: false,
                                           floatingLabel: false,
                                       }}
                                       onChange={(e) => handleUserInputChange(e, 'email')}
                                       placeholder={'Enter Email'}
                                       value={user.email}/>

                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <p className={'form-label'}>Confirm Email address</p>
                        </Grid>
                        <Grid item xs={12} sm={8}>
                            <TextField id={`user-email-confirm`}
                                       InputProps={{classes}}
                                       className={style.input}
                                       InputLabelProps={{
                                           shrink: false,
                                           floatingLabel: false,
                                       }}
                                       onChange={(e) => handleUserInputChange(e, 'emailConfirm')}
                                       placeholder={'Confirm Email'}
                                       value={user.emailConfirm}/>
                        </Grid>
                    </Grid>
                    <ButtonLink label={'Start streaming'} onClick={submitForm}/>
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