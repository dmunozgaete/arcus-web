import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

/* Components */
import BootLoader from './components/boot-loader';

/* Theme variables */
import './assets/theme/variables.css';
import './assets/theme/fonts.css';

/* Clients */
import AuthenticationClient from './clients/AuthenticationClient';
import SettingsClient from './clients/SettingsClient';

/* Core Pages */

import SignInPage, { onSignInCallbackHandler } from './pages/sign-in';

/*import ApplyFlowPage from './pages/apply-flow';
import OnBoardingPage from './pages/onboarding';
*/
import RootHomePage from './pages/root-home';

import IJwt from './models/IJwt';

interface PageState {
  booting: boolean,
  authenticated: boolean,
  is_first_time: boolean,
  app_booting: boolean,
}

export default class App extends React.Component<{}, PageState> {
  state: PageState = {
    booting: true,
    authenticated: false,
    // If is the first time, we need to launch the onboarding page
    is_first_time: false,
    // Just for pre-boot SettingsClient that we really need 
    // before other clients
    app_booting: true
  }

  componentDidMount() {
    this.startHandler();
  }

  startHandler = async () => {
    // We need this client booted before the main boot loader
    await SettingsClient.boot();

    this.setState({
      app_booting: false,
      is_first_time: SettingsClient.get("FIRST_TIME", true)
    })
  }

  onBootCompleteHandler = () => {
    this.setState({
      booting: false,
      authenticated: AuthenticationClient.isAuthenticated(),
      is_first_time: SettingsClient.get("FIRST_TIME", true),
    });
  }

  onAuthenticatedHandler = (jwt: IJwt) => {
    this.setState({
      authenticated: true,
    })
  }

  onBoardingCompletedHandler = () => {
    this.setState({
      is_first_time: SettingsClient.get("FIRST_TIME", true)
    })
  }


  render() {
    const { app_booting, booting, authenticated } = this.state;

    if (app_booting) {
      return <div></div>;
    }

    if (booting) {
      return <BootLoader onLoadComplete={this.onBootCompleteHandler} />
    }

    if (!authenticated) {
      return <SignInPage onAuthenticated={this.onAuthenticatedHandler} />
    }


    return <div>
      <div>Header</div>
      <Router >
        <Switch>
          {/* CORE PATHS */}

          {/* 
          <Route path="/about" exact={true}>
            <div> About</div>
          </Route>
          <Route path="/users" exact={true}>
            <div> Users</div>
          </Route>
          */}
          <Route path="/" component={RootHomePage} exact={true} />
        </Switch>
      </Router>
    </div>;
  }
}

