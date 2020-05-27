import React, { Component } from "react";
import Tag from "./Tag";
import "./TagList.scss";

class TagList extends Component {
  render() {
    const tagComponents = [];
    this.props.tagList&&this.props.tagList.forEach((tag) =>
      tagComponents.push(<Tag key={tag.tagNo} tag={tag} />)
    );
    return (
      <>
        <div key={Date.now()} className="tags">{tagComponents}</div>
      </>
    );
  }
}

export default TagList;
