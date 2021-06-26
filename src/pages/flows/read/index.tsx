import React from "react";
import moment from "moment";
import './index.less';
import RouterChildPage from "../../../components/router-child-page";
import i18n from '../../../lib/i18n';
import locales from './locales';
import { Breadcrumb, PageHeader, Button, Table, Space } from 'antd';
import { PartitionOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import FlowClient, { IFlow } from "../../../clients/FlowClient";
import { IArrayRestResponse } from "../../../clients/RESTClient";
import { RouteComponentProps } from "react-router-dom";

const localize = i18n(locales);

interface IProps extends RouteComponentProps { }
interface IState {
  datasource?: IArrayRestResponse<IFlow>
}
export default class FlowReadPage extends React.Component<IProps, IState> {
  state: IState = {
    datasource: undefined
  }

  componentDidMount() {
    this.getAll(0, 10);
  }

  getAll = async (offset: number, limit: number) => {
    const datasource = await FlowClient.getAll(offset, limit);
    this.setState({
      datasource
    })
  }

  onPrimaryButtonClickHandler = async () => {
    this.props.history.push("/flows/create")
  }

  render() {
    const { datasource } = this.state;
    const EditClickHandler = async (data: IFlow) => {
      this.props.history.push(`/flows/update/${data.id}`);
    }
    const columns = [
      {
        title: localize('TABLE_NAME'),
        dataIndex: 'name',
        key: 'name'
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
          return moment(date).fromNow();
        }
      },
      {
        title: '',
        key: 'action',
        render: (data: IFlow) => {
          return <Space size="middle">
            <Button onClick={() => EditClickHandler(data)} shape="round" icon={<EditOutlined />}>
              {localize("TABLE_EDIT_BUTTON")}
            </Button>
          </Space>
        },
      },
    ];

    return <RouterChildPage className="flow-read-page">
      <Breadcrumb>
        <Breadcrumb.Item>{localize("FLOW_BREADCUMB")}</Breadcrumb.Item>
        <Breadcrumb.Item>{localize("FLOW_BREADCUMB_PAGE")}</Breadcrumb.Item>
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
          <Table
            loading={datasource ? false : true}
            sticky={true}
            rowKey="id"
            size="middle"
            columns={columns}
            dataSource={datasource ? datasource.data : []}
          />
        </RouterChildPage.FrameBody>

      </RouterChildPage.Frame>
    </RouterChildPage>
  }
}