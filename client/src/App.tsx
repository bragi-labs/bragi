import React, { ReactElement, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMyTheme } from './services/themeHelper';
import './App.css';
import { AppDataHelper } from './services/appDataHelper';
import { MainPage } from './views/main/MainPage';

function App(): ReactElement {
	const [theme] = useState(createMyTheme());

	useEffect(() => {
		document.title = AppDataHelper.appName;
	}, []);

	return (
		<>
			<CssBaseline />
			<ThemeProvider theme={theme}>
				<BrowserRouter>
					<MainPage />
				</BrowserRouter>
			</ThemeProvider>
		</>
	);
}

export default App;
