import React, { Component } from "react";
import "./TagList.scss";

class Tag extends Component {
  render() {
    return (
      <>
        <span class="label label-default">{this.props.tag.name}</span>&nbsp;
      </>
    );
  }
}

export default Tag;
