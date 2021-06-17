import React from 'react';
import './index.less';
//import Xarrow from 'react-xarrows';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import Expr from '../../../../lib/Expr';

interface IProps {
  name: string
  x: number,
  y: number

  onDragStop?: (e: DraggableEvent, data: DraggableData) => {}
  onDrag?: (e: DraggableEvent, data: DraggableData) => {}
  onDragStart?: (e: DraggableEvent, data: DraggableData) => {}
}
interface IState { }

export default class BpmState extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() { }

  onDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { onDrag } = this.props;
    Expr.whenTrue(onDrag !== undefined, () => onDrag!(e, data));
  }

  onStopDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { onDragStop } = this.props;
    Expr.whenTrue(onDragStop !== undefined, () => onDragStop!(e, data));
  }

  onStartDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { onDragStart } = this.props;
    Expr.whenTrue(onDragStart !== undefined, () => onDragStart!(e, data));
  }

  render() {
    const { x, y } = this.props;
    return <Draggable
      onStop={this.onStopDragHandler}
      onStart={this.onStartDragHandler}
      onDrag={this.onDragHandler}
    >
      <div className='bpm-state-box' id={this.props.name} style={{
        position: "absolute",
        top: x,
        left: y
      }}>
        {this.props.name}
      </div>
    </Draggable>
  }
}