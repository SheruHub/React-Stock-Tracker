import React, { useContext } from 'react';
import { MessageContext } from '../context/MessageContext';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';

import Slide from '@material-ui/core/Slide';


const RenderAlert = () => {

    const [message, setMessage] = useContext(MessageContext);
    const [open, setOpen] = React.useState(true);
    let type;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setMessage({});
        setOpen(false);
    };

    const handleExited = () => {
        setMessage({});
        setOpen(false);
    };
  


    if (message.message) {
        if (!open) setOpen(true);

        if (message.success) type = 'success';
        else if (message.error) type = 'error';

        message.renderStr = (
            <Snackbar
                open={open}
                autoHideDuration={4000}
                onClose={handleClose}
                onExited={handleExited}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >

                <Alert onClose={handleClose} severity={type}>
                    {message.message}
                </Alert>
            </Snackbar>
        )
    } else {
        message.renderStr = '';
    }

    return (
        message.renderStr
    )
}

export default RenderAlert;