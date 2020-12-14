import React, { useState } from "react"
import { Button, Dropdown, Modal } from "react-bootstrap"
import Vhs from "../../images/vhs.svg"
import BluRay from "../../images/bluray.svg"
import Dvd from "../../images/dvd.svg"

const FormatOption = ({ format, onChangeFormat }) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  return (
    <>
      <div className="form-group">
        <label htmlFor="format">
          Format
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              {format && format.toLowerCase() === "vhs" && (
                <img src={Vhs} alt="" className="input-icon" />
              )}
              {format && format.toLowerCase() === "blu-ray" && (
                <img src={BluRay} alt="" className="input-icon" />
              )}
              {format && format.toLowerCase() === "dvd" && (
                <img src={Dvd} alt="" className="input-icon" />
              )}
              {format}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={(e) => onChangeFormat(e, true)}>
                <img src={Vhs} alt="" className="input-icon" />
                VHS
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => onChangeFormat(e, true)}>
                <img src={Dvd} alt="" className="input-icon" />
                DVD
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => onChangeFormat(e, true)}>
                <img src={BluRay} alt="" className="input-icon" />
                Blu-Ray
              </Dropdown.Item>
              <Dropdown.Item onClick={(e) => onChangeFormat(e, true)}>
                <Button variant="outline-primary" onClick={handleShow}>
                  {"Your variant" || format}
                </Button>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </label>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            className="form-control"
            id="format"
            required
            value={format}
            onChange={onChangeFormat}
            name="format"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default FormatOption
