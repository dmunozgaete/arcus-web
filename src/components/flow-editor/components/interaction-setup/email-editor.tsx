import React from 'react';
import './index.less';
import i18n from '../../../../lib/i18n';
import locales from '../../locales';
import { Button, PageHeader, Form, Input, Radio, FormInstance, Switch, Checkbox, Slider } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { IEmailInteraction } from '../../../../clients/FlowClient';

const localize = i18n(locales);

interface IProps {
  onSetupCompleted: (email: IEmailInteraction | undefined, newEmail: IEmailInteraction) => void
  onCancel: () => void
  onBack: () => void
  email?: IEmailInteraction
}

interface IState {
  newEmail?: IEmailInteraction
}

export default class EmailEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();
  state: IState = {
    newEmail: this.props.email ? Object.assign({}, this.props.email) : undefined
  }

  onCancelClickHandler = async () => {
    const { onCancel } = this.props
    onCancel();
  }

  onBackClickHandler = async () => {
    const { onBack } = this.props
    onBack();
  }

  onSaveClickHandler = async (values: IEmailInteraction) => {
    const { onSetupCompleted, email } = this.props;
    const newData = this.state.newEmail || {};

    Object.keys(values).forEach((name: string) => {
      const key = name as keyof IEmailInteraction;
      (newData as any)[key] = values[key];
    })

    onSetupCompleted(email, newData! as IEmailInteraction);
  }

  render() {
    const { newEmail } = this.state;
    return <>
      <PageHeader
        onBack={newEmail ? undefined : this.onBackClickHandler}
        title={localize('INTERACTION_EMAIL_TITLE')}
        subTitle={localize('INTERACTION_EMAIL_DESCRIPTION')}
      />

      {/* FORM */}
      <div className="form-editor">
        <Form style={{ position: "relative" }} ref={this.formRef} layout="vertical" initialValues={newEmail} onFinish={this.onSaveClickHandler} onFinishFailed={() => { }}>

          <Form.Item
            label={localize('EMAIL_EDITOR_FORM_NAME_LABEL')}
            name="name"
            tooltip={{ title: localize('EMAIL_EDITOR_FORM_NAME_TOOLTIP'), icon: <InfoCircleOutlined /> }}
            rules={[{ required: true, message: localize('EMAIL_EDITOR_FORM_NAME_REQUIRED_MESSAGE') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={localize('EMAIL_EDITOR_FORM_DESCRIPTION_LABEL')}>
            <Input.TextArea placeholder={localize('EMAIL_EDITOR_FORM_DESCRIPTION_PLACEHOLDER')} autoSize={{ maxRows: 4, minRows: 3 }} />
          </Form.Item>

          <Form.Item>
            TODO....
          </Form.Item>

          <Form.Item
            name="disabled"
            label={localize('EMAIL_EDITOR_FORM_DISABLED_LABEL')}
            valuePropName="checked"
          >
            <Switch defaultChecked={false}></Switch>
          </Form.Item>

        </Form>
      </div>

      <div className="ant-drawer-footer">
        <Form.Item>
          <Button type="primary" size="large" shape="round" onClick={() => this.formRef.current?.submit()}>
            {localize('EMAIL_EDITOR_FORM_SAVE_LABEL')}
          </Button>

          <Button onClick={this.onCancelClickHandler} danger type="link">
            {localize('EMAIL_EDITOR_FORM_CANCEL_LABEL')}
          </Button>
        </Form.Item>

      </div>
    </>
  }
}