import React from "react";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';
import FlowClient, { IFlow } from "../../../clients/FlowClient";
import { RouteComponentProps, Link } from "react-router-dom";
import FlowEditor from "../../../components/flow-editor";

const localize = i18n(locales);

interface IProps extends RouteComponentProps<{ id: string }> { }
interface IState {
  data?: IFlow
}

export default class FlowUpdatePage extends React.Component<IProps, IState> {
  state: IState = {
    data: undefined
  }

  componentDidMount() {
    this.getById(this.props.match.params.id);
  }

  getById = async (id: string) => {
    const data = await FlowClient.getById(id);
    this.setState({
      data
    })
  }

  render() {
    const { data } = this.state;

    return <RouterChildPage className="flow-update-page">
      <Breadcrumb>
        <Breadcrumb.Item><Link to="/flows">{localize("FLOW_BREADCUMB")}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{localize("FLOW_BREADCUMB_PAGE")}</Breadcrumb.Item>
      </Breadcrumb>

      <RouterChildPage.Frame>
        <RouterChildPage.FrameHeader>
          <PageHeader title={data ? data.name : localize('PAGE_TITLE')} subTitle={localize("PAGE_SUBTITLE")}>
            <PartitionOutlined />
          </PageHeader>
          <div className="pad">
            <Button type="primary" size="middle" shape="round" icon={<PlusOutlined />}>
              {localize('PRIMARY_BUTTON_LABEL')}
            </Button>
          </div>
        </RouterChildPage.FrameHeader>

        <RouterChildPage.FrameBody>
          {data ?
            <FlowEditor
              flow={data.meta_data}
              onLoad={(i) => i.fitView()}
            /> :
            <div>LOADING</div>
          }
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}