import React from "react"
import Title from "../../images/title.svg"

const TitleOption = ({ title, onChangeTitle }) => (
  <div className="form-group">
    <label htmlFor="title">
      <img src={Title} alt="" className="input-icon" />
      Title
      <input
        type="text"
        className="form-control"
        id="title"
        required
        value={title}
        onChange={onChangeTitle}
        name="title"
      />
    </label>
  </div>
)

export default TitleOption
