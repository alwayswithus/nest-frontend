import React, { Component } from "react";
import Tag from "./Tag";
import "./TagList.scss";

class TagList extends Component {
  render() {
    const tagComponents = [];
    this.props.tagList.forEach((t) => tagComponents.push(<Tag tag={t} />));
    return (
      <>
        <div className="tag">{tagComponents}</div>
      </>
    );
  }
}

export default TagList;
