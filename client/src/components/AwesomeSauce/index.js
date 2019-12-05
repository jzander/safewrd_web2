import React, {useEffect, useState, useRef, createRef} from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
// Components
import Header from "../../layout/Header";
import Footer from "../../components/Footer";
import style from "./style.module.scss";
import {makeStyles} from "@material-ui/core/styles";

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

function formatPhone(phoneNumberString) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        const intlCode = match[1] ? '+1 ' : '';
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
}

export const AwesomeSauce = (props) => {
    const {match} = props;
    const {id} = match.params;
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
    const classes = useStyles();
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
                                    <Grid item xs={6} sm={4}>
                                        <p className={'contact-name'}>{contact.name}</p>
                                    </Grid>
                                    <Grid item xs={6} sm={8}>
                                        <TextField id={`contact-${contact.name}`}
                                                   InputProps={{classes}}
                                                   className={style.input}
                                                   InputLabelProps={{
                                                       shrink: false,
                                                       floatingLabel: false,
                                                   }}
                                                   onChange={(e) => handleInputChange(e, contact)}
                                                   placeholder={'Enter SMS'}
                                                   value={contact.sms}/>
                                    </Grid>
                                </Grid>
                            )
                        })}
                    </div>
                </div>
                <Footer/>
            </div>
        </>
    );
};