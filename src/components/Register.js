import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import AuthService from "../services/auth.service";
import { MessageContext } from '../context/MessageContext';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
    },
    wrapper: {
        padding: '0 1rem',
    },
})

const Register = () => {
    const classes = useStyles();
    const [message, setMessage] = useContext(MessageContext);
    let history = useHistory();

    return (
        <div className={classes.wrapper}>
            <h1> Register an Account</h1>

            <Formik
                initialValues={{ email: '', password: '' }}
                onSubmit={(data, { setSubmitting, setErrors, resetForm }) => {
                    const resp = AuthService.register(data.email, data.password);
                    Promise.resolve(resp).then(value => {
                        // message.payload = JSON.stringify(value);
                        setMessage(value.payload);
                        if (value.payload.success) {
                            history.push("/login");
                        } else {
                            setSubmitting(false);
                            resetForm({});
                        }
                    })
                }}>
                {({ values }) => (
                    <Form>
                        <Grid container>
                            <Grid item md={2}>
                                <Field
                                    component={TextField}
                                    type="email"
                                    label="E-mail"
                                    name="email"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item md={2}>
                                <Field
                                    component={TextField}
                                    type="password"
                                    label="Password"
                                    name="password"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item md={2}>
                                <Button type="submit">Register!</Button>
                            </Grid>
                            {/* <pre>
                            {JSON.stringify(values, null, 2)}
                        </pre> */}
                        </Grid>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

export default Register;