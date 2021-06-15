import React from 'react';
import './index.scss';

interface IProps {}
interface IState {}

export default class ChildPage extends React.Component<IProps, IState> {
  render() {
    return <div>{this.props.children}</div>
  }
}