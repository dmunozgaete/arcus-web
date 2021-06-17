import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

/* Components */
import BootLoader from './components/boot-loader';

/* Theme variables */
import './assets/theme/variables.less';
import 'antd/dist/antd.less'
import './App.less';

/* Clients */
import AuthenticationClient from './clients/AuthenticationClient';
import SettingsClient from './clients/SettingsClient';

/* Core Pages */

import SignInPage from './pages/sign-in';

import BpmReadPage from './pages/bpm/read';
import BpmCreatePage from './pages/bpm/create';
import BpmUpdatePage from './pages/bpm/update';

import UsersReadPage from './pages/users/read';
import RootHomePage from './pages/root-home';

import IJwt from './models/IJwt';

import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PartitionOutlined,
  TeamOutlined
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;


interface PageState {
  booting: boolean,
  authenticated: boolean,
  is_first_time: boolean,
  app_booting: boolean,
  sidebar_collapsed: boolean
}

export default class App extends React.Component<{}, PageState> {
  state: PageState = {
    booting: true,
    authenticated: false,
    // If is the first time, we need to launch the onboarding page
    is_first_time: false,
    // Just for pre-boot SettingsClient that we really need 
    // before other clients
    app_booting: true,

    sidebar_collapsed: false
  }

  componentDidMount() {
    this.startHandler();
  }

  startHandler = async () => {
    // We need this client booted before the main boot loader
    await SettingsClient.boot();

    this.setState({
      app_booting: false,
      is_first_time: SettingsClient.get("FIRST_TIME", true),
      sidebar_collapsed: SettingsClient.get("SIDEBAR_COLLAPSED", false)
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

  onToggleSidebarHandler = () => {
    const { sidebar_collapsed } = this.state;
    this.setState({
      sidebar_collapsed: !sidebar_collapsed
    })

    SettingsClient.set("SIDEBAR_COLLAPSED", !sidebar_collapsed)
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

    const { sidebar_collapsed } = this.state;
    return <Router>
      <Layout className="parent-root">
        <Sider width={230} trigger={null} collapsible collapsed={sidebar_collapsed}>
          <div className="logo">
            <div></div>
          </div>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<PartitionOutlined />}>
              <Link to="/bpm">Bpm</Link>
            </Menu.Item>

            <Menu.Item key="2" icon={<TeamOutlined />}>
              <Link to="/users">Usuarios</Link>
            </Menu.Item>

          </Menu>
        </Sider>
        <Layout >
          <Header>
            {React.createElement(sidebar_collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              onClick: this.onToggleSidebarHandler,
            })}
          </Header>
          <Content>
            <Switch>
              <Route path="/" component={RootHomePage} exact={true} />
              <Route path="/bpm" component={BpmReadPage} exact={true} />
              <Route path="/bpm/create" component={BpmCreatePage} exact={true} />
              <Route path="/bpm/update/:id" component={BpmUpdatePage} exact={true} />
              <Route path="/users" component={UsersReadPage} exact={true} />
            </Switch>
          </Content>
        </Layout>
      </Layout>


    </Router>

  }
}

