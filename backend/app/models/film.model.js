module.exports = (mongoose) => {
  const schema = mongoose.Schema(
    {
      title: String,
      release: Date,
      stars: Array,
      format: String,
      published: Boolean,
    },
    { timestamps: true }
  )

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject()
    object.id = _id
    return object
  })

  const Film = mongoose.model("film", schema)
  return Film
}
