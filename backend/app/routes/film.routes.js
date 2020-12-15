module.exports = (app) => {
  const films = require("../controllers/film.controller.js")

  const router = require("express").Router()

  // Create a new Film
  router.post("/", films.create)

  // Retrieve all Films
  router.get("/", films.findAll)

  // Retrieve a single Film with id
  router.get("/:id", films.findOne)

  // Update a Film with id
  router.put("/:id", films.update)

  // Delete a Film with id
  router.delete("/:id", films.delete)

  // Create a new Film
  router.delete("/", films.deleteAll)

  // Find all duplicates Films
  router.post("/duplicates", films.findDuplicates)

  // Upload txt and parse data
  router.post("/upload", films.upload)

  app.use("/api/films", router)
}
