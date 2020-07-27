import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Button, Grid } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import AuthService from "../services/auth.service";
import { Link } from 'react-router-dom';
import { MessageContext } from '../context/MessageContext';

import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        padding: '0 1rem',
    }
}));


const Login = () => {
    const classes = useStyles();
    const [message, setMessage] = useContext(MessageContext);
    let history = useHistory();

    const doRender = email => {
        setMessage({ success: true, message: 'Welcome back, ' + email })
        history.push("/");
    }

    return (
        <div className={classes.wrapper}>
            <Box>
                <h1> Login page</h1>
                <Formik
                    initialValues={{ email: '', password: '' }}
                    onSubmit={(data, { setSubmitting, setErrors, resetForm }) => {
                        const resp = AuthService.login(data.email, data.password);
                        Promise.resolve(resp).then(value => {
                            //console.log(value);
                            if (value.token) {
                                doRender(data.email);
                            } else {
                                setMessage(value);
                                setSubmitting(false);
                            }
                        })
                    }}>
                    {({ values }) => (
                        <Form>
                            <Grid container>
                                <Grid md={2}>
                                    <Field
                                        component={TextField}
                                        type="email"
                                        label="E-mail"
                                        name="email"
                                        variant="outlined"
                                        InputProps={{ notched: true }}
                                    />
                                </Grid>
                                <Grid md={2}>
                                    <Field
                                        component={TextField}
                                        type="password"
                                        label="Password"
                                        name="password"
                                        variant="outlined"
                                        InputProps={{ notched: true }}
                                    />
                                </Grid>
                                <Grid md={2}>
                                    <Button type="submit">Login</Button>
                                </Grid>
                                {/* <pre>
                            {JSON.stringify(values, null, 2)}
                        </pre> */}
                            </Grid>
                        </Form>
                    )}
                </Formik>
            Don't have an account? <Link to='/Register'><Button>Register here</Button></Link>
            </Box>
        </div>
    );
}

export default Login;