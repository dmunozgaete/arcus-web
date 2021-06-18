import React from 'react';
import { DraggableEvent, DraggableData } from 'react-draggable';
import { Button, Drawer, Input, Form, Radio } from 'antd';
import { GatewayOutlined } from '@ant-design/icons'
import './index.less';
import State from './components/state';
import Transition from './components/transition';

import { IBpmMetadataItem, IBpmMetadataStateItem, IBpmMetadataTransitionItem } from '../../clients/BPMClient';
import i18n from '../../lib/i18n';
import locales from './locales';
const localize = i18n(locales);

interface IProps {
  flow: IBpmMetadataItem[]
}
interface IState {
  new_data: IBpmDOMMetadataItem[],
  drawer_data: {
    open: boolean,
    type: "STATE" | "TRANSITION"
  }
}
export default class BpmEditor extends React.Component<IProps, IState> {
  state: IState = {
    new_data: [],
    drawer_data: {
      open: false,
      type: "STATE"
    }
  }

  constructor(props: IProps) {
    super(props);

    // Cleansing and transform to "DOM" mirror
    const { new_data } = this.state;
    const stateAndIds: { [key: string]: string } = {}
    props.flow.forEach((item) => {
      const id = `${item.type}_${item.name.replaceAll(" ", "_").toLocaleLowerCase()}`;
      stateAndIds[item.name] = id;
      new_data.push({
        ...item,
        elementId: id
      })
    })

    // Now Match all states with his transition's
    new_data.filter(x => x.type === "TRANSITION").forEach((item) => {
      const trx = item as unknown as IBpmMetadataTransitionItem;

      trx.from = stateAndIds[trx.from]
      trx.to = stateAndIds[trx.to]
    })
  }

  onBpmDragStopHandler = async (e: DraggableEvent, data: DraggableData) => {
    this.forceUpdate()
  }

  onBpmDragHandler = async (e: DraggableEvent, data: DraggableData) => {
    this.forceUpdate()
  }

  changeDrawerVisibility = async (isOpen: boolean) => {
    this.setState({
      drawer_data: {
        open: isOpen,
        type: "STATE"
      }
    })
  }

  render() {
    const { new_data, drawer_data } = this.state;

    return <div className='bpm-editor'>
      {/* GET STARTED BUTTON */}
      {new_data.length === 0 ?
        <div className="get-started">
          <Button
            icon={<GatewayOutlined />}
            shape="round"
            size="large"
            onClick={x => this.changeDrawerVisibility(true)}
          >
            {localize("CREATE_MY_FIRST_STATE")}
          </Button>
        </div>
        : null}

      {/* BPM AND STATES */}
      {new_data.map((item) => {
        switch (item.type) {
          case "STATE":
            const state = item as unknown as IBpmMetadataStateItem;
            return <State
              id={item.elementId}
              key={item.elementId}
              name={state.name}
              x={state.x}
              y={state.y}
              onDrag={this.onBpmDragHandler}
            />
          case "TRANSITION":
            const transition = item as unknown as IBpmMetadataTransitionItem;
            return <Transition
              id={item.elementId}
              key={item.elementId}
              name={transition.name}
              from={transition.from}
              to={transition.to}
            />
        }
      })}

      {/* DRAWER */}
      <Drawer
        title="Basic Drawer"
        placement="right"
        maskStyle={{ backgroundColor: "#c4c4c473" }}
        width={500}
        closable={false}
        visible={drawer_data.open}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <div>
          <Form layout="vertical">
            <Form.Item label="Form Layout" name="layout">
              <Radio.Group >
                <Radio.Button value="horizontal">Horizontal</Radio.Button>
                <Radio.Button value="vertical">Vertical</Radio.Button>
                <Radio.Button value="inline">Inline</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Field A">
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item label="Field B">
              <Input placeholder="input placeholder" />
            </Form.Item>
            <Form.Item>
              <Button 
              type="primary"
              onClick={x => this.changeDrawerVisibility(false)}
              >Submit</Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>
    </div>
  }
}

interface IBpmDOMMetadataItem extends IBpmMetadataItem {
  elementId: string
}
