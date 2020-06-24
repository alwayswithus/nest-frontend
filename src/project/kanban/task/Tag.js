import React, { Component } from "react";
import "./Tag.scss";

class Tag extends Component {
  render() {
    const tagColor = this.props.tag.tagColor;
    const tagStyle = {
      backgroundColor:`${tagColor}`,
      display:'inline-block',
      padding:'2%'
    };

    return (
      <>
        <div className="label label-default tagLabel" style={tagStyle}>{this.props.tag.tagName}</div>&nbsp;
      </>
    );
  }
}

export default Tag;
