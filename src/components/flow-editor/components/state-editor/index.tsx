import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Button } from 'antd'
import { Drawer, Form, Input, Checkbox, FormInstance, Popconfirm } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { IFlowMetadataState } from '../../../../clients/FlowClient';
import Expr from '../../../../lib/Expr';
import ActorSelector from '../../../actor-selector'

const localize = i18n(locales);

interface IProps {
  state: IFlowMetadataState
  onClose: () => void
  onChange?: (oldState: IFlowMetadataState, newState: IFlowMetadataState) => void
}
interface IState {
  drawer_open: boolean,
  newState: IFlowMetadataState
}

export default class StateEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();
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

  onSaveClickHandler = async (values: IFlowMetadataState) => {
    const { onChange, state } = this.props;
    const { newState } = this.state;

    Expr.whenNotUndefined(onChange, () => {
      Object.keys(values).forEach((name: string) => {
        const key = name as keyof IFlowMetadataState;
        (newState as any)[key] = values[key];
      })

      onChange!(state, newState);
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
    const { drawer_open, newState } = this.state;
    return <div className="flow-state-editor">
      <Drawer
        placement="right"
        visible={drawer_open}
        afterVisibleChange={this.onAfterVisibleChangeHandler}
        closable={false}
        width={450}
        title={localize('STATE_EDITOR_DRAWER_TITLE')}
        footer={
          <Form.Item >
            <Button type="primary" onClick={() => this.formRef.current?.submit()} shape="round" size="large">
              {localize('STATE_EDITOR_SAVE_BUTTON_LABEL')}
            </Button>

            <Popconfirm
              title={localize('STATE_EDITOR_POPCONFIRM_TITLE')}
              onConfirm={this.onCancelClickHandler}
              okText={localize('STATE_EDITOR_POPCONFIRM_YES')}
              cancelText={localize('STATE_EDITOR_POPCONFIRM_NO')}
            >
              <Button type="link" size="large" danger> 
                {localize('STATE_EDITOR_CANCEL_BUTTON_LABEL')}
              </Button>
            </Popconfirm>
          </Form.Item>
        }
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {/* FORM */}
        <Form name="state_data" ref={this.formRef} layout="vertical" initialValues={newState} onFinish={this.onSaveClickHandler} onFinishFailed={() => {}}>

          <Form.Item
            label={localize('STATE_EDITOR_FORM_NAME_LABEL')}
            name="label"
            tooltip={{ title: localize('STATE_EDITOR_FORM_NAME_TOOLTIP'), icon: <InfoCircleOutlined /> }}
            rules={[{ required: true, message: localize('STATE_EDITOR_FORM_NAME_REQUIRED_MESSAGE') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={localize('STATE_EDITOR_FORM_DESCRIPTION_LABEL')}>
            <Input.TextArea placeholder={localize('STATE_EDITOR_FORM_DESCRIPTION_PLACEHOLDER')} autoSize={{ maxRows: 6, minRows: 4 }} />
          </Form.Item>

          <Form.Item
            name="actors"
            valuePropName="actors"
            label={localize('STATE_EDITOR_FORM_ACTORS_LABEL')}
            tooltip={{ title: localize('STATE_EDITOR_FORM_ACTORS_TOOLTIP'), icon: <InfoCircleOutlined /> }}
            rules={[{ required: true, message: localize('STATE_EDITOR_FORM_ACTORS_REQUIRED_MESSAGE') }]}
          >

            <ActorSelector
              placeholder={localize('STATE_EDITOR_FORM_ACTORS_PLACEHOLDER')}
            />
          </Form.Item>

          <Form.Item
            name="start"
            valuePropName="checked"
            style={{ marginBottom: 0 }}
          >
            <Checkbox disabled={true}>{localize('STATE_EDITOR_FORM_START_LABEL')}</Checkbox>
          </Form.Item>

          <Form.Item name="end" valuePropName="checked" >
            <Checkbox disabled={newState.start ? true : false}>{localize('STATE_EDITOR_FORM_END_LABEL')}</Checkbox>
          </Form.Item>

        </Form>

      </Drawer>
    </div>
  }
}