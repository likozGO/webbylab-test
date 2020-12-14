import React from "react"
import { configure, shallow, mount } from "enzyme"
import chai, { expect } from "chai"
import chaiEnzyme from "chai-enzyme"
import Adapter from "enzyme-adapter-react-16"
import FilmsList from "../components/FilmList"

configure({
  adapter: new Adapter(),
})
describe("Testin <FilmList/> Component", () => {
  it("Film list category buttons", () => {
    const wrapper = shallow(<FilmsList />)
    expect(wrapper.find(".btn")).to.have.lengthOf(3)
  })
  it("Film list h4 title rendered", () => {
    const component = shallow(<FilmsList />)
    expect(component.find("h4").text("Films List"))
  })
  chai.use(chaiEnzyme())
})
