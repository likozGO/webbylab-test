module.exports.ParseController = function (input) {
  const array = input
    .replace(/\r/g, "\n")
    .replace(/\t/g, "")
    .split("\n")
    .reverse()
  function chunk(arr, chunkSize) {
    if (chunkSize <= 0) throw new Error("Invalid chunk size")
    const R = []
    for (let i = 0, len = arr.length; i < len; i += chunkSize)
      R.push(arr.slice(i, i + chunkSize))
    return R
  }

  const template = []

  array.map((arr) => {
    // remove empty strings
    if (arr) {
      if (arr.length > 0) {
        const keyValue = arr.split(": ")
        if (keyValue[0] === "Release Year") {
          keyValue[0] = "release"
        }
        if (keyValue[0].toLowerCase() === "stars") {
          template.push({
            [`${keyValue[0].toLowerCase()}`]: keyValue[1]
              .replace(/,\s/g, ",")
              .split(",")
              .map((a) => ({
                firstName: a.split(" ")[0],
                lastName: a.split(" ")[1],
              })),
          })
        } else {
          template.push({ [`${keyValue[0].toLowerCase()}`]: keyValue[1] })
        }
      } else {
        const keyValue = arr.split(" ")
        template.reverse()
        template[keyValue[0]] = keyValue[1].slice(0, -1)
      }
    }
    return arr
  })

  const finalResponse = template.reverse()
  return chunk(finalResponse, 4)
}
