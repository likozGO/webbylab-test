import React from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Year from "../../images/year.svg"

const RealeaseOption = ({ setRelease, release }) => (
  <div className="form-group">
    <label htmlFor="release">
      <img src={Year} alt="" className="input-icon" />
      Release Year
      <DatePicker
        selected={Date.parse(release)}
        onChange={(date) => setRelease(date)}
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dateFormat="dd.MM.yyyy"
        dropdownMode="select"
        className="form-control"
      />
      <input
        type="hidden"
        className="form-control"
        id="release"
        value={release}
        name="release"
      />
    </label>
  </div>
)

export default RealeaseOption
