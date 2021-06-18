import React from 'react';
import './index.less';
import Xarrow from 'react-xarrows';

interface IProps {
  from: string,
  to: string,
  name: string,
  id: string
}
interface IState { }

export default class BpmTransition extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() { }

  render() {
    const { from, to, id, name } = this.props;
    const color = "black"
    return <div
      className="bpm-transition-line"
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