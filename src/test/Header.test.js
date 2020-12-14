import React from "react"
import { configure, shallow } from "enzyme"
import chai, { expect } from "chai"
import chaiEnzyme from "chai-enzyme"
import Adapter from "enzyme-adapter-react-16"
import { Link } from "react-router-dom"
import Header from "../components/Header"

configure({
  adapter: new Adapter(),
})
describe("Testin <Header/> Component", () => {
  it("App render a Header links", () => {
    const wrapper = shallow(<Header />)
    const add = (
      <Link to="/add" className="nav-link">
        Add
      </Link>
    )
    const films = (
      <Link to="/films" className="nav-link">
        Films
      </Link>
    )
    expect(wrapper).to.contain(add)
    expect(wrapper).to.contain(films)
  })
  chai.use(chaiEnzyme())
})
