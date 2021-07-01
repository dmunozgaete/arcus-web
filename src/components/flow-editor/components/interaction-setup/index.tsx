import React from 'react';
import './index.less';
import i18n from './../../../../lib/i18n';
import locales from './../../locales';
import { Carousel, List, Avatar, PageHeader } from 'antd'
import { RightOutlined } from '@ant-design/icons'

import WebHookInteractionIcon from './../../../../assets/media/interactions/webhook.png'
import EmailInteractionIcon from './../../../../assets/media/interactions/email.png'
import WebhookEditor from './webhook-editor';
import { CarouselRef } from 'antd/lib/carousel';
import { ITransitionInteraction, IWebhookInteraction } from '../../../../clients/FlowClient';

const localize = i18n(locales);

interface IProps {
  onSetupCompleted: () => void;
  onCancel: () => void;
  interaction?: ITransitionInteraction
}
interface IState {
  step: "INTERACTION_LIST" | "INTERACTION_EDITOR"
  interaction_type?: interactionType,
  newInteraction?: ITransitionInteraction
}

type interactionType = "WEBHOOK" | "EMAIL"

export default class InteractionSetup extends React.Component<IProps, IState> {
  carouselRef: React.RefObject<CarouselRef> = React.createRef<CarouselRef>();
  state: IState = {
    interaction_type: undefined,
    newInteraction: this.props.interaction ? Object.assign({}, this.props.interaction) : undefined
  }

  onCloseChildDrawerHandler = async () => {
    const { onSetupCompleted } = this.props
    onSetupCompleted();
  }

  onGoBackToInteractionSelectionHandler = async () => {
    const ref = this.carouselRef;
    this.setState({
      interaction_type: undefined,
      newInteraction: undefined
    });
    if (ref && ref.current) {
      ref.current?.goTo(0);
    }
  }

  onCancelInteractionHandler = async () => {
    const { onCancel } = this.props
    onCancel();
  }

  onSelectInteractionTypeHandler = async (type: interactionType) => {
    const ref = this.carouselRef;
    this.setState({
      interaction_type: type,
      newInteraction: undefined
    });
    if (ref && ref.current) {
      ref.current?.goTo(1);
    }
  }

  render() {
    let { interaction_type, newInteraction } = this.state;
    let initialSlide = 0;
    if (newInteraction) {
      initialSlide = 1;
      interaction_type = newInteraction.type;
    }

    return <div className="flow-interaction-editor">
      <Carousel style={{ height: "100%" }} initialSlide={initialSlide} dots={false} ref={this.carouselRef}>
        <div className="interaction-page available-interactions">
          <PageHeader
            onBack={this.onCloseChildDrawerHandler}
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
        </div>
        <div className="interaction-page setup-interaction">
          {(() => {
            switch (interaction_type) {
              case "WEBHOOK": return <WebhookEditor
                data={newInteraction as IWebhookInteraction}
                onCancel={this.onCancelInteractionHandler}
                onBack={this.onGoBackToInteractionSelectionHandler}
                onSetupCompleted={this.onCloseChildDrawerHandler}
              />
              case "EMAIL": return <div>TODO</div>
            }
          })()}
        </div>
      </Carousel>

    </div>
  }
}