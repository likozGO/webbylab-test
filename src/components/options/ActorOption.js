import React from "react"
import Actor from "../../images/actor.svg"
import ModalDelete from "../modals/ModalDelete";

const ActorOption = ({ setInputFields, inputFields }) => {
  const handleAddFields = () => {
    const values = [...inputFields]
    values.push({
      firstName: "",
      lastName: "",
    })
    setInputFields(values)
  }

  const handleRemoveFields = (index) => {
    const values = [...inputFields]
    values.splice(index, 1)
    setInputFields(values)
  }

  const handleInputChange = (index, event) => {
    const values = [...inputFields]
    if (event.target.name === "firstName") {
      values[index].firstName = event.target.value
    } else {
      values[index].lastName = event.target.value
    }

    setInputFields(values)
  }
  return (
    <div className="form-group">
      {/* eslint-disable react/no-array-index-key */}
      {inputFields.map((inputField, index) => (
        <div
          className="form-group form-group__actor"
          key={`${inputField}~${index}`}
        >
          <img src={Actor} alt="" className="input-icon input-icon__actor" />
          Actor
          <div className="form-group form-group__name">
            <label htmlFor={`firstName${index}`}>
              First Name
              <input
                required
                type="text"
                className="form-control"
                id={`firstName${index}`}
                name="firstName"
                value={inputField.firstName}
                onChange={(event) => handleInputChange(index, event)}
              />
            </label>
            <label htmlFor={`lastName${index}`}>
              Last Name
              <input
                required
                type="text"
                className="form-control"
                id={`lastName${index}`}
                name="lastName"
                value={inputField.lastName}
                onChange={(event) => handleInputChange(index, event)}
              />
            </label>
          </div>
        </div>
      ))}
      <div className="form-dynamic">
        <div />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleAddFields()}
        >
          Add&nbsp;Actor&nbsp;+
        </button>
        {inputFields.length > 1 && (
            <ModalDelete
                className="btn btn-danger"
                textBody="Are you sure to delete this actor?"
                btnText="Remove&nbsp;Actor&nbsp;-"
                triggerAction={() => handleRemoveFields(-1)}
            />
        )}
      </div>
    </div>
  )
}

export default ActorOption
