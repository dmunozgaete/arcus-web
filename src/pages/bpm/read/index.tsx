import React from "react";
import moment from "moment";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button, Table, Space } from 'antd';
import { PartitionOutlined, PlusOutlined } from '@ant-design/icons';
import BPMClient, { IBpmItem } from "../../../clients/BPMClient";
import { IArrayRestResponse } from "../../../clients/RESTClient";
import { RouteComponentProps } from "react-router-dom";

const localize = i18n(locales);

interface IProps extends RouteComponentProps { }
interface IState {
  datasource?: IArrayRestResponse<IBpmItem>
}
export default class BpmReadPage extends React.Component<IProps, IState> {
  state: IState = {
    datasource: undefined
  }

  componentDidMount() {
    this.getAll(0, 10);
  }

  getAll = async (offset: number, limit: number) => {
    const datasource = await BPMClient.getAll(offset, limit);
    this.setState({
      datasource
    })
  }

  onPrimaryButtonClickHandler = async () => {
    this.props.history.push("/bpm/create")
  }

  render() {
    const { datasource } = this.state;
    const columns = [
      {
        title: localize('TABLE_NAME'),
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>,
      },
      {
        title: localize('TABLE_AUTHOR'),
        dataIndex: 'author',
        key: 'author',
      },
      {
        title: localize('TABLE_CREATED_AT'),
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date: Date) => {
          console.log(date);
          return moment(date).fromNow();
        }
      },
      {
        title: '',
        key: 'action',
        render: () => (
          <Space size="middle">
            Delete
          </Space>
        ),
      },
    ];

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
            <Button type="primary" size="middle" shape="round" onClick={this.onPrimaryButtonClickHandler} icon={<PlusOutlined />}>
              {localize('PRIMARY_BUTTON_LABEL')}
            </Button>
          </div>
        </RouterChildPage.FrameHeader>

        <RouterChildPage.FrameBody>
          <Table loading={datasource ? false : true} sticky={true} rowKey="id" size="middle" columns={columns} dataSource={datasource ? datasource.data : []}></Table>
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}