import React from "react";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';
import { IBpmItem } from "../../../clients/BPMClient";
import { RouteComponentProps } from "react-router-dom";
import BpmEditor from "../../../components/bpm-editor";

const localize = i18n(locales);

interface IProps extends RouteComponentProps { }
interface IState {
  form?: IBpmItem
}

export default class BpmCreatePage extends React.Component<IProps, IState> {
  state: IState = {
    form: undefined
  }

  componentDidMount() { }

  render() {
    return <RouterChildPage>
      <Breadcrumb>
        <Breadcrumb.Item>{localize("BPM_BREADCUMB")}</Breadcrumb.Item>
        <Breadcrumb.Item>{localize("BPM_BREADCUMB_PAGE")}</Breadcrumb.Item>
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
          <BpmEditor />
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}