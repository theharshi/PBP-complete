const db = require("../models");
const Report = db.reports;

// Create and Save a new report
exports.create = (req, res) => {
    // Validate request
    if (!req.body.emailId) {
        res.status(400).send({ message: "Content can not be empty!" });
        return;
    }
    // Create a report
    const report = new Report({
        frequency: req.body.frequency,
        count: req.body.count,
        type: req.body.type,
        columns: req.body.columns,
        data: req.body.data,
        emailId: req.body.emailId,
        reportName: req.body.reportName,
        favourite: req.body.favourite,
    });

    // Save report in the database
    report
        .save(report)
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Report.",
            });
        });
};

// Retrieve all Reports from the database.
exports.findAll = (req, res) => {
    const emailId = req.query.emailId;
    var condition = emailId ? { emailId: { $regex: new RegExp(emailId), $options: "i" } } : {};

    Report.find(condition)
        .then((data) => {
            console.log(data);
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Reports.",
            });
        });
};

// Find a single Report with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Report.findById(id)
        .then((data) => {
            if (!data) res.status(404).send({ message: "Not found Report with id " + id });
            else res.send(data);
        })
        .catch((err) => {
            res.status(500).send({ message: "Error retrieving Report with id=" + id });
        });
};

// Update a Report by the id in the request
exports.update = (req, res) => {
    if (!req.body) {
        return res.status(400).send({
            message: "Data to update can not be empty!",
        });
    }

    const id = req.params.id;
    // console.log(id, req);
    Report.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Tutorial with id=${id}. Maybe Report was not found!`,
                });
            } else {
                console.log(data);
                res.send({ message: "Report was updated successfully.", data });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Error updating Report with id=" + id,
            });
        });
};

// Delete a Report with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;

    Report.findByIdAndRemove(id, { useFindAndModify: false })
        .then((data) => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete Report with id=${id}. Maybe Report was not found!`,
                });
            } else {
                res.send({
                    message: "Report was deleted successfully!",
                });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: "Could not delete Report with id=" + id,
            });
        });
};

// Delete all Report from the database.
exports.deleteAll = (req, res) => {
    Report.deleteMany({})
        .then((data) => {
            res.send({
                message: `${data.deletedCount} Reports were deleted successfully!`,
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while removing all Reports.",
            });
        });
};

// Find all  Reports
exports.findAllPublished = (req, res) => {
    Report.find({ published: true })
        .then((data) => {
            res.send(data);
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving Reports.",
            });
        });
};
