import React from "react"
import { Alert } from "react-bootstrap"

function AlertError({ data, open, setErrEmpty }) {
  return (
    <>
      <Alert show={open} onClose={setErrEmpty} variant="danger" dismissible>
        <Alert.Heading>Something gone wrong</Alert.Heading>
        <p>{data}</p>
      </Alert>
    </>
  )
}

export default AlertError
