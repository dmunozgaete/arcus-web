import React from 'react';
import { DraggableEvent, DraggableData } from 'react-draggable';
import Xarrow from "react-xarrows";
import './index.less';
import BpmState from './components/state';


interface IProps { }
interface IState { }

export default class BpmEditor extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() { }

  onBpmDragStopHandler = async (e: DraggableEvent, data: DraggableData) => {
    console.log(e, data);
    this.forceUpdate()
  }

  onBpmDragHandler = async (e: DraggableEvent, data: DraggableData) => {
    console.log(e, data);
    this.forceUpdate()
  }



  render() {
    return <div className='bpm-editor'>

      <BpmState name="Estado_1" x={50} y={420} onDrag={this.onBpmDragHandler}></BpmState>
      <BpmState name="Estado_2" x={250} y={420} onDrag={this.onBpmDragHandler}></BpmState>
      <BpmState name="Estado_3" x={250} y={250} onDrag={this.onBpmDragHandler}></BpmState>
      <BpmState name="Estado_4" x={250} y={600} onDrag={this.onBpmDragHandler}></BpmState>
      <BpmState name="Estado_5" x={480} y={420} onDrag={this.onBpmDragHandler}></BpmState>
      <Xarrow
        start="Estado_1" //can be react ref
        end="Estado_2" //or an id
      />
      <Xarrow
        start="Estado_1" //can be react ref
        end="Estado_3" //or an id
      />
      <Xarrow
        start="Estado_1" //can be react ref
        end="Estado_4" //or an id
      />

      <Xarrow
        start="Estado_2" //can be react ref
        end="Estado_5" //or an id
      />

      <Xarrow
        start="Estado_3" //can be react ref
        end="Estado_5" //or an id
      />

      <Xarrow
        start="Estado_4" //can be react ref
        end="Estado_5" //or an id
      />

    </div>
  }
}