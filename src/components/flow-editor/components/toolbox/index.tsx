import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Tooltip, Button } from 'antd'
import { BorderOuterOutlined, InfoCircleOutlined } from '@ant-design/icons'
import Expr from '../../../../lib/Expr';

const localize = i18n(locales);

interface IProps {
  onToolBoxActionClick: (action: TOOLBOX_ACTIONS) => void
}
interface IState { }

export default class ToolBox extends React.Component<IProps, IState> {
  state = {}


  onToolBoxActionClickHandler = async (action: TOOLBOX_ACTIONS) => {
    const { onToolBoxActionClick } = this.props;

    Expr.whenTrue(
      onToolBoxActionClick !== undefined,
      () => onToolBoxActionClick!(action)
    )
  }

  render() {
    return <div className="flow-tool-box">
      <Tooltip placement="right" title={localize("TOOLBOX_ADD_STATE_LABEL")}>
        <Button
          onClick={e => this.onToolBoxActionClickHandler("ADD_NEW_STATE")}
          icon={<BorderOuterOutlined />} shape="circle"
        />

        <Button
          onClick={e => this.onToolBoxActionClickHandler("SHOW_INFO")}
          icon={<InfoCircleOutlined />} shape="circle"
        />
      </Tooltip>
    </div>
  }
}

export type TOOLBOX_ACTIONS =
  | "ADD_NEW_STATE"
  | "SHOW_INFO";
