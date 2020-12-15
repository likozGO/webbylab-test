import React, {useState} from "react"

import FilmDataService from "../services/film.service"
import AlertError from "./alerts/AlertError"

import RealeaseOption from "./options/RealeseOption"
import FormatOption from "./options/FormatOption"
import TitleOption from "./options/TitleOption"
import ActorOption from "./options/ActorOption"
import hasDublicates from "./methods/hasDublicates";

const AddFilm = () => {
  const [err, setErr] = useState(false)
  const [errData, setErrData] = useState("")
  const [title, setTitle] = useState("")
  const [release, setRelease] = useState(new Date())
  const [stars, setStars] = useState([
    {
      firstName: "",
      lastName: "",
    },
  ])
  const [format, setFormat] = useState("VHS")
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [published, setPublished] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onChangeTitle = (e) => {
    setTitle(e.target.value)
  }

  const onChangeFormat = (e, dropdownSelect) => {
    if (dropdownSelect) {
      setFormat(e.target.textContent)
    } else {
      setFormat(e.target.value)
    }
  }

  const saveFilm = (event) => {
    event.preventDefault()
    setErr(false)
    setErrData("")

    const data = {
      title,
      release,
      stars,
      format,
    }


    if (format.length < 1) {
      setErr(true)
      setErrData("Format is empty")
    } else if (release.length < 1) {
      setErr(true)
      setErrData("Release date is empty")
    } else if (hasDublicates(stars)) {
      setErr(true)
      setErrData("Some stars are duplicate")
    } else {
      FilmDataService.findDuplicates(data)
          .then(response => {
            if (response.data.length > 0) {
              setErr(true)
              setErrData("This film already in film list!")
            } else {
              FilmDataService.create(data)
                  .then((response) => {
                    setId(response.data.id)
                    setRelease(response.data.release)
                    setFormat(response.data.format)
                    setTitle(response.data.title)
                    setPublished(response.data.published)
                    setSubmitted(true)
                    setStars(response.data.stars)
                  })
                  .catch((e) => {
                    setErr(true)
                    setErrData(e.response.data.message)
                  })
            }
          })
          .catch((e) => {
            setErr(true)
            setErrData(e.response.data.message)
          })
    }
  }

  const setErrEmpty = () => {
    setErr(false)
    setErrData("")
  }

  const newFilm = () => {
    setErrEmpty()
    setId(null)
    setTitle("")
    setRelease(new Date())
    setStars([
      {
        firstName: "",
        lastName: "",
      },
    ])
    setFormat("VHS")
    setPublished(false)
    setSubmitted(false)
  }

  return (
      <div className="submit-form">
        {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <button type="button" className="btn btn-success" onClick={newFilm}>
                Add
              </button>
            </div>
        ) : (
            <form onSubmit={saveFilm}>
              <TitleOption onChangeTitle={onChangeTitle} title={title}/>
              <RealeaseOption setRelease={setRelease} release={release}/>
              <FormatOption onChangeFormat={onChangeFormat} format={format}/>
              <ActorOption setInputFields={setStars} inputFields={stars}/>
              <button type="submit" className="btn btn-success">
                Submit
              </button>
              {/* eslint-disable-next-line react/button-has-type */}
              <button
                  type="button"
                  onClick={newFilm}
                  className="btn btn-outline-success ml-4"
              >
                Reset
              </button>
            </form>
        )}
        {err && <AlertError data={errData} setErrEmpty={setErrEmpty}/>}
      </div>
  )
}

export default AddFilm
