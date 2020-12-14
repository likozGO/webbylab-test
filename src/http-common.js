import axios from "axios"

export default axios.create({
  // baseURL: location.protocol + '//' + location.hostname + ':' + "5000/api",
  baseURL: '/api',
  headers: {
    "Content-type": "application/json",
  },
})
