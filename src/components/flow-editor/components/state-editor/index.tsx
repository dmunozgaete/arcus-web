import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Button } from 'antd'
import { Drawer } from 'antd';
import { IBpmMetadataStateItem } from '../../../../clients/BPMClient';
import Expr from '../../../../lib/Expr';

const localize = i18n(locales);

interface IProps {
  state: IBpmMetadataStateItem
  onClose: () => void
  onChange?: (oldState: IBpmMetadataStateItem, newState: IBpmMetadataStateItem) => void
}
interface IState {
  drawer_open: boolean,
  newState: IBpmMetadataStateItem
}

export default class StateEditor extends React.Component<IProps, IState> {
  state = {
    drawer_open: true,
    newState: Object.assign({}, this.props.state)
  }

  onAfterVisibleChangeHandler = async (visible: boolean) => {
    Expr.whenFalse(visible, () => {
      const { onClose } = this.props;
      onClose();
    })
  }

  onSaveClickHandler = async () => {
    const { onChange, state } = this.props;
    const { newState } = this.state;

    Expr.whenNotUndefined(onChange, () => {
      newState.label = "ASDASD";
      onChange!(state, newState);
    })

    this.setState({
      drawer_open: false
    });
  }

  render() {
    const { drawer_open } = this.state;
    return <div className="state-editor">
      <Drawer
        placement="right"
        visible={drawer_open}
        afterVisibleChange={this.onAfterVisibleChangeHandler}
        closable={false}
        width={450}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <p>State...</p>

        <Button onClick={this.onSaveClickHandler}>
          {localize('STATE_EDITOR_SAVE_BUTTON_LABEL')}
        </Button>
      </Drawer>
    </div>
  }
}