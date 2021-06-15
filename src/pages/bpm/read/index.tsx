import React from "react";
import './index.scss';
import ChildPage from "../../../components/child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';

const localize = i18n(locales);

interface IProps { }
interface IState { }

export default class BpmReadPage extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() {
  }

  render() {
    return <ChildPage>
      <div>
        {localize("PAGE_TITLE")}
      </div>
    </ChildPage>
  }
}