import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Drawer, Form, Input, FormInstance, Popconfirm, Tooltip, Button, List, Avatar } from 'antd';
import { EditOutlined, InfoCircleOutlined, PlusCircleTwoTone } from '@ant-design/icons'
import { IFlowMetadataState, IFlowMetadataTransition, ITransitionInteraction } from '../../../../clients/FlowClient';
import Expr from '../../../../lib/Expr';
import InteractionSetup from '../interaction-setup';
import WebHookInteractionIcon from './../../../../assets/media/interactions/webhook.png'
import EmailInteractionIcon from './../../../../assets/media/interactions/email.png'
const localize = i18n(locales);

interface IProps {
  transition: IFlowMetadataTransition
  onClose: () => void
  onChange?: (oldState: IFlowMetadataTransition, newTransition: IFlowMetadataTransition) => void
}
interface IState {
  drawer_open: boolean;
  newTransition: IFlowMetadataTransition;
  child_drawer_open: boolean;
  child_drawer_data?: ITransitionInteraction;
}

export default class TransitionEditor extends React.Component<IProps, IState> {
  formRef = React.createRef<FormInstance>();
  state = {
    drawer_open: true,
    newTransition: Object.assign({}, this.props.transition),
    child_drawer_open: false,
    child_drawer_data: undefined
  }

  onAfterVisibleChangeHandler = async (visible: boolean) => {
    Expr.whenFalse(visible, () => {
      const { onClose } = this.props;
      onClose();
    })
  }

  onSaveClickHandler = async (values: IFlowMetadataState) => {
    const { onChange, transition } = this.props;
    const { newTransition } = this.state;

    Expr.whenNotUndefined(onChange, () => {
      Object.keys(values).forEach((name: string) => {
        const key = name as keyof IFlowMetadataState;
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

  onAddInteractionClickHandler = async () => {
    this.setState({
      child_drawer_open: true
    })
  }

  onEditInteractionClickHandler = async (interaction: ITransitionInteraction) => {
    this.setState({
      child_drawer_open: true,
      child_drawer_data: interaction
    })
  }

  onCloseChildDrawerHandler = async () => {
    this.setState({
      child_drawer_open: false,
      child_drawer_data: undefined
    })
  }

  onInteractionSetupCompletedHandler = async (interaction: ITransitionInteraction | undefined, newInteraction: ITransitionInteraction) => {
    const { newTransition } = this.state;

    if (interaction) {
      // Update current interaction
      newTransition.interactions = newTransition.interactions.map((elm) => {
        if (elm.sequence === interaction.sequence) {
          return newInteraction;
        }
        return elm;
      });
    } else {
      newTransition.interactions.push(newInteraction);
    }

    this.setState({
      newTransition,
      child_drawer_open: false,
      child_drawer_data: undefined
    })
  }


  render() {
    const { drawer_open, newTransition, child_drawer_open, child_drawer_data } = this.state;
    return <div className="flow-transition-editor">
      <Drawer
        placement="right"
        visible={drawer_open}
        push={{ distance: 350 }}
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
              <Button type="link" size="large" danger>
                {localize('TRANSITION_EDITOR_CANCEL_BUTTON_LABEL')}
              </Button>
            </Popconfirm>
          </Form.Item>
        }
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        {/* FORM */}
        <Form name="transition_data" ref={this.formRef} layout="vertical" initialValues={newTransition} onFinish={this.onSaveClickHandler} onFinishFailed={() => { }}>

          <Form.Item
            label={localize('TRANSITION_EDITOR_FORM_NAME_LABEL')}
            name="label"
            tooltip={{ title: localize('TRANSITION_EDITOR_FORM_NAME_TOOLTIP'), icon: <InfoCircleOutlined /> }}
            rules={[{ required: true, message: localize('TRANSITION_EDITOR_FORM_NAME_REQUIRED_MESSAGE') }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="description" label={localize('TRANSITION_EDITOR_FORM_DESCRIPTION_LABEL')}>
            <Input.TextArea placeholder={localize('TRANSITION_EDITOR_FORM_DESCRIPTION_PLACEHOLDER')} autoSize={{ maxRows: 5, minRows: 3 }} />
          </Form.Item>

          <Form.Item
            className="interactions-item"
            style={{ width: "100%" }}
            label={
              <div>
                <span>
                  {localize('TRANSITION_EDITOR_FORM_INTERACTIONS_LABEL')}
                </span>&nbsp;&nbsp;

                <Button onClick={this.onAddInteractionClickHandler} type="text" shape="circle" size="large" ><PlusCircleTwoTone /></Button>
              </div>
            }
          >
            <List style={{ maxHeight: 160 }}>
              {newTransition.interactions && newTransition.interactions.length > 0 ?
                newTransition.interactions.map((interaction) => {
                  return <List.Item
                    key={`interaction_${interaction.sequence}`}
                    actions={[
                      <Button shape="circle" type="text" onClick={() => this.onEditInteractionClickHandler(interaction)} icon={<EditOutlined />}></Button>,
                    ]}
                  >
                    <List.Item.Meta
                      style={{ display: "flex", alignItems: "center" }}
                      avatar={<>
                        <Tooltip title="ASD">
                          <Avatar shape="square" src={(() => {
                            switch (interaction.type) {
                              case "EMAIL": return EmailInteractionIcon;
                              case "WEBHOOK": return WebHookInteractionIcon;
                            }
                          })()} />
                        </Tooltip>
                      </>}
                      title={interaction.name}
                      description={(() => {
                        const length = 70;
                        if (interaction.description) {
                          if (interaction.description.length > length) {
                            return `${interaction.description.substring(0, length)}...`
                          }
                        }
                        return interaction.description
                      })()}
                    />
                  </List.Item>
                }) : null}
            </List>


          </Form.Item>

        </Form>

        {/* CHILD DRAWER FOR INTERACTION SETUP */}
        <Drawer
          width={700}
          closable={false}
          destroyOnClose={true}
          className="child-drawer-transition-editor"
          getContainer={() => {
            return (document.getElementsByClassName('flow-transition-editor')[0]) as HTMLElement;
          }}
          style={{ position: 'absolute', paddingTop: 0 }}
          visible={child_drawer_open}
        >

          <InteractionSetup
            interaction={child_drawer_data}
            onSetupCompleted={this.onInteractionSetupCompletedHandler}
            onCancel={this.onCloseChildDrawerHandler}
          ></InteractionSetup>
        </Drawer>
      </Drawer>
    </div>
  }
}