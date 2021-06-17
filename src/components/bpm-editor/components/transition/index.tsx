import React from 'react';
import './index.less';
import Xarrow from 'react-xarrows';

interface IProps {
  from: string,
  to: string,
  name: string
}
interface IState { }

export default class BpmTransition extends React.Component<IProps, IState> {
  state: IState = {}

  componentDidMount() { }

  render() {
    const { from, to } = this.props;
    return <Xarrow
      start={from}
      end={to}
    />
  }
}