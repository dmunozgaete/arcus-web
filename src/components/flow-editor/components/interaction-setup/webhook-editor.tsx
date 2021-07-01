import React from 'react';
import './index.less';
import i18n from '../../../../lib/i18n';
import locales from '../../locales';
import { Button, PageHeader, Form, Input, Radio, FormInstance, Switch, Checkbox, Slider } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { IWebhookInteraction } from '../../../../clients/FlowClient';

const localize = i18n(locales);

interface IProps {
  onSetupCompleted: (webhook: IWebhookInteraction | undefined, newWebhook: IWebhookInteraction) => void
  onCancel: () => void
  onBack: () => void
  webhook?: IWebhookInteraction
}

interface IState {
  newWebhook?: IWebhookInteraction
}

export default class WebhookEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();
  state: IState = {
    newWebhook: this.props.webhook ? Object.assign({}, this.props.webhook) : undefined
  }

  onCancelClickHandler = async () => {
    const { onCancel } = this.props
    onCancel();
  }

  onBackClickHandler = async () => {
    const { onBack } = this.props
    onBack();
  }

  onSaveClickHandler = async (values: IWebhookInteraction) => {
    const { onSetupCompleted, webhook } = this.props;
    const newData = this.state.newWebhook || {};

    Object.keys(values).forEach((name: string) => {
      const key = name as keyof IWebhookInteraction;
      (newData as any)[key] = values[key];
    })

    onSetupCompleted(webhook, newData! as IWebhookInteraction);
  }

  render() {
    const { newWebhook } = this.state;
    return <>
      <PageHeader
        onBack={newWebhook ? undefined : this.onBackClickHandler}
        title={localize('INTERACTION_WEBHOOK_TITLE')}
        subTitle={localize('INTERACTION_WEBHOOK_DESCRIPTION')}
      />

      {/* FORM */}
      <Form style={{ position: "relative", height: "calc(100% - 136px)", overflowX: "scroll" }} name={`webhook_data_${(new Date()).getTime()}`} ref={this.formRef} layout="vertical" initialValues={newWebhook} onFinish={this.onSaveClickHandler} onFinishFailed={() => { }}>

        <Form.Item
          label={localize('WEBHOOK_EDITOR_FORM_NAME_LABEL')}
          name="name"
          tooltip={{ title: localize('WEBHOOK_EDITOR_FORM_NAME_TOOLTIP'), icon: <InfoCircleOutlined /> }}
          rules={[{ required: true, message: localize('WEBHOOK_EDITOR_FORM_NAME_REQUIRED_MESSAGE') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="description" label={localize('WEBHOOK_EDITOR_FORM_DESCRIPTION_LABEL')}>
          <Input.TextArea placeholder={localize('WEBHOOK_EDITOR_FORM_DESCRIPTION_PLACEHOLDER')} autoSize={{ maxRows: 4, minRows: 3 }} />
        </Form.Item>

        <Form.Item
          label={localize('WEBHOOK_EDITOR_FORM_URL_LABEL')}
          name="url"
          tooltip={{ title: localize('WEBHOOK_EDITOR_FORM_URL_TOOLTIP'), icon: <InfoCircleOutlined /> }}
          rules={[{ required: true, message: localize('WEBHOOK_EDITOR_FORM_URL_REQUIRED_MESSAGE') }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label={localize('WEBHOOK_EDITOR_FORM_METHOD_LABEL')}
          name="method"
          tooltip={{ title: localize('WEBHOOK_EDITOR_FORM_METHOD_TOOLTIP'), icon: <InfoCircleOutlined /> }}
          rules={[{ required: true, message: localize('WEBHOOK_EDITOR_FORM_METHOD_REQUIRED_MESSAGE') }]}
        >
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="POST">POST</Radio.Button>
            <Radio.Button value="PUT">PUT</Radio.Button>
            <Radio.Button value="GET">GET</Radio.Button>
            <Radio.Button value="DELETE">DELETE</Radio.Button>
            <Radio.Button value="PATCH">PATCH</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label={localize('WEBHOOK_EDITOR_FORM_STATUS_CODE_LABEL')}
          name="status_codes_success"
          tooltip={{ title: localize('WEBHOOK_EDITOR_FORM_STATUS_CODE_TOOLTIP'), icon: <InfoCircleOutlined /> }}
          rules={[{ required: true, message: localize('WEBHOOK_EDITOR_FORM_STATUS_CODE_REQUIRED_MESSAGE') }]}
        >
          <Checkbox.Group >
            <Checkbox value={200}>200</Checkbox>
            <Checkbox value={201}>201</Checkbox>
            <Checkbox value={202}>202</Checkbox>
            <Checkbox value={203}>203</Checkbox>
            <Checkbox value={204}>204</Checkbox>
            <Checkbox value={206}>206</Checkbox>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item
          label={localize('WEBHOOK_EDITOR_FORM_TIMEOUT_TO_WAIT_LABEL')}
          name="timeout_in_seconds_to_wait"
          tooltip={{ title: localize('WEBHOOK_EDITOR_FORM_TIMEOUT_TO_WAIT_TOOLTIP'), icon: <InfoCircleOutlined /> }}
        >
          <div
            style={{ paddingLeft: "5px", paddingRight: "20%" }}>
            <Slider min={1} max={10} defaultValue={2}
              tipFormatter={(value) => {
                return `${value} ${localize('WEBHOOK_EDITOR_FORM_METRIC_LABEL')}`;
              }}
            />
          </div>
        </Form.Item>

        <Form.Item
          name="disabled"
          label={localize('WEBHOOK_EDITOR_FORM_DISABLED_LABEL')}
          valuePropName="checked"
        >
          <Switch defaultChecked={false}></Switch>
        </Form.Item>


      </Form>

      <div className="ant-drawer-footer">
        <Form.Item>
          <Button type="primary" size="large" shape="round" onClick={() => this.formRef.current?.submit()}>
            {localize('WEBHOOK_EDITOR_FORM_SAVE_LABEL')}
          </Button>

          <Button onClick={this.onCancelClickHandler} danger type="link">
            {localize('WEBHOOK_EDITOR_FORM_CANCEL_LABEL')}
          </Button>
        </Form.Item>

      </div>


    </>
  }
}