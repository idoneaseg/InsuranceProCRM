import mongoose from "mongoose";
import Policy from "../model/policy.js";
import policyDocument from "../model/policyDocument.js";
import claim from "../model/claim.js";
import Notes from "../model/notes.js";

const index = async (req, res) => {
    const query = req.query;
    query.deleted = false;

    let allData = await Policy.find(query)
        .populate({
            path: 'createdBy',
            match: { deleted: false }
        })
        .exec();

    const result = allData.filter(item => item.createdBy !== null);
    let totalRecords = result.length;

    res.send({ result, total_recodes: totalRecords });
};

const add = async (req, res) => {
    try {
        const policyNumber = Math.floor(100000 + Math.random() * 900000); // 6-digit policy number
        const policy = new Policy({ policyNumber, ...req.body });
        await policy.save();
        res.status(201).json({ policy, message: 'Policy saved successfully' });
    } catch (err) {
        console.error('Failed to create Policy:', err);
        res.status(500).json({ error: 'Failed to create Policy' });
    }
};

const view = async (req, res) => {
    try {
        let policyaggregate = await Policy.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(req.params.id),
                },
            },
            {
                $lookup: {
                    from: "claims",
                    localField: "_id",
                    foreignField: "policy_id",
                    as: "claims",
                    pipeline: [
                        { $match: { deleted: false } },
                    ],
                },
            },
            {
                $lookup: {
                    from: "notes",
                    localField: "_id",
                    foreignField: "policy_id",
                    as: "notes",
                    pipeline: [
                        { $match: { deleted: false } },
                    ],
                },
            },
            {
                $lookup: {
                    from: "policydocuments",
                    localField: "_id",
                    foreignField: "policy_id",
                    as: "policydocuments",
                    pipeline: [
                        { $match: { deleted: false } },
                    ],
                },
            },
        ]);

        if (policyaggregate.length === 0) {
            return res.status(404).json({ message: "No data found." });
        }

        const populatedPolicy = await Policy.populate(policyaggregate[0], [
            { path: "assigned_agent", select: ["firstName", "lastName"] },
            { path: "contact_id", select: ["firstName", "lastName"] },
        ]);

        res.status(200).json({ policy: populatedPolicy });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const edit = async (req, res) => {
    try {
        const result = await Policy.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json({ result, message: 'Policy updated successfully' });
    } catch (err) {
        console.error('Failed to update Policy:', err);
        res.status(400).json({ error: 'Failed to update Policy' });
    }
};

const deleteData = async (req, res) => {
    try {
        const policyId = req.params.id;

        // Related deletions
        await Notes.updateMany({ policy_id: policyId }, { deleted: true });
        await claim.updateMany({ policy_id: policyId }, { deleted: true });
        await policyDocument.updateMany({ policy_id: policyId }, { deleted: true });

        const deletedPolicy = await Policy.findByIdAndUpdate(policyId, { deleted: true });

        if (!deletedPolicy) {
            return res.status(404).json({ message: "Policy not found." });
        }

        res.status(200).json({ message: "Policy and related data deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

const deleteMany = async (req, res) => {
    try {
        const policyIds = req.body;

        await Notes.updateMany({ policy_id: { $in: policyIds } }, { $set: { deleted: true } });
        await claim.updateMany({ policy_id: { $in: policyIds } }, { $set: { deleted: true } });
        await policyDocument.updateMany({ policy_id: { $in: policyIds } }, { $set: { deleted: true } });

        const deletedPolicys = await Policy.updateMany(
            { _id: { $in: policyIds } },
            { $set: { deleted: true } }
        );

        if (deletedPolicys.deletedCount === 0) {
            return res.status(404).json({ message: "No Policies found." });
        }

        res.status(200).json({ message: "Policies and related data deleted successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error." });
    }
};

export default { index, add, view, edit, deleteData, deleteMany };