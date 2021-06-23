import React from 'react';
import './index.less';
import { Popover, Radio } from 'antd';
import Draggable, { DraggableEvent, DraggableData } from 'react-draggable';
import Expr from '../../../../lib/Expr';
import i18n from '../../../../lib/i18n';
import locales from './../../locales';
import { IBpmMetadataStateItem } from '../../../../clients/BPMClient';
const localize = i18n(locales);

interface IProps {
  name: string,
  start: boolean,
  end: boolean,
  x: number,
  y: number,
  id: string

  onDragStop?: (e: DraggableEvent, data: DraggableData) => {}
  onDrag?: (e: DraggableEvent, data: DraggableData) => {}
  onDragStart?: (e: DraggableEvent, data: DraggableData) => {}
  onClick?: (elementId: string) => {}
}
interface IState {
  dragging: boolean
}

export default class BpmState extends React.Component<IProps, IState> {
  state: IState = { dragging: false }
  nodeRef = React.createRef<any>()


  static Validate(stateToValidate: IBpmMetadataStateItem): string[] {
    const errors: string[] = []
    return errors;
  }

  constructor(props: IProps) {
    super(props);
  }

  componentDidMount() { }

  onDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { onDrag } = this.props;
    this.setState({ dragging: true })
    Expr.whenTrue(onDrag !== undefined, () => onDrag!(e, data));
  }

  onStopDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { dragging } = this.state
    this.setState({ dragging: false })

    // Check if dragging or clicking
    if (dragging) {
      const { onDragStop } = this.props;
      Expr.whenTrue(onDragStop !== undefined, () => onDragStop!(e, data));
    } else {
      this.onClickHandler();
    }
  }

  onStartDragHandler = (e: DraggableEvent, data: DraggableData): void => {
    const { onDragStart } = this.props;
    Expr.whenTrue(onDragStart !== undefined, () => onDragStart!(e, data));
  }

  onClickHandler = (): void => {
    const { onClick, id } = this.props;
    Expr.whenTrue(onClick !== undefined, () => onClick!(id));
  }


  render() {
    const { x, y, id, name } = this.props;

    return <Draggable
      onStop={this.onStopDragHandler}
      onStart={this.onStartDragHandler}
      onDrag={this.onDragHandler}
    >
      <div
        className='bpm-state-box'
        id={id}
        style={{
          position: "absolute",
          top: y,
          left: x
        }}>
        <div>
          <div>
            {name}
          </div>
        </div>
      </div>
    </Draggable>
  }
}