import React, { MouseEvent } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './index.less';
import { IBpmMetadataItem, IBpmMetadataStateItem, IBpmMetadataTransitionItem } from '../../clients/BPMClient';
import i18n from '../../lib/i18n';
import locales from './locales';
import ToolBox, { TOOLBOX_ACTIONS } from './components/toolbox';
import ReactFlow, { removeElements, updateEdge, addEdge, MiniMap, OnLoadParams, Controls, Background, FlowElement, Edge, ReactFlowProvider, ArrowHeadType, Connection, Node } from 'react-flow-renderer';
import Expr from '../../lib/Expr';
import StateEditor from './components/state-editor';
import TransitionEditor from './components/transition-editor';

const localize = i18n(locales);

interface IProps {
  flow: IBpmMetadataItem[]
  onLoad?: (instance: OnLoadParams) => void
}
interface IState {
  elements: FlowElement<IBpmMetadataItem>[],
  drawer_element?: FlowElement<IBpmMetadataItem>
}

export default class FlowEditor extends React.Component<IProps, IState> {
  reactFlowWrapper: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  reactFlowInstance?: OnLoadParams = undefined;
  state: IState = {
    drawer_element: undefined,
    elements: []
  }

  constructor(props: IProps) {
    super(props);

    const nameAndIds: { [key: string]: string } = {};
    const elements: FlowElement<any>[] = props.flow.filter(e => e.type === "STATE").map((elm) => {
      const state = elm as IBpmMetadataStateItem;
      const newId = uuidv4();
      nameAndIds[state.label] = newId;
      return {
        'id': newId,
        'type': (() => {
          if (state.start) { return "input" }
          if (state.end) { return "output" }
          return "default"
        })(),
        'data': state,
        'label': state.label,
        'position': {
          'x': state.editor_data.x,
          'y': state.editor_data.y
        }
      } as FlowElement<IBpmMetadataStateItem>
    });

    props.flow.filter(e => e.type === "TRANSITION").forEach((elm) => {
      const transition = elm as IBpmMetadataTransitionItem;
      elements.push({
        id: uuidv4(),
        "source": nameAndIds[transition.from],
        "target": nameAndIds[transition.to],
        "arrowHeadType": ArrowHeadType.ArrowClosed,
        "type": "default",
        "label": transition.label,
        'data': transition
      } as FlowElement<IBpmMetadataTransitionItem>)
    });

    this.state.elements = elements;
  }

  onToolBoxActionClickHandler = async (action: TOOLBOX_ACTIONS) => {
    const { reactFlowInstance } = this;

    switch (action) {
      case "ADD_NEW_STATE":
        const { elements } = this.state;
        const newMap = elements.map((el) => el);
        const label = `${localize('NEW_STATE_NAME_LABEL')} ${elements.length + 1}`;

        newMap.push({
          'id': uuidv4(),
          'type': elements.length === 0 ? 'input' : 'default',
          'label': label,
          'data': {
            label: label,
            type: "STATE"
          },
          'position': reactFlowInstance!.project({
            x: 100 + (elements.length * 10),
            y: 150 + (elements.length * 10),
          })
        })

        this.setState({ elements: newMap })
        break;
      case "SHOW_INFO":
        console.log(reactFlowInstance!.toObject());
        console.log(JSON.stringify(reactFlowInstance!.toObject()));
        break
    }
  }

  onElementsRemoveHandler = (elementsToRemove: any) => {
    const { elements } = this.state;
    const updatedElements = removeElements(elementsToRemove, elements);
    this.setState({
      elements: updatedElements
    })
  }

  onConnectHandler = (params: Edge | Connection) => {
    const { elements } = this.state;
    const edge = params as Edge

    edge.arrowHeadType = ArrowHeadType.ArrowClosed;
    edge.label = `${localize('NEW_TRANSITION_NAME_LABEL')} ${elements.length + 1}`

    const updatedElements = addEdge(params, elements);
    this.setState({
      elements: updatedElements
    })
  }

  onEdgeUpdateHandler = (oldEdge: Edge, newConnection: Connection) => {
    const { elements } = this.state;
    const updatedElements = updateEdge(oldEdge, newConnection, elements);
    this.setState({
      elements: updatedElements
    })
  }

  onElementClickHandler = (event: MouseEvent, element: Node | Edge) => {
    this.setState({
      drawer_element: element
    })
  }

  onChangeElementHandler = (params: onChangedElementTypes) => {
    const { elements } = this.state;

    switch (params.type) {
      case "STATE": {
        const newMap = elements.map((elm) => {
          if (elm.data === params.old) {
            elm.data = params.modified;

            // Override some "graphical changes ^^
            const ui = (elm as Edge<IBpmMetadataStateItem>);
            ui.label = params.modified.label;
            ui.type = (() => {
              if (params.modified.start) { return "input" }
              if (params.modified.end) { return "output" }
              return "default"
            })()
          }
          return elm;
        });

        this.setState({ elements: newMap })
        break;
      }
      case "TRANSITION": {
        const newMap = elements.map((elm) => {
          if (elm.data === params.old) {
            elm.data = params.modified;

            // Override some "graphical changes ^^
            const ui = (elm as Edge<IBpmMetadataTransitionItem>);
            ui.label = elm.data.label;
          }
          return elm;
        });

        this.setState({ elements: newMap })
        break;
      }
    }
  }

  render() {
    const { drawer_element } = this.state;
    const onLoad = (reactFlowInstance: OnLoadParams) => {
      this.reactFlowInstance = reactFlowInstance;

      const { onLoad } = this.props;
      Expr.whenTrue(onLoad !== undefined, () => onLoad!(reactFlowInstance));
    }

    return <ReactFlowProvider>
      <div className='bpm-editor' ref={this.reactFlowWrapper}>
        <ReactFlow
          elements={this.state.elements}
          onLoad={onLoad}
          onElementsRemove={this.onElementsRemoveHandler}
          onElementClick={this.onElementClickHandler}
          zoomOnDoubleClick={false}
          onEdgeUpdate={this.onEdgeUpdateHandler}
          onConnect={this.onConnectHandler}
          snapToGrid={true}
          snapGrid={[10, 10]}
        >
          <MiniMap style={{ display: "none" }} />
          <Controls />
          <Background color="#aaa" gap={10} />
        </ReactFlow>
        <ToolBox onToolBoxActionClick={this.onToolBoxActionClickHandler} />
        {/* STATE EDITOR */}
        {drawer_element && drawer_element.data?.type === "STATE" ?
          <StateEditor
            state={drawer_element.data as IBpmMetadataStateItem}
            onChange={(old, modified) => this.onChangeElementHandler({ type: "STATE", old, modified })}
            onClose={() => { this.setState({ drawer_element: undefined }) }}
          /> : null}
        {/* TRANSITION EDITOR */}
        {drawer_element && drawer_element.data?.type === "TRANSITION" ?
          <TransitionEditor
            transition={drawer_element.data as IBpmMetadataTransitionItem}
            onChange={(old, modified) => this.onChangeElementHandler({ type: "TRANSITION", old, modified })}
            onClose={() => { this.setState({ drawer_element: undefined }) }}
          /> : null}
      </div>
    </ReactFlowProvider>
  }
}

export type onChangedElementTypes =
  | { type: "STATE", old: IBpmMetadataStateItem, modified: IBpmMetadataStateItem }
  | { type: "TRANSITION", old: IBpmMetadataTransitionItem, modified: IBpmMetadataTransitionItem }
