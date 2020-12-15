import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Dropdown, DropdownButton } from "react-bootstrap"
import FilmDataService from "../services/film.service"
import ChooseFilm from "../images/choose-film.svg"
import AddFilm from "../images/add-film.svg"
import TryAgain from "../images/no-items.gif"
import Search from "../images/search.svg"
import Film from "../images/film.svg"
import Preloader from "../images/preloader.gif"

import Year from "../images/year.svg"
import Title from "../images/title.svg"
import Actor from "../images/actor.svg"
import StatusPending from "../images/pending.svg"
import StatusPublished from "../images/published.svg"

import Vhs from "../images/vhs.svg"
import BluRay from "../images/bluray.svg"
import Dvd from "../images/dvd.svg"

import SendIcon from "../images/send.svg"
import UploadIcon from "../images/upload.svg"
import SortIcon from "../images/sort.svg"
import ResetSortIcon from "../images/reset-sort.svg"
import AlertError from "./alerts/AlertError"
import ModalDelete from "./modals/ModalDelete";

export default function FilmsList() {
  const [file, setFile] = useState("")
  const [err, setErr] = useState(false)
  const [errData, setErrData] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchBy, setSearchBy] = useState("Title")
  const [unSorted, setUnSorted] = useState([])
  const [films, setFilms] = useState([])
  const [sorted, setSorted] = useState(false)
  const [currentFilm, setCurrentFilm] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [serchQuery, setSerchQuery] = useState(null)
  const [searched, setSearched] = useState(false)
  const hiddenFileInput = React.useRef(null)

  const formatExpression = {
    vhs: Vhs,
    "blu-ray": BluRay,
    dvd: Dvd,
  }

  const onChangeSerchQuery = (e) => {
    setSerchQuery(e.target.value)
  }

  const retrieveFilms = () => {
    setLoading(true)
    FilmDataService.getAll()
      .then((response) => {
        setUnSorted(() => response.data)
        setFilms(() => response.data)
        setLoading(false)
      })
      .catch((e) => {
        console.log(e)
        setLoading(false)
      })
  }

  const refreshList = () => {
    retrieveFilms()
    setCurrentFilm(null)
    setCurrentIndex(-1)
  }

  const setActiveFilm = (film, index) => {
    setCurrentFilm(film)
    setCurrentIndex(index)
  }

  const removeAllFilms = () => {
    setLoading(true)
    FilmDataService.deleteAll()
      .then(() => {
        refreshList()
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const serchQueryMethod = () => {
    setErrEmpty()
    setSearched(true)
    if (serchQuery !== null && serchQuery.length === 0) {
      setSearched(false)
    } else {
      setSearched(true)
    }
    setCurrentFilm(null)
    setCurrentIndex(-1)
    setLoading(true)
    if (searchBy === "Title") {
      FilmDataService.findByTitle(serchQuery)
        .then((response) => {
          setFilms(response.data)
          setLoading(false)
        })
        .catch((e) => {
          console.log(e)
          setLoading(false)
        })
    } else {
      FilmDataService.findByStar(serchQuery)
        .then((response) => {
          setFilms(response.data)
          setLoading(false)
        })
        .catch((e) => {
          setErr(true)
          setErrData(e.response.data.message)
          setLoading(false)
        })
    }
  }

  const resetFilter = () => {
    setSearched(false)
    setCurrentFilm(null)
    setSerchQuery("")
    setCurrentIndex(-1)
    setUnSorted([])
    setSorted(false)
    retrieveFilms()
  }

  useEffect(() => {
    retrieveFilms()
  }, [])

  const sortReset = () => {
    setSearched(false)
    setCurrentFilm(null)
    setSerchQuery("")
    setCurrentIndex(-1)
    setFilms(unSorted)
    setSorted(false)
  }

  const sortMethod = () => {
    const tempArray = new Array(...films)
    setFilms(tempArray.sort((a, b) => a.title.localeCompare(b.title)))
    setSorted(true)
  }

  const uploadFile = (e) => {
    setFile(e.target.files[0])
  }
  const handleClick = () => {
    hiddenFileInput.current.click()
  }

  const sendFile = () => {
    setErrEmpty()
    const formData = new FormData()
    formData.append("upload", file)
    FilmDataService.upload(formData)
      .then(() => {
        FilmDataService.getAll().then((response) => {
          setUnSorted(() => response.data)
          setFilms(response.data);
        })
      })
      .catch((e) => {
        setErr(true)
        setErrData(e.response.message)
        FilmDataService.getAll().then((response) => setFilms(response.data))
      })
    hiddenFileInput.current.value = ""
    setFile("")
  }

  const setErrEmpty = () => {
    setErr(false)
    setErrData("")
  }

  const parsedDate = (DateValue) =>
    new Date(Date.parse(DateValue)).toDateString()

  const expressionPublish = (tempPublish) =>
    !tempPublish ? "Pending" : "Published"


  return (
    <div className="list row">
      {err && <AlertError className="col-md-12" data={errData} setErrEmpty={setErrEmpty} />}
      <div className="col-md-12">
        <div className="input-group mb-3">
          <input
            required
            type="text"
            className="form-control"
            placeholder="Search"
            value={serchQuery}
            onChange={onChangeSerchQuery}
          />
          <DropdownButton id="dropdown-basic-button" title={searchBy}>
            <Dropdown.Item onClick={() => setSearchBy("Title")}>
              Title
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setSearchBy("Actor")}>
              Actor
            </Dropdown.Item>
          </DropdownButton>
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={serchQueryMethod}
            >
              Search
            </button>
            <button
              className="btn btn-outline-danger"
              type="button"
              onClick={resetFilter}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <h4>Films List</h4>
        <div className="upload-group mb-3">
          <div className="upload-container">
            {file && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={sendFile}
              >
                <img src={SendIcon} alt="Send" />
                Send
              </button>
            )}
            <button
              onClick={handleClick}
              type="button"
              className="btn btn-primary"
            >
              <img src={UploadIcon} alt="Upload" />
              {file.name ? file.name : "Upload"}
            </button>
            <input
              name="upload"
              accept=".txt"
              type="file"
              ref={hiddenFileInput}
              onChange={(e) => uploadFile(e)}
            />
          </div>

          {films.length > 0 &&
            (sorted ? (
              <button
                type="button"
                className="btn btn-danger"
                onClick={sortReset}
              >
                <img src={ResetSortIcon} alt="" />
                Reset Sort
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-success"
                onClick={sortMethod}
              >
                <img src={SortIcon} alt="" />
                Sort
              </button>
            ))}
        </div>
        {/* eslint-disable react/no-array-index-key */}
        <ul className="list-group">
          {films &&
            films.map((film, index) => (
              <li
                className={`list-group-item ${
                  index === currentIndex ? "active" : ""
                }`}
                onClick={() => setActiveFilm(film, index)}
                key={index}
              >
                <img src={Film} alt="Film" className="list-group-item-icon" />
                {film.title}
                <div className="group-category">
                  <span className="icon-category icon-category__format">
                    {film.format}
                  </span>
                  <span className="icon-category icon-category__published">
                    {expressionPublish(film.published)}
                  </span>
                </div>
              </li>
            ))}
        </ul>
        {films.length > 0 && (
            <ModalDelete
                textBody="Are you sure to delete delete all movies?"
                btnText="Remove all"
                triggerAction={removeAllFilms}
            />
        )}
      </div>
      <div className="col-md-6">
        {currentFilm ? (
          <div className="list-film">
            <h4>Film</h4>
            <ListCategory
              title="Title"
              image={Title}
              elem={currentFilm.title}
            />
            <ListCategory
              title="Release Year"
              image={Year}
              elem={currentFilm.release && parsedDate(currentFilm.release)}
            />
            <ListCategory
              title="Format"
              image={
                currentFilm.format != null &&
                formatExpression[currentFilm.format.toLowerCase()]
              }
              elem={currentFilm.format}
            />
            <ListCategory
              title="Status"
              image={currentFilm.published ? StatusPublished : StatusPending}
              elem={expressionPublish(currentFilm.published)}
            />

            <ListCategoryActors
              title="Actors"
              image={Actor}
              Elem={() =>
                currentFilm.stars && (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Surname</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentFilm.stars.map((a, key) => (
                        <tr key={key}>
                          <td>{a.firstName}</td>
                          <td>{a.lastName}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              }
            />

            <Link
              to={`/films/${currentFilm.id}`}
              className="badge badge-warning ml-5"
            >
              Edit
            </Link>
          </div>
        ) : (
          <div>
            <br />
            <ActionGroup
              films={films}
              serchQuery={serchQuery}
              searched={searched}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  )
}

const ActionGroup = ({ films, serchQuery, searched, loading }) => {
  if (loading) {
    return (
      <div className="action-group">
        <img src={Preloader} alt="" className="list-icon" />
        Loading...
      </div>
    )
  }
  if (films.length > 0) {
    return (
      <div className="action-group">
        <img src={ChooseFilm} alt="" className="list-icon" />
        Please click on a Film...
      </div>
    )
  }

  if (films.length === 0 && !serchQuery && !searched) {
    return (
      <Link to="/add" className="action-group">
        <img src={AddFilm} alt="" className="list-icon" />
        Please add new Film...
      </Link>
    )
  }

  if (films.length === 0 && serchQuery && searched) {
    return (
      <div className="action-group">
        <img src={TryAgain} alt="" className="list-icon" />
        We dont have this film clear search or try again!
      </div>
    )
  }
  return (
    <div className="action-group">
      <img src={Search} alt="" className="list-icon" />
      Press &#34;Search&#34; when your search query has been entered
    </div>
  )
}

const ListCategory = ({ image, title, elem }) => (
  <div className="list-category">
    {image && <img src={image} alt="Icon" className="input-icon" />}
    <label>
      <strong>{title}:</strong>
    </label>{" "}
    {elem}
  </div>
)

const ListCategoryActors = ({ image, title, Elem }) => (
  <div>
    {image && <img src={image} alt="Icon" className="input-icon" />}
    <label>
      <strong>{title}:</strong>
    </label>{" "}
    <Elem />
  </div>
)
