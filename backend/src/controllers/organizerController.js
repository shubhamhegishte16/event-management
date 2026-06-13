import organizerModel from "../models/Organizer.js";

export const getOrganizerProfile = async (req, res) => {
    try {
        const organizer = await organizerModel.findById(req.user.id).select("-password");

        if(!organizer) {
            return res.status(401).json({
                success: true,
                message: "Organizer Not Found",
            });
        }

        res.json({
            success: true,
            organizer,
        });
    }
    catch (error) {
        console.error("Get Organizer Profile error: ", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};