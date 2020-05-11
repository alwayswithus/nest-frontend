import React, { Component } from "react";
import "./Tag.scss";

class Tag extends Component {
  render() {
    const tagColor = "red";
    const tagStyle = {
      backgroundColor:`${tagColor}`
    };

    return (
      <>
        <span class="label label-default" style={tagStyle}>{this.props.tag.name}</span>&nbsp;
      </>
    );
  }
}

export default Tag;
