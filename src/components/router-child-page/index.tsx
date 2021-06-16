import React from 'react';
import './index.less';

interface IProps { }
interface IState { }


class RouterChildFrameHeaderPage extends React.Component<IProps, IState> {
  render() {
    return <div className="frame-header">
      {this.props.children}
    </div>
  }
}

class RouterChildFrameBodyPage extends React.Component<IProps, IState> {
  render() {
    return <div className="frame-body">
      {this.props.children}
    </div>
  }
}

class RouterChildFramePage extends React.Component<IProps, IState> {
  render() {
    return <div className="child-frame">
      {this.props.children}
    </div>
  }
}

export default class RouterChildPage extends React.Component<IProps, IState> {
  render() {
    return <div className="router-child-page">
      {this.props.children}
    </div>
  }
  
  static Frame = RouterChildFramePage;
  static FrameHeader = RouterChildFrameHeaderPage;
  static FrameBody = RouterChildFrameBodyPage;
}
