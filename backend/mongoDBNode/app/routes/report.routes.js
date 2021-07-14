module.exports = (app) => {
    const reports = require("../controllers/report.controller.js");

    var router = require("express").Router();

    // Create a new report
    router.post("/", reports.create);

    // Retrieve all reports
    //http://localhost:8080/api/reports/?emailId="+emailId
    router.get("/", reports.findAll);

    // Retrieve all published reports
    router.get("/published", reports.findAllPublished);

    // Retrieve a single report with id
    router.get("/:id", reports.findOne);

    // Update a report with id
    //http://localhost:8080/api/reports/:id?id="+id
    router.put("/:id", reports.update);

    // Delete a report with id
    //http://localhost:8080/api/reports/:id?id="+id
    router.delete("/:id", reports.delete);

    // Create a new report
    router.delete("/", reports.deleteAll);

    app.use("/api/reports", router);
};
