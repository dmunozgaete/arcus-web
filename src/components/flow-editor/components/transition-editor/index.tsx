import React from 'react';
import './index.less';
import i18n from '../../../../lib/i18n';
import locales from '../../locales';
import { Button } from 'antd'
import { Drawer } from 'antd';
import { IBpmMetadataTransitionItem } from '../../../../clients/BPMClient';
import Expr from '../../../../lib/Expr';

const localize = i18n(locales);

interface IProps {
  transition: IBpmMetadataTransitionItem
  onClose: () => void
  onChange?: (oldState: IBpmMetadataTransitionItem, newState: IBpmMetadataTransitionItem) => void
}
interface IState {
  drawer_open: boolean,
  newTransition: IBpmMetadataTransitionItem
}

export default class TransitionEditor extends React.Component<IProps, IState> {
  state = {
    drawer_open: true,
    newTransition: Object.assign({}, this.props.transition)
  }

  onAfterVisibleChangeHandler = async (visible: boolean) => {
    Expr.whenFalse(visible, () => {
      const { onClose } = this.props;
      onClose();
    })
  }

  onSaveClickHandler = async () => {
    const { onChange, transition } = this.props;
    const { newTransition } = this.state;

    Expr.whenNotUndefined(onChange, () => {
      newTransition.label = "TRANSITIONSDD";
      onChange!(transition, newTransition);
    })

    this.setState({
      drawer_open: false
    });
  }

  render() {
    const { drawer_open } = this.state;

    return <div className="transition-editor">
      <Drawer
        placement="right"
        visible={drawer_open}
        afterVisibleChange={this.onAfterVisibleChangeHandler}
        closable={false}
        width={450}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <p>Transition...</p>

        <Button onClick={this.onSaveClickHandler}>
          {localize('TRANSITION_EDITOR_SAVE_BUTTON_LABEL')}
        </Button>
      </Drawer>
    </div>
  }
}