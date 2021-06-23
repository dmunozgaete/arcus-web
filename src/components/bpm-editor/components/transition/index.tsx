import React from 'react';
import './index.less';
import Xarrow from 'react-xarrows';
import { IBpmMetadataTransitionItem } from '../../../../clients/BPMClient';
import Expr from '../../../../lib/Expr';

interface IProps {
  from: string,
  to: string,
  name: string,
  id: string,

  onClick?: (data: IBpmMetadataTransitionItem) => {}
}
interface IState { }

export default class BpmTransition extends React.Component<IProps, IState> {
  state: IState = {}

  static Validate(stateToValidate: IBpmMetadataTransitionItem): boolean {
    throw new Error('not implemented');
  }

  componentDidMount() { }

  onClickHandler = (): void => {
    const { onClick, from, to, name, id } = this.props;
    Expr.whenTrue(onClick !== undefined, () => onClick!({
      elementId: id,
      type: "TRANSITION",
      from,
      name,
      to,
      roles: []
    }));
  }

  render() {
    const { from, to, id, name } = this.props;
    const color = "black"
    return <div
      className="bpm-transition-line"
      onClick={this.onClickHandler}
      id={id}
    >
      <Xarrow
        lineColor={color}
        headColor={color}
        tailColor={color}
        tailShape={"circle"}
        tailSize={2}
        strokeWidth={2.5}
        showTail={true}
        start={from}
        end={to}
        label={<div className="bpm-transition-line-label">
          {name}
        </div>}
      />
    </div>
  }
}