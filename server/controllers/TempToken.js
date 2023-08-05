import { generateRtcToken } from "../utils/TempToken.js"

export const generateToken = (req, res) => {

    const token = generateRtcToken();

    return res.status(203).json({ token });
}