import React from "react"
import { Switch, Route } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import AddFilm from "./components/AddFilm"
import Film from "./components/Film"
import FilmsList from "./components/FilmList"
import Header from "./components/Header"

const App = () => (
  <div>
    <Header />
    <div className="container mt-3">
      <Switch>
        <Route exact path={["/", "/films"]} component={FilmsList} />
        <Route exact path="/add" component={AddFilm} />
        <Route path="/films/:id" component={Film} />
      </Switch>
    </div>
  </div>
)

export default App
