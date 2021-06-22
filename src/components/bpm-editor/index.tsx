import React from 'react';
import { DraggableEvent, DraggableData } from 'react-draggable';
import { v4 as uuidv4 } from 'uuid';
import { Button, Drawer, Input, Form, PageHeader } from 'antd';
import { GatewayOutlined } from '@ant-design/icons'
import './index.less';
import State from './components/state';
import Transition from './components/transition';

import { IBpmMetadataItem, IBpmMetadataStateItem, IBpmMetadataTransitionItem } from '../../clients/BPMClient';
import i18n from '../../lib/i18n';
import locales from './locales';
const localize = i18n(locales);

interface IProps { flow: IBpmMetadataItem[] }
interface IState {
  new_data: IBpmMetadataItem[],
  drawer_is_open: boolean,
  drawer_data?: IBpmMetadataItem
}

const elementIdForEdition = "hooked_element_id_for_edition";
const nameToId = (name: string): string => {
  return name.replaceAll(" ", "_").toLocaleLowerCase();
}

export default class BpmEditor extends React.Component<IProps, IState> {
  containerRef = React.createRef<HTMLDivElement>();
  state: IState = {
    new_data: [],
    drawer_is_open: false,
    drawer_data: undefined
  }

  constructor(props: IProps) {
    super(props);

    // Cleansing and transform to "DOM" mirror
    const { new_data } = this.state;
    const stateAndIds: { [key: string]: string } = {}
    props.flow.forEach((item) => {
      const id = nameToId(`${item.type}_${item.name}`);
      stateAndIds[item.name] = id;
      new_data.push({
        ...item
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

  onBpmStateClickHandler = async (elementIdForEdition: string) => {
    const { new_data } = this.state;
    const finded = new_data.find(e => e.elementId === elementIdForEdition);

    this.setState({
      drawer_is_open: true,
      drawer_data: finded
    });
  }

  onBpmTransitionClickHandler = async (data: IBpmMetadataTransitionItem) => {
    console.log(data);
  }

  onBpmDragHandler = async (e: DraggableEvent, data: DraggableData) => {
    this.forceUpdate()
  }

  changeDrawerVisibility = async (isOpen: boolean) => {
    this.setState({
      drawer_is_open: isOpen
    })
  }

  onAddNewStateHandler = (): void => {
    const { new_data } = this.state;
    const x = this.containerRef.current ? this.containerRef.current.clientWidth / 2 - 70 : 70;
    const newState: IBpmMetadataStateItem = {
      elementId: elementIdForEdition,
      type: "STATE",
      name: "State X",
      isEnd: false,
      isStart: false,
      description: "",
      editor_data: {
        x: x,
        y: 20
      }
    };
    new_data.push(newState);

    this.setState({
      new_data,
      drawer_is_open: true,
      drawer_data: newState
    });

  }

  onFormEditItemHandler = async (name: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { new_data } = this.state;
    const finded = new_data.find(e => e.elementId === elementIdForEdition);

    (finded! as any)[name] = e.target.value;
    this.setState({
      new_data
    })
  }

  render() {
    const { new_data, drawer_is_open, drawer_data } = this.state;

    return <div className='bpm-editor' ref={this.containerRef}>
      {/* GET STARTED BUTTON */}
      {new_data.length === 0 ?
        <div className="get-started">
          <Button
            icon={<GatewayOutlined />}
            shape="round"
            size="large"
            onClick={this.onAddNewStateHandler}
          >
            {localize("CREATE_MY_FIRST_STATE")}
          </Button>
        </div>
        : null}

      {/* BPM AND STATES */}
      {new_data.map((item: IBpmMetadataItem) => {
        switch (item.type) {
          case "STATE":
            const state = item as unknown as IBpmMetadataStateItem;
            return <State
              name={state.name}
              start={state.isStart}
              end={state.isEnd}
              id={state.elementId}
              key={state.elementId}
              x={state.editor_data.x}
              y={state.editor_data.y}
              onDrag={this.onBpmDragHandler}
              onClick={this.onBpmStateClickHandler}
            />
          case "TRANSITION":
            const transition = item as unknown as IBpmMetadataTransitionItem;
            return <Transition
              id={transition.elementId}
              key={uuidv4()}
              name={transition.name}
              from={transition.from}
              to={transition.to}
              onClick={this.onBpmTransitionClickHandler}
            />
        }
      })}

      {/* DRAWER */}
      <Drawer
        placement="right"
        maskStyle={{ backgroundColor: "#c4c4c473" }}
        width={350}
        closable={true}
        onClose={x => this.changeDrawerVisibility(false)}
        visible={drawer_is_open}
        getContainer={false}
        style={{ position: 'absolute' }}
      >
        <div>
          {drawer_data !== undefined ? (() => {
            const resource = drawer_data!;

            switch (resource.type) {
              case "TRANSITION":
                const transition = resource as IBpmMetadataTransitionItem;
                return <div>dqsdad</div>
              case "STATE":
                const state = resource as IBpmMetadataStateItem;
                return <>
                  <PageHeader
                    title={localize("STATE_DRAWER_TITLE")}
                    style={{ paddingLeft: "0px" }}
                  />
                  <Form layout="vertical">
                    <Form.Item
                      label={`${localize("STATE_NAME_LABEL")}:`}
                    >
                      <Input
                        placeholder={localize("STATE_NAME_PLACEHOLDER")}
                        value={state.name}
                        onChange={(e) => this.onFormEditItemHandler('name', e)}
                      />
                    </Form.Item>
                    <Form.Item label={`${localize("STATE_DESCRIPTION_LABEL")}:`}>
                      <Input.TextArea
                        placeholder={localize("STATE_DESCRIPTION_PLACEHOLDER")}
                        value={state.description}
                        autoSize={{ minRows: 4, maxRows: 8 }}
                        onChange={(e) => this.onFormEditItemHandler('description', e)}
                      />
                    </Form.Item>
                  </Form>
                </>
            }
          })() : undefined}
        </div>
      </Drawer>
    </div>
  }
}
/*
export type BpmResource =
  | { type: "STATE"; item: IBpmMetadataStateItem }
  | { type: "TRANSITION"; item: IBpmMetadataTransitionItem }
*/