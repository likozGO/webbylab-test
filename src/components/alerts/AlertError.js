import React from "react"
import { Alert } from "react-bootstrap"

function AlertError({ data, open, setErrEmpty, className }) {
  return (
    <>
      <Alert show={open} onClose={setErrEmpty} className={className || ""} variant="danger" dismissible>
        <Alert.Heading>Something gone wrong</Alert.Heading>
        <p>{data}</p>
      </Alert>
    </>
  )
}

export default AlertError
