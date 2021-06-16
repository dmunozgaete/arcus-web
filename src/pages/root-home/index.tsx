import React from 'react';
import './index.less';
import { RouteComponentProps } from 'react-router-dom';
import ChariotConsole from '../../lib/ChariotConsole';
import RouterChildPage from "../../components/router-child-page";

// import i18n from '../../lib/i18n';
// import locales from './locales';

const chariot = ChariotConsole({ label: "root-home" });

//const localize = i18n(locales);
interface IState {
  mode: "INITIAL_STATE"
  menu_is_open: boolean,
}

export default class RootPage extends React.Component<RouteComponentProps, IState> {
  state: IState = {
    mode: "INITIAL_STATE",
    menu_is_open: false
  }

  componentDidMount() {
    setTimeout(() => this.getUserDashboard(), 170);
  }

  getUserDashboard = async () => {
    try {
      console.log('s')

    } catch (error) {
      chariot.error('An error has occurred trying to get user dashboard', error)
      chariot.debug(error);
    }
  }


  render() {
    return <RouterChildPage>
      <RouterChildPage.Frame>
        Home Page
      </RouterChildPage.Frame>
    </RouterChildPage>
  }

};