import React, { useEffect, useState } from "react"
import { useHistory, useRouteMatch } from "react-router-dom"

import FilmDataService from "../services/film.service"
import RealeaseOption from "./options/RealeseOption"
import FormatOption from "./options/FormatOption"
import TitleOption from "./options/TitleOption"
import AlertError from "./alerts/AlertError"
import AlertSuccess from "./alerts/AlertSuccess"

import StatusPending from "../images/pending.svg"
import StatusPublished from "../images/published.svg"
import ActorOption from "./options/ActorOption"
import ModalDelete from "./modals/ModalDelete";
import hasDublicates from "./methods/hasDublicates";

export default function Film() {
  const [currentFilm, setFilm] = useState({
    id: null,
    title: "",
    release: new Date(),
    format: "",
    stars: [
      {
        firstName: "",
        lastName: "",
      },
    ],
    published: false,
  })
  const [err, setErr] = useState(false)
  const [errData, setErrData] = useState("")
  const [message, setMessage] = useState("")
  const history = useHistory()
  const match = useRouteMatch()

  const onChangeTitle = (e) => {
    const title = e.target.value

    setFilm((prevState) => ({
      ...prevState,
      title,
    }))
  }

  const onChangeRelease = (e) => {
    const release = e

    setFilm((prevState) => ({
      ...prevState,
      release,
    }))
  }

  const onChangeFormat = (e, dropdownSelect) => {
    let format
    if (dropdownSelect) {
      format = e.target.textContent
    } else {
      format = e.target.value
    }

    setFilm((prevState) => ({
      ...prevState,
      format,
    }))
  }

  const onChangeStar = (e) => {
    const stars = e


    setFilm((prevState) => ({
      ...prevState,
      stars,
    }))
  }

  const getFilm = (id) => {
    FilmDataService.get(id)
      .then((response) => {
        setFilm(() => ({
          ...response.data,
        }))
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const setErrEmpty = () => {
    setErr(false)
    setErrData("")
  }

  const updatePublished = (status) => {
    const data = {
      id: currentFilm.id,
      title: currentFilm.title,
      release: currentFilm.release,
      format: currentFilm.format,
      stars: currentFilm.stars,
      published: status,
    }

    FilmDataService.update(currentFilm.id, data)
      .then(() => {
        setFilm((prevState) => ({
          ...prevState,
          published: status,
        }))
      })
      .catch((e) => {
        setErr(true)
        setErrData(e.response.data.message)
      })
  }

  const updateFilm = (event) => {
    event.preventDefault()
    setErrEmpty()

    if (currentFilm.format == null || currentFilm.format.length === 0) {
      setErr(true)
      setErrData("Format is empty")
    } else if (currentFilm.release == null) {
      setErr(true)
      setErrData("Release date is empty")
    }else if (hasDublicates(currentFilm.stars)) {
      setErr(true)
      setErrData("Some stars are duplicate")
    } else {
      FilmDataService.findDuplicates(currentFilm)
          .then(response => {
            if (response.data.length > 0) {
              setErr(true)
              setErrData("This film already in film list!")
            } else {
              FilmDataService.update(currentFilm.id, currentFilm)
                  .then(() => {
                    setMessage("The film was updated successfully!")
                  })
                  .catch((e) => {
                    console.log(e)
                  })
            }
          }).catch((e) => {
              setErr(true)
              setErrData(e.response.data.message)
            })
    }
  }

  const deleteFilm = () => {
    FilmDataService.delete(currentFilm.id)
      .then(() => {
        history.push("/films")
      })
      .catch((e) => {
        console.log(e)
      })
  }

  useEffect(() => {
    getFilm(match.params.id)
  }, [])

  return (
    <form onSubmit={updateFilm}>
      {currentFilm ? (
        <div className="edit-form">
          <h4>Film</h4>
          <div>
            <TitleOption
              onChangeTitle={onChangeTitle}
              title={currentFilm.title}
            />

            <RealeaseOption
              setRelease={onChangeRelease}
              release={currentFilm.release}
            />
            <FormatOption
              onChangeFormat={onChangeFormat}
              format={currentFilm.format}
            />

            <ActorOption
              setInputFields={onChangeStar}
              inputFields={currentFilm.stars}
            />

            <div className="form-group">
              <img
                src={currentFilm.published ? StatusPublished : StatusPending}
                alt=""
                className="input-icon"
              />
              <label>
                <strong>Status:</strong>
              </label>
              {currentFilm.published ? " Published" : " Pending"}
            </div>
          </div>
          {currentFilm.published ? (
            <button
              type="button"
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(false)}
            >
              UnPublish
            </button>
          ) : (
            <button
              type="button"
              className="badge badge-primary mr-2"
              onClick={() => updatePublished(true)}
            >
              Publish
            </button>
          )}
          <ModalDelete
              className="badge badge-danger mr-2"
              textBody="Are you sure to delete this movie?"
              btnText="Delete"
              triggerAction={deleteFilm}
          />
          <button type="submit" className="badge badge-success">
            Update
          </button>
          {err && <AlertError data={errData} setErrEmpty={setErrEmpty} />}
          {message && (
            <AlertSuccess
              data={message}
              open={message.length > 0}
              setSuccessClose={() => setMessage("")}
            />
          )}
        </div>
      ) : (
        <div>
          <br />
          <p>Please click on a Film...</p>
        </div>
      )}
    </form>
  )
}
