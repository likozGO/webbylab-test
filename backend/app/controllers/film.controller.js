const db = require("../models")
const misc = require("./parse.method")

const Film = db.films

// Create and Save a new Film
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
        res.status(400).send({message: "Content can not be empty!"})
        return
    }

    // Create a Film
    const film = new Film({
        title: req.body.title,
        release: req.body.release,
        format: req.body.format,
        stars: req.body.stars,
        published: req.body.published ? req.body.published : false,
    })

    // Save Film in the database
    film
        .save(film)
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Film.",
            })
        })
}

RegExp.quote = function(str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
};

// Retrieve all Films from the database.
exports.findAll = (req, res) => {
    const {title, stars} = req.query
    let condition

    if (title) {
        condition = title
            ? {title: {$regex: new RegExp(RegExp.quote(title)), $options: "i"}}
            : {}
    } else {
        const searchArray = stars && stars.split(' ')
        if (searchArray && searchArray.length === 1) {
            condition = stars
                ? {$or: [
                        {'stars.firstName':
                                {'$regex': new RegExp(RegExp.quote(searchArray[0].toString()))}},
                        {'stars.lastName':
                                {'$regex': new RegExp(RegExp.quote(searchArray[0].toString()))}},
                    ]
                }
                : {}
        } else if (searchArray && searchArray.length === 2) {
            condition = stars
                ? {$and: [
                        {'stars.firstName':
                                {'$regex': new RegExp(RegExp.quote(searchArray[0].toString()))}},
                        {'stars.lastName':
                                {'$regex': new RegExp(RegExp.quote(searchArray[1].toString()))}},
                    ]
                }
                : {}
        } else if (searchArray && searchArray.length > 2) {
            res.status(400).send({
                message: "Please type first name or last name, or full name",
            })
        }
    }

    Film.find(condition).collation({locale: "en", strength: 2})
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving films.",
            })
        })
}

// Find a single Film with an id
exports.findOne = (req, res) => {
    const {id} = req.params

    Film.findById(id)
        .then((data) => {
            if (!data)
                res.status(404).send({message: `Not found Film with id ${id}`})
            else res.send(data)
        })
        .catch((err) => {
            res.status(500).send({message: `Error retrieving Film with id=${id}`})
        })
}

// Update a Film by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!",
        })
    }

    const {id} = req.params

    Film.findByIdAndUpdate(id, req.body, {useFindAndModify: false})
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Film with id=${id}. Maybe Film was not found!`,
                })
            } else res.send({message: "Film was updated successfully."})
        })
        .catch((err) => {
            res.status(500).send({
                message: `Error updating Film with id=${id}`,
            })
        })
}

// Delete a Film with the specified id in the request
exports.delete = (req, res) => {
    const {id} = req.params

    Film.findByIdAndRemove(id, {useFindAndModify: false})
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Film with id=${id}. Maybe Film was not found!`,
                })
            } else {
                res.send({
                    message: "Film was deleted successfully!",
                })
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: `Could not delete Film with id=${id}`,
            })
        })
}

// Delete all Films from the database.
exports.deleteAll = (req, res) => {
    Film.deleteMany({})
        .then((data) => {
            res.send({
                message: `${data.deletedCount} Films were deleted successfully!`,
            })
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all films.",
            })
        })
}

// Find all duplicates Films
exports.findDuplicates = (req, res) => {

    const {format, release, title} = req.body.data
    const {firstName, lastName} = req.body.data.stars[0]
    const d = new Date(release);
    const findQuery = {
        title: { $regex : new RegExp(title, "i") },
        format: format,
        release: {
            "$gte": d.setHours(0,0,0,0),
            "$lt": new Date(release)
        },
        stars: [{
          "firstName": firstName,
          "lastName": lastName,
          }],
    }

    Film.find(findQuery).collation({locale: "en", strength: 2})
        .then((data) => {
            res.send(data)
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving films.",
            })
        })
}

exports.upload = (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send("No files were uploaded.")
    }
    // get upload file
    const {upload} = req.files
    if (!upload.name.match(/\.(txt)$/i)) {
        return res.status(400).send("Format file must be txt.")
    }
    const buffer = upload.data

    const finalObject = misc
        .ParseController(buffer.toString("utf8"))
        .map((a) => Object.assign({}, ...a))

    Promise.all(
        finalObject.map((row) => {
            const newFilm = new Film({
                title: row.title,
                release: row.release,
                format: row.format,
                stars:
                    row.stars &&
                    row.stars.map((a) => ({
                        firstName: a.firstName,
                        lastName: a.lastName,
                    })),
                published: false,
            })
            if (Object.keys(row).length !== 4) {
                res
                    .status(500)
                    .send(`Your file is missing a field here: ${JSON.stringify(row)}`)
            } else {
                newFilm.save()
            }
        })
    )
        .then(() => {
            res.send("Alright")
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving films.",
            })
        })
}
