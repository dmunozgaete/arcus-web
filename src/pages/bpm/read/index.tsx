import React from "react";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';

const localize = i18n(locales);

interface IProps { }
interface IState { }
export default class BpmReadPage extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() {
  }

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
              Crear Flujo
            </Button>
          </div>
        </RouterChildPage.FrameHeader>

        <RouterChildPage.FrameBody>
          sdasd
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}