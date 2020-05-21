import React, { Component } from "react";
import Tag from "./Tag";
import "./TagList.scss";

class TagList extends Component {
  render() {
    const tagComponents = [];
    this.props.tagList.forEach((t) =>
      tagComponents.push(<Tag key={t.id} tag={t} />)
    );
    return (
      <>
        <div key={Date.now()} className="tags">{tagComponents}</div>
      </>
    );
  }
}

export default TagList;
