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
import BpmToolbox, { TOOLBOX_OPTIONS, TOOLBOX_OPTIONS_TYPE } from './components/toolbox';
const localize = i18n(locales);

interface IProps { flow: IBpmMetadataItem[] }
interface IState {
  new_data: IBpmMetadataItem[],
  drawer_is_open: boolean,
  drawer_data?: IBpmMetadataItem,
  drawer_errors: string[]
}

const elementIdForEdition = "hooked_element_id_for_edition";
const nameToId = (item: IBpmMetadataItem): string => {
  return `${item.type}|${item.name}`.replaceAll(" ", "_").toLocaleLowerCase();
}

export default class BpmEditor extends React.Component<IProps, IState> {
  containerRef = React.createRef<HTMLDivElement>();
  state: IState = {
    new_data: [],
    drawer_errors: [],
    drawer_is_open: false,
    drawer_data: undefined
  }

  constructor(props: IProps) {
    super(props);

    // Cleansing and transform to "DOM" mirror
    const { new_data } = this.state;
    const stateAndIds: { [key: string]: string } = {}
    props.flow.forEach((item) => {
      const id = nameToId(item);
      stateAndIds[item.name] = id;
      new_data.push({
        ...item
      })
    })

    // Now Match all states with his transition's
    new_data.filter(x => x.type === "TRANSITION").forEach((item) => {
      const trx = item as IBpmMetadataTransitionItem;

      trx.from = stateAndIds[trx.from]
      trx.to = stateAndIds[trx.to]
    })
  }

  getEditingItem = (): IBpmMetadataItem => {
    const { new_data } = this.state;
    const finded = new_data.find(e => e.elementId === elementIdForEdition);
    return finded!;
  }

  onBpmDragStopHandler = async (e: DraggableEvent, data: DraggableData) => {

    this.forceUpdate()
  }

  onBpmStateClickHandler = async (elementIdToEdit: string) => {

    const { new_data } = this.state;
    const finded = new_data.find(e => e.elementId === elementIdToEdit);
    finded!.elementId = elementIdForEdition;

    this.setState({
      new_data,
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

  onCloseDrawerHandler = async () => {
    const { new_data } = this.state;

    // STEP 1: Check first if we can close the drawer validating the "item"
    const editingItem: IBpmMetadataItem = this.getEditingItem();
    const errors: string[] = (() => {
      switch (editingItem.type) {
        case "STATE": return State.Validate(editingItem as IBpmMetadataStateItem);
        case "TRANSITION": return State.Validate(editingItem as IBpmMetadataStateItem);
        default: return [];
      }
    })();

    if (errors.length > 0) {
      // Cancel the closing, and show the errors
      this.setState({
        drawer_errors: errors
      })
      return;
    }

    // STEP 2: Change the id for the state to the final "name"
    editingItem.elementId = nameToId(editingItem);

    this.setState({
      new_data,
      drawer_data: undefined,
      drawer_is_open: false
    })
  }

  onAddNewStateHandler = (isStart?: boolean, xPos?: number, yPos?: number): void => {
    const { new_data } = this.state;
    const counter = new_data.filter(a => a.type == "STATE").length + 1;
    const x = this.containerRef.current ? this.containerRef.current.clientWidth / 2 - 70 : 70;
    const newState: IBpmMetadataStateItem = {
      elementId: elementIdForEdition,
      type: "STATE",
      name: `State ${counter}`,
      isEnd: false,
      isStart: isStart || false,
      description: "",
      editor_data: {
        x: xPos || x,
        y: yPos || 20
      }
    };
    new_data.push(newState);

    this.setState({
      new_data,
      drawer_is_open: true,
      drawer_data: newState,
      drawer_errors: []
    });

  }

  onFormEditItemHandler = async (name: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { new_data } = this.state;
    const editingItem = this.getEditingItem();

    (editingItem! as any)[name] = e.target.value;
    this.setState({
      new_data
    })
  }

  onToolBoxClickHandler = async (action: TOOLBOX_OPTIONS) => {
    console.log(action);
    switch (action) {
      case TOOLBOX_OPTIONS.ADD_NEW_STATE:
        this.onAddNewStateHandler(false, 100, 100);
        break
      case TOOLBOX_OPTIONS.ADD_NEW_CONNECTION:
        break
    }
  }

  render() {
    const { new_data, drawer_is_open, drawer_data, drawer_errors } = this.state;

    return <div className='bpm-editor' ref={this.containerRef}>

      {new_data.length > 0 ?
        <BpmToolbox
          x={10}
          y={10}
          onToolBoxClick={this.onToolBoxClickHandler}
        /> : null
      }

      {/* GET STARTED BUTTON */}
      {new_data.length === 0 ?
        <div className="get-started">
          <Button
            icon={<GatewayOutlined />}
            shape="round"
            size="large"
            onClick={e => this.onAddNewStateHandler(true, undefined, 20)}
          >
            {localize("CREATE_MY_FIRST_STATE")}
          </Button>
        </div>
        : null}

      {/* BPM AND STATES */}
      {new_data.map((item: IBpmMetadataItem) => {
        switch (item.type) {
          case "STATE":
            const state = item as IBpmMetadataStateItem;
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
            const transition = item as IBpmMetadataTransitionItem;
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
        onClose={x => this.onCloseDrawerHandler()}
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

                    <Form.ErrorList errors={drawer_errors}></Form.ErrorList>
                  </Form>
                </>
            }
          })() : undefined}
        </div>
      </Drawer>
    </div>
  }
}
