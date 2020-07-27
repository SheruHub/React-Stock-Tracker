import React, { useContext } from 'react';
import { Formik, Form, Field } from 'formik';
import { Button } from '@material-ui/core';
import Grid from '@material-ui/core/Grid'
import { DatePicker } from 'formik-material-ui-pickers';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { MessageContext } from '../context/MessageContext';

import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarTodayRounded from '@material-ui/icons/CalendarTodayRounded';

const useStyles = makeStyles({
    dateForm: {
        marginTop: '1rem',
        marginBottom: '1rem',
    }
})

const clearQuotes = inDate => {
    return JSON.stringify(inDate).replace(/['"]+/g, '');
}

// boundary = 'from' or 'to'
// Sets time to 0/24 so that we can get 1 day at a time the day before
const getDate = (inDate, boundary) => {
    const date = (inDate != null) ? new Date(inDate) : new Date();
    //console.log(date);
    if(boundary) {
        (boundary === 'from') ? date.setHours(-24) : date.setHours(0);
    }
    // Make sure date is a valid date - protect against manual url string date manipulation
    if (typeof date === 'object' && !Number.isNaN(Number(new Date(date)))) return date.toISOString();
    return inDate;
}

const DateForm = ({ from, to }) => {
    const classes = useStyles();
    let history = useHistory();
    const [message, setMessage] = useContext(MessageContext);

    // Synchronous validation
    const validate = (values, props /* only available when using withFormik */) => {
        const errors = {};

        const from = getDate(values.dateFrom, 'from');
        const to = getDate(values.dateTo, 'to')
        if (to < from) {
            errors.dateTo = true;
            setMessage({ error: true, message: 'To date cannot be before from date' });
        }

        return errors;
    };

    //const tester = new Date(from);
    //console.log(tester);

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Formik
                initialValues={{
                    dateFrom: getDate(from, 'from'),
                    dateTo: getDate(to, 'to')
                }}
                validateOnBlur={false}
                validateOnChange={false}
                validate={validate}
                onSubmit={(data, { setSubmitting }) => {

                    setSubmitting(false);
                    history.push('?from=' + getDate(clearQuotes(data.dateFrom), 'from')+ '&to=' +getDate(clearQuotes(data.dateTo), 'to'));
                }}>
                {({ values }) => (
                    <Form className={classes.dateForm}>
                        <Grid container>
                            <Grid item xs={6} md={3}>
                                <Field component={DatePicker}
                                    name="dateFrom"
                                    label="From"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disableFuture={true}
                                    autoOk
                                    variant="inline"
                                    orientation="landscape"
                                />
                            </Grid>
                            <Grid item xs={6} md={3}>
                                <Field component={DatePicker}
                                    onChange={date => {
                                        
                                    }}
                                    name="dateTo"
                                    label="To"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarTodayRounded />
                                            </InputAdornment>
                                        ),
                                    }}
                                    disableFuture={true}
                                    autoOk
                                    variant="inline"
                                    orientation="landscape"
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Button type="submit"
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >Go!
                                </Button>
                            </Grid>
                             {/* <pre>
                                {JSON.stringify(values, null, 2)}
                            </pre>  */}
                        </Grid>
                    </Form>
                )}
            </Formik>
        </MuiPickersUtilsProvider>
    )
}

export default DateForm;