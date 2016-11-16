import React from 'react';
import ReactDOM from 'react-dom';
import { Component, PropTypes } from '../../libs';

import Button from '../button';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  getChildContext() {
    return {
      component: this
    };
  }

  componentDidMount() {
    this.initEvent();
  }

  componentWillUpdate(props, state) {
    if (state.visible != this.state.visible) {
      this.refs.dropdown.onVisibleChange(state.visible);
    }
  }

  show() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ visible: true }), 250);
  }

  hide() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ visible: false }), 150);
  }

  handleClick() {
    this.setState({ visible: !this.state.visible });
  }

  initEvent() {
    const { trigger, splitButton } = this.props;
    const triggerElm = ReactDOM.findDOMNode(splitButton ? this.refs.trigger : this.refs.default);

    if (trigger === 'hover') {
      triggerElm.addEventListener('mouseenter', this.show.bind(this));
      triggerElm.addEventListener('mouseleave', this.hide.bind(this));

      let dropdownElm = ReactDOM.findDOMNode(this.refs.dropdown);

      dropdownElm.addEventListener('mouseenter', this.show.bind(this));
      dropdownElm.addEventListener('mouseleave', this.hide.bind(this));
    } else if (trigger === 'click') {
      triggerElm.addEventListener('click', this.handleClick.bind(this));
    }
  }

  handleMenuItemClick(command, instance) {
    this.setState({
      visible: false
    });

    if (this.props.onCommand) {
      this.props.onCommand(command, instance);
    }
  }

  render() {
    const { splitButton, type, size, menu } = this.props;

    return (
      <div className="el-dropdown">
        {
          splitButton ?  (
            <Button.Group>
              <Button type={type} size={size} onClick={this.props.onClick.bind(this)}>
                {this.props.children}
              </Button>
              <Button ref="trigger" type={type} size={size} className="el-dropdown__caret-button">
                <i className="el-dropdown__icon el-icon-caret-bottom"></i>
              </Button>
            </Button.Group>
          ) : React.cloneElement(this.props.children, { ref: 'default' })
        }
        {
          React.cloneElement(menu, {
            ref: 'dropdown'
          })
        }
      </div>
    )
  }
}

Dropdown.childContextTypes = {
  component: PropTypes.any
};

Dropdown.propTypes = {
  trigger: PropTypes.oneOf(['hover', 'click']),
  menuAlign: PropTypes.oneOf(['start', 'end']),
  type: PropTypes.string,
  size: PropTypes.string,
  splitButton: PropTypes.bool,
  menu: PropTypes.node,
  onClick: PropTypes.func,
  onCommand: PropTypes.func
}

Dropdown.defaultProps = {
  trigger: 'hover',
  menuAlign: 'end'
}
