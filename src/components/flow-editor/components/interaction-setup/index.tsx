import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { List, Avatar, PageHeader } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import WebHookInteractionIcon from './../../../../assets/media/interactions/webhook.png'
import EmailInteractionIcon from './../../../../assets/media/interactions/email.png'
import WebhookEditor from './webhook-editor';
import { ITransitionInteraction, IWebhookInteraction } from '../../../../clients/FlowClient';

const localize = i18n(locales);

interface IProps {
  onSetupCompleted: (interaction: ITransitionInteraction | undefined, newInteraction: ITransitionInteraction) => void;
  onCancel: () => void;
  interaction?: ITransitionInteraction
}
interface IState {
  current_step: "INTERACTION_LIST" | "INTERACTION_EDITOR"
  interaction_type?: interactionType,
  newInteraction?: ITransitionInteraction
}

type interactionType = "WEBHOOK" | "EMAIL"

export default class InteractionSetup extends React.Component<IProps, IState> {
  state: IState = {
    current_step: "INTERACTION_LIST",
    interaction_type: undefined,
    newInteraction: this.props.interaction ? Object.assign({}, this.props.interaction) : undefined
  }

  constructor(props: IProps) {
    super(props);

    if (props.interaction) {
      this.state.current_step = "INTERACTION_EDITOR";
      this.state.interaction_type = props.interaction.type;
    }
  }


  onSetupInteractionCompletedHandler = async (interaction: ITransitionInteraction | undefined, newInteraction: ITransitionInteraction) => {
    const { onSetupCompleted } = this.props;
    onSetupCompleted(interaction, newInteraction!);
  }

  onGoBackToInteractionSelectionHandler = async () => {
    this.setState({
      current_step: "INTERACTION_LIST",
      interaction_type: undefined,
      newInteraction: undefined
    });
  }

  onCancelInteractionHandler = async () => {
    const { onCancel } = this.props
    onCancel();
  }

  onSelectInteractionTypeHandler = async (type: interactionType) => {
    this.setState({
      current_step: "INTERACTION_EDITOR",
      interaction_type: type,
      newInteraction: undefined
    });
  }

  render() {
    const { current_step } = this.state;
    return <div className={`flow-interaction-setup ${current_step.replace(/_/ig, '-').toLowerCase()}`}>
      {(() => {
        const customRender: Function = (this as any)[`render${current_step}`];
        if (!customRender) {
          return <div>{current_step}</div>;
        }
        return customRender();
      })()}
    </div>
  }

  renderINTERACTION_LIST = () => {
    return <>
      <PageHeader
        onBack={this.onCancelInteractionHandler}
        title={localize('INTERACTION_AVAILABLES_TITLE')}
        subTitle={localize('INTERACTION_AVAILABLES_SUBTITLE')}
      />

      <List itemLayout="horizontal">
        <List.Item key="WEBHOOK" actions={[<RightOutlined />]} onClick={() => this.onSelectInteractionTypeHandler("WEBHOOK")}>
          <List.Item.Meta
            avatar={<Avatar shape="square" src={WebHookInteractionIcon} />}
            title={localize("INTERACTION_WEBHOOK_TITLE")}
            description={localize("INTERACTION_WEBHOOK_DESCRIPTION")}
          />
        </List.Item>
        <List.Item key="EMAIL" actions={[<RightOutlined />]} onClick={() => this.onSelectInteractionTypeHandler("EMAIL")}>
          <List.Item.Meta
            avatar={<Avatar shape="square" src={EmailInteractionIcon} />}
            title={localize("INTERACTION_EMAIL_TITLE")}
            description={localize("INTERACTION_EMAIL_DESCRIPTION")}
          />
        </List.Item>
      </List>


    </>
  }

  renderINTERACTION_EDITOR = () => {
    let { interaction_type, newInteraction } = this.state;
    switch (interaction_type) {
      case "WEBHOOK": return <WebhookEditor
        webhook={newInteraction as IWebhookInteraction}
        onCancel={this.onCancelInteractionHandler}
        onBack={this.onGoBackToInteractionSelectionHandler}
        onSetupCompleted={this.onSetupInteractionCompletedHandler}
      />
      case "EMAIL": return <div>TODO</div>
    }
  }
}