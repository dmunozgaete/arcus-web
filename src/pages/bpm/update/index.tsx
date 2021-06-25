import React from "react";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';
import BPMClient, { IBpmFlow } from "../../../clients/BPMClient";
import { RouteComponentProps, Link } from "react-router-dom";
import FlowEditor from "../../../components/flow-editor";

const localize = i18n(locales);

interface IProps extends RouteComponentProps<{ id: string }> { }
interface IState {
  data?: IBpmFlow
}

export default class BpmUpdatePage extends React.Component<IProps, IState> {
  state: IState = {
    data: undefined
  }

  componentDidMount() {
    this.getById(this.props.match.params.id);
  }

  getById = async (id: string) => {
    const data = await BPMClient.getById(id);
    this.setState({
      data
    })
  }

  render() {
    const { data } = this.state;

    return <RouterChildPage className="bpm-update-page">
      <Breadcrumb>
        <Breadcrumb.Item><Link to="/bpm">{localize("BPM_BREADCUMB")}</Link></Breadcrumb.Item>
        <Breadcrumb.Item>{localize("BPM_BREADCUMB_PAGE")}</Breadcrumb.Item>
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