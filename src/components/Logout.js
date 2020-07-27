import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthService from "../services/auth.service";
import { MessageContext } from '../context/MessageContext';

const Logout = () => {
    const [message, setMessage] = useContext(MessageContext);
    let history = useHistory();
    setMessage({ success: true, message: 'You have been logged out' });
    AuthService.logout();
    history.push("/"); 
    return (
        <>
        </>
    )
}

export default Logout;