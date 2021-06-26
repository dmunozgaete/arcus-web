import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Button } from 'antd'
import { Drawer, Form, Input, Checkbox, FormInstance, Popconfirm } from 'antd';
import { IBpmMetadataStateItem, IBpmMetadataTransitionItem } from '../../../../clients/BPMClient';
import Expr from '../../../../lib/Expr';

const localize = i18n(locales);

interface IProps {
  transition: IBpmMetadataTransitionItem
  onClose: () => void
  onChange?: (oldState: IBpmMetadataTransitionItem, newTransition: IBpmMetadataTransitionItem) => void
}
interface IState {
  drawer_open: boolean,
  newTransition: IBpmMetadataTransitionItem
}

export default class TransitionEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();
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

  onSaveClickHandler = async (values: IBpmMetadataStateItem) => {
    const { onChange, transition } = this.props;
    const { newTransition } = this.state;

    Expr.whenNotUndefined(onChange, () => {
      Object.keys(values).forEach((name: string) => {
        const key = name as keyof IBpmMetadataStateItem;
        (newTransition as any)[key] = values[key];
      })

      onChange!(transition, newTransition);
    })

    this.setState({
      drawer_open: false
    });
  }

  onCancelClickHandler = () => {
    this.setState({
      drawer_open: false
    })
  }

  render() {
    const { drawer_open, newTransition } = this.state;
    return <div className="flow-transition-editor">
      <Drawer
        placement="right"
        visible={drawer_open}
        afterVisibleChange={this.onAfterVisibleChangeHandler}
        closable={false}
        width={450}
        title={localize('TRANSITION_EDITOR_DRAWER_TITLE')}
        footer={
          <Form.Item >
            <Button type="primary" onClick={() => this.formRef.current?.submit()} shape="round" size="large">
              {localize('TRANSITION_EDITOR_SAVE_BUTTON_LABEL')}
            </Button>

            <Popconfirm
              title={localize('TRANSITION_EDITOR_POPCONFIRM_TITLE')}
              onConfirm={this.onCancelClickHandler}
              okText={localize('TRANSITION_EDITOR_POPCONFIRM_YES')}
              cancelText={localize('TRANSITION_EDITOR_POPCONFIRM_NO')}
            >
              <Button type="link" size="large">
                {localize('TRANSITION_EDITOR_CANCEL_BUTTON_LABEL')}
              </Button>
            </Popconfirm>
          </Form.Item>
        }
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {/* FORM */}
        <Form name="basic" ref={this.formRef} layout="vertical" initialValues={newTransition} onFinish={this.onSaveClickHandler} onFinishFailed={() => { }}>

          <Form.Item
            label={localize('TRANSITION_EDITOR_FORM_NAME_LABEL')}
            name="label"
            rules={[{ required: true, message: localize('TRANSITION_EDITOR_FORM_NAME_REQUIRED_MESSAGE') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={localize('TRANSITION_EDITOR_FORM_DESCRIPTION_LABEL')}>
            <Input.TextArea placeholder={localize('TRANSITION_EDITOR_FORM_DESCRIPTION_PLACEHOLDER')} autoSize={{ maxRows: 8, minRows: 5 }} />
          </Form.Item>

        </Form>
      </Drawer>
    </div>
  }
}