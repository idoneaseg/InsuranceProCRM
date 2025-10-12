import Meetings from '../model/Meetings.js';

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;

    let allData = await Meetings.find(query)
        .populate("createdBy", ["firstName", "lastName"])
        .populate("lead_id", ["firstName", "lastName"])
        .populate("contact_id", ["firstName", "lastName"]);

    let totalRecords = allData.length;
    res.send({ result: allData, total_recodes: totalRecords });
};

const add = async (req, res) => {
    try {
        const meetings = new Meetings(req.body);
        await meetings.save();
        res.status(201).json({ meetings, message: 'Meeting saved successfully' });
    } catch (err) {
        console.error('Failed to create Meeting:', err);
        res.status(500).json({ error: 'Failed to create Meeting' });
    }
};

const view = async (req, res) => {
    let meetings = await Meetings.findOne({ _id: req.params.id })
        .populate("createdBy", ["firstName", "lastName"])
        .populate("lead_id", ["firstName", "lastName"])
        .populate("contact_id", ["firstName", "lastName"]);

    if (!meetings) return res.status(404).json({ message: "No Data Found." });
    res.status(200).json({ meetings });
};

const edit = async (req, res) => {
    try {
        let result = await Meetings.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json({ result, message: 'Meeting updated successfully' });
    } catch (err) {
        console.error('Failed to Update Meeting:', err);
        res.status(400).json({ error: 'Failed to Update Meeting' });
    }
};

const deleteData = async (req, res) => {
    try {
        let meetings = await Meetings.findByIdAndUpdate(
            { _id: req.params.id },
            { deleted: true }
        );
        res.status(200).json({ message: "Meeting deleted successfully", meetings });
    } catch (err) {
        res.status(404).json({ message: "Error", err });
    }
};

const deleteMany = async (req, res) => {
    try {
        const meetingIdsToDelete = req.body;

        const deleteManyMeetings = await Meetings.updateMany(
            { _id: { $in: meetingIdsToDelete } },
            { deleted: true }
        );

        if (deleteManyMeetings.deletedCount === 0) {
            return res.status(404).json({ message: "Meeting(s) not found." });
        }

        res.status(200).json({
            message: "Meetings deleted successfully.",
            deleteManyMeetings
        });
    } catch (err) {
        res.status(500).json({
            message: "Error deleting Meeting(s).",
            error: err.message
        });
    }
};

export default { index, add, view, edit, deleteData, deleteMany };