import React from 'react';
import { DraggableEvent, DraggableData } from 'react-draggable';

import './index.less';
import State from './components/state';
import Transition from './components/transition';
import { IBpmMetadataItem, IBpmMetadataStateItem, IBpmMetadataTransitionItem } from '../../clients/BPMClient';
interface IProps {
  flow: IBpmMetadataItem[]
}
interface IState {
  newData: IBpmMetadataItem[]
}
export default class BpmEditor extends React.Component<IProps, IState> {
  state: IState = {
    newData: []
  }

  componentDidMount() {
    this.setState({
      newData: this.props.flow
    })
  }

  onBpmDragStopHandler = async (e: DraggableEvent, data: DraggableData) => {
    this.forceUpdate()
  }

  onBpmDragHandler = async (e: DraggableEvent, data: DraggableData) => {
    this.forceUpdate()
  }

  render() {
    const { newData } = this.state;

    return <div className='bpm-editor'>
      {newData.map((item) => {
        switch (item.type) {
          case "STATE":
            const state = item as IBpmMetadataStateItem;
            return <State
              name={state.name}
              x={state.x}
              y={state.y}
              onDrag={this.onBpmDragHandler}
            />
          case "TRANSITION":
            const transition = item as IBpmMetadataTransitionItem;
            return <Transition
              name={transition.name}
              from={transition.from}
              to={transition.to}
            />
        }
      })}
    </div>
  }
}