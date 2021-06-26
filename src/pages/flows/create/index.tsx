import React from "react";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';
import { IFlow } from "../../../clients/FlowClient";
import { RouteComponentProps, Link } from "react-router-dom";
import FlowEditor from "../../../components/flow-editor";


const localize = i18n(locales);

interface IProps extends RouteComponentProps { }
interface IState {
  form?: IFlow
}

export default class FlowCreatePage extends React.Component<IProps, IState> {
  state: IState = {
    form: undefined,
  }

  componentDidMount() { }

  render() {
    return <RouterChildPage className="flow-create-page">
      <Breadcrumb>
        <Breadcrumb.Item><Link to="/flows">{localize("FLOW_BREADCUMB")}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{localize("FLOW_BREADCUMB_PAGE")}</Breadcrumb.Item>
      </Breadcrumb>

      <RouterChildPage.Frame>
        <RouterChildPage.FrameHeader>
          <PageHeader title={localize("PAGE_TITLE")} subTitle={localize("PAGE_SUBTITLE")}>
            <PartitionOutlined />
          </PageHeader>
          <div className="pad">
            <Button type="primary" size="middle" shape="round" icon={<PlusOutlined />}>
              {localize('PRIMARY_BUTTON_LABEL')}
            </Button>
          </div>
        </RouterChildPage.FrameHeader>

        <RouterChildPage.FrameBody>
          <FlowEditor
            flow={[]}
            onLoad={(i) => i.zoomTo(2)}
          />
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}