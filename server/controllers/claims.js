import Claims from '../model/claim.js';

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;

    let allData = await Claims.find(query)
        .populate({
            path: 'createdBy',
            match: { deleted: false } // Populate only if createdBy.deleted is false
        })
        .exec();

    const result = allData.filter(item => item.createdBy !== null);

    let totalRecords = result.length;
    res.send({ result, total_recodes: totalRecords });
};

const add = async (req, res) => {
    try {
        const claims = new Claims(req.body);
        await claims.save();
        res.status(201).json({ claims, message: 'Claim created successfully' });
    } catch (err) {
        console.error('Failed to create Claim:', err);
        res.status(500).json({ error: 'Failed to create Claim' });
    }
};

const view = async (req, res) => {
    let claims = await Claims.findOne({ _id: req.params.id });
    if (!claims) return res.status(404).json({ message: 'No Data Found.' });
    res.status(200).json(claims);
};

const edit = async (req, res) => {
    try {
        let result = await Claims.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json({ result, message: 'Claim updated successfully' });
    } catch (err) {
        console.error('Failed to Update Claim:', err);
        res.status(400).json({ error: 'Failed to Update Claim' });
    }
};

const deleteData = async (req, res) => {
    try {
        let claims = await Claims.findByIdAndUpdate(
            { _id: req.params.id },
            { deleted: true }
        );
        res.status(200).json({ message: 'Claim deleted successfully', claims });
    } catch (err) {
        res.status(404).json({ message: 'Error', err });
    }
};

export default { index, add, view, edit, deleteData };