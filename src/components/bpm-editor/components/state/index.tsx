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
}

export default class BpmState extends React.Component<IProps, IState> {
  state: IState = {}
  nodeRef = React.createRef<any>()

  constructor(props: IProps) {
    super(props);
  }
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
        onClick={this.onClickHandler}
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

          <Popover placement="bottom" className="" content={(
            <div onClick={(e) => e.stopPropagation()}>
              <Radio.Group>
                <Radio.Button>
                  {localize("ADD_STATE_BUTTON_LABEL")}
                </Radio.Button>
                <Radio.Button>
                  {localize("ADD_TRANSITION_BUTTON_LABEL")}
                </Radio.Button>
                <Radio.Button>
                  {localize("REMOVE_STATE_BUTTON_LABEL")}
                </Radio.Button>
              </Radio.Group>
            </div>
          )}>
            <div onClick={(e) => e.stopPropagation()}>
              {/* Action Popover Trigger */}
            </div>
          </Popover>
        </div>
      </div>
    </Draggable>
  }
}