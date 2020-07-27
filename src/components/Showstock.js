import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Box, Paper, Divider, Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import userService from '../services/user.service';
import { MessageContext } from '../context/MessageContext';
import { DataContext } from '../context/DataContext';

import DateForm from './DateForm';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';
import authService from '../services/auth.service';
import { useLocation } from 'react-router-dom';


import ChartComponent from './chart/ChartComponent';
import { isValid } from 'date-fns';

const useStyles = makeStyles({
    root: {
    },
    wrapper: {
        padding: '0 1rem',
    },
    fullSpan: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
    },
    spaceSpan: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-top',
    },
    stockContainer: {
        padding: '2rem',
    },
    stockChange: {
        backgroundColor: '#eeeeee',
        padding: '1rem',
    },
    divider: {
        marginBottom: '2rem',
    },
    table: {
        marginTop: '2rem',
    },
    green: {
        color: '#10b348',
        fontWeight: 'bold',
    },
    red: {
        color: '#ff0000',
    },
    justifyCenter: {
        display: 'flex',
        alignItems: 'center',
    },
    justifyTop: {
        display: 'd-flex',
        alignItems: 'flex-top',
        paddingTop: 0,
    },
    bgBlue: {
        backgroundColor: '#262c2e',
    },
    fullPadding: {
        padding: '2rem',
    }
})
//---------------------------------------------------


const CalcChange = ({ open, close }) => {

    // TODO: Breaks for new stocks where open is 0
    const classes = useStyles();
    let change = 0;
    change = Number(((close - open) / open) * 100).toFixed(2);

    let retString = "No change";
    if (change !== 0) {
        let colour;
        let arrow;

        if (change > 0) {
            colour = classes.green;
            arrow = <ArrowDropUpIcon />
        } else {
            colour = classes.red;
            arrow = <ArrowDropDownIcon />
        }
        retString = <div className={`${colour} ${classes.justifyCenter}`}>{arrow} {change}%</div>
    }

    return retString
}


const Showstock = ({ match }) => {
    let history = useHistory();
    const classes = useStyles();
    const [message, setMessage] = useContext(MessageContext);
    const [stockList, setStockList] = useContext(DataContext);

    const queryString = require('query-string');
    const query = queryString.parse(window.location.search);
    const location = useLocation();

    const user = authService.getCurrentUser();

    const [table, setTable] = useState({
        columnDefs: [
            {
                headerName: "Date", field: "timestamp", sortable: true, cellRenderer: (data) => {
                    return new Date(data.value.split(',')[0]).toLocaleDateString();
                }
            },
            { headerName: "Open", field: "open" },
            { headerName: "High", field: "high" },
            { headerName: "Low", field: "low" },
            { headerName: "Close", field: "close", sortable: true },
            { headerName: "Volumes", field: "volumes", sortable: true },
        ],
        rowData: [{}],
        defaultColDef: {
            sortable: false,
            flex: 1,
            resizable: true,
        },
        animateRows: true,
        pagination: true,
        paginationPageSize: 10,
        domLayout: 'autoHeight',
        rowSelection: 'single',
        getRowHeight: function (params) {
            return 40;
        },
        statusBar: {
            statusPanels: [
                { statusPanel: 'agTotalAndFilteredRowCountComponent', align: 'left' },
                { statusPanel: 'agTotalRowCountComponent', align: 'center' },
                { statusPanel: 'agFilteredRowCountComponent' },
                { statusPanel: 'agSelectedRowCountComponent' },
                { statusPanel: 'agAggregationComponent' },
            ]
        },
    });

    const [stock, setStock] = useState({
        timestamp: "",
        symbol: "",
        name: "",
        industry: "",
        open: 0,
        high: 0,
        low: 0,
        close: 0,
        volumes: 0,
    });

    useEffect(() => {
        fetchStock();
    }, [table, location]);


    const fetchStock = async () => {
        setStockList(0);
        let retList;

        // TODO
        // invalid symbol  : receive 0
        // valid symbol : receive 1

        if ((query.from || query.to)) {
            if (user) {
                // PROCESS QUERY
                if (!isValid(new Date(query.from))) {
                    setMessage({ error: true, message: 'SWORD AT THE READY!' })
                    retList = await userService.getStock(match.params.id);
                    setStock(retList);
                }
                else {
                    retList = await userService.getAuthedStock(match.params.id, queryString.stringify(query));
                    if (retList.error) {
                        setMessage({ error: true, message: 'Error: No stocks found for selected date range' });
                        retList = await userService.getStock(match.params.id);
                        setStock(retList);
                    } else if (retList.length !== 0) {
                        if (retList.length > 1) setStockList(retList);
                        setStock(retList[0]);
                    }
                }
            } else {
                // MUST LOGIN
                setMessage({ error: true, message: 'Must login to use member functions' });
                history.push("/login");
            }
        } else {
            // SHOW 1 STOCK
            retList = await userService.getStock(match.params.id);
            setStock(retList);
        }


    }

    const DrawList = () => {

        return (
            <Grid container spacing={2}>
                <Grid item sm={12} md={6}>
                    <div id="table" className="ag-theme-balham-dark"
                        style={{
                            paddingLeft: '1rem'
                        }} >

                        <AgGridReact
                            columnDefs={table.columnDefs}
                            defaultColDef={table.defaultColDef}
                            animateRows={table.animateRows}
                            rowData={stockList}
                            pagination={table.pagination}
                            paginationPageSize={table.paginationPageSize}
                            domLayout={table.domLayout}
                            rowSelection={table.rowSelection}
                            getRowHeight={table.getRowHeight}
                            statusBar={table.statusBar}
                        />
                    </div>
                </Grid>
                <Grid item sm={12} md={6}>
                    <ChartComponent />
                </Grid>
            </Grid>

        )
    }


    const DrawOne = () => {
        const theDate = new Date(stock.timestamp.split(',')[0]).toLocaleDateString();
        return (
            <Box className={classes.spaceSpan} >
                <Grid container>
                    <Grid item md={5} sm={12} className={classes.stockContainer}>Price at: {theDate}<Typography variant="h1" gutterBottom>${stock.close}</Typography></Grid>

                    <Grid item md={7} sm={12}>
                        <Table className={classes.table} aria-label="Price Movement">
                            <TableHead>
                                <TableRow>
                                    <TableCell className={classes.justifyTop}>Open</TableCell>
                                    <TableCell className={classes.justifyTop}>High/low</TableCell>
                                    <TableCell className={classes.justifyTop}>Change</TableCell>
                                    <TableCell className={classes.justifyTop}>Volume</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>${stock.open}</TableCell>
                                    <TableCell><span>${stock.high}</span> / <span>${stock.low}</span></TableCell>
                                    <TableCell><CalcChange open={stock.open} close={stock.close} /></TableCell>
                                    <TableCell>{(stock.volumes).toLocaleString()}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </Box >
        )
    }

    let toRender;

    toRender = (
        <Paper elevation={1} className={classes.stockContainer}>
            <Box ><Typography variant="h3" gutterBottom>{stock.name} - ({stock.symbol})</Typography><span><Typography variant="subtitle1" color="textSecondary">{stock.industry}</Typography></span></Box>
            <Divider className={classes.divider} />

            <DateForm from={query.from} to={query.to} />

            <Paper className={`${classes.bgBlue}`}>

                {
                    stockList ? <DrawList /> : <DrawOne />
                }

            </Paper>

        </Paper>
    )

    return (
        <div className={classes.wrapper}>
            {toRender}
        </div>
    );
}

export default Showstock;