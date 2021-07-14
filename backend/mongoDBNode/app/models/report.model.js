module.exports = (mongoose) => {
    var schema = mongoose.Schema(
        {
            frequency: Number,
            count: Number,
            type: Number,
            columns: [String],
            data: [[String], [[Number]]],
            emailId: String,
            reportName: String,
            favourite: Boolean,
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Report = mongoose.model("report", schema);
    return Report;
};
