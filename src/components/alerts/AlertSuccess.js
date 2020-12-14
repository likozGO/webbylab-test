import React from "react"
import { Alert } from "react-bootstrap"

const AlertSuccess = ({ data, open, setSuccessClose }) => (
  <Alert show={open} onClose={setSuccessClose} variant="success" dismissible>
    <Alert.Heading>Film updated!</Alert.Heading>
    <p>{data}</p>
  </Alert>
)

export default AlertSuccess
