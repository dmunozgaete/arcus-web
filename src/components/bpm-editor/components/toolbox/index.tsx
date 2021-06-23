import React from 'react';
import './index.less';
import { Button } from 'antd';
import { ExpandAltOutlined } from '@ant-design/icons';

import i18n from '../../../../lib/i18n';
import locales from '../../locales';
import Expr from '../../../../lib/Expr';
const localize = i18n(locales);

interface IProps {
  x: number,
  y: number,

  onToolBoxClick?: (action: TOOLBOX_OPTIONS) => {}
}
interface IState { }

export default class BpmToolbox extends React.Component<IProps, IState> {
  state: IState = {}

  onToolBoxClickHandler = async (action: TOOLBOX_OPTIONS) => {
    const { onToolBoxClick } = this.props;

    Expr.whenTrue(onToolBoxClick !== undefined, () => {
      onToolBoxClick!(action);
    })
  }


  render() {
    const { x, y } = this.props;
    return <div className="bpm-toolbox" style={{ top: y, left: x }}>
      <Button
        shape="circle"
        icon={<ExpandAltOutlined />}
        onClick={e => this.onToolBoxClickHandler(TOOLBOX_OPTIONS.ADD_NEW_STATE)}
      />
    </div>
  }
}

export enum TOOLBOX_OPTIONS {
  "ADD_NEW_STATE" = "ADD_NEW_STATE",
  "ADD_NEW_CONNECTION" = "ADD_NEW_CONNECTION",
}

export type TOOLBOX_OPTIONS_TYPE =
  | { type: TOOLBOX_OPTIONS.ADD_NEW_STATE; meta_data: { id: string } }
  | { type: TOOLBOX_OPTIONS.ADD_NEW_CONNECTION; meta_data: { test: string } }
