import React from "react"
import { configure, shallow } from "enzyme"
import chai, { expect } from "chai"
import chaiEnzyme from "chai-enzyme"
import Adapter from "enzyme-adapter-react-16"
import FormatOption from "../components/options/FormatOption"

configure({
  adapter: new Adapter(),
})
describe("Testin <FormatOption/> Component", () => {
  it("Format option return", () => {
    const wrapper = shallow(<FormatOption />)
    expect(wrapper.find(".input-icon")).to.have.lengthOf(3)
  })
  chai.use(chaiEnzyme())
})
