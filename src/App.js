import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { Box } from '@material-ui/core';
import Home from './components/Home';
import Stocklist from './components/Stocklist';
import Showstock from './components/Showstock';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { MessageProvider } from './context/MessageContext';
import { DataProvider } from './context/DataContext';
import RenderAlert from './services/Alert';


import { AppBar, Toolbar, Tabs, Tab } from '@material-ui/core';
import { createMuiTheme, ThemeProvider, responsiveFontSizes } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import AuthService from "./services/auth.service";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
	},
	mainContent: {
		marginTop: '7rem',
	}
}));


function App() {

	let darkTheme = createMuiTheme({
		palette: {
			type: 'dark',
		},
		overrides: {
			MuiPaper: {
				root: {
					backgroundColor: '#2d3436',
				}
			},
			MuiCssBaseline: {
				"@global": {
					body: {
						backgroundColor: '#262c2e',
					},
				}
			}
		}
	});

	darkTheme = responsiveFontSizes(darkTheme);

	const classes = useStyles();
	const [value, setValue] = useState(0);
	const [message, setMessage] = useState({});

	//console.log(window.location);
	console.log(value);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	}

	useEffect(() => {
		setValue(window.location.pathname);
	}, [value, message]);

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<MessageProvider>
				<DataProvider>
					<Router>
						<AppBar position="fixed" className="nav" style={{ background: '#262c2e', marginBottom: '3rem' }}>
							<Toolbar>
								<Typography variant="h6" className={classes.title}>
									NeoCities
               				</Typography>

								<Tabs
									value={window.location.pathname}
									onChange={handleChange}
									aria-label="Nav bar"
								>
									<Tab label="Home" to="/" component={Link} value='/' />
									<Tab label="Stock list" to="/stocklist" component={Link} value='/stocklist' />
									{
										AuthService.getCurrentUser() ?
											<Tab label="Logout" to="/logout" component={Link} value='/logout' />
											:
											<Tab label="Login/Register" to="/login" component={Link} value='/login' />
									}

								</Tabs>
							</Toolbar>
						</AppBar>
						{/* <Nav /> */}
						<Box className={classes.mainContent}>
							<RenderAlert />
							<Switch>
								<Route path='/' exact component={Home} />
								<Route path="/stocklist" exact component={Stocklist} />
								<Route path="/stocklist/:id" component={Showstock} />
								<Route path="/login" component={Login} />
								<Route path="/register" component={Register} />
								<Route path="/logout" component={Logout} />

							</Switch>
						</Box>
					</Router>
				</DataProvider>
			</MessageProvider>
		</ThemeProvider>
	);
}

export default App;
