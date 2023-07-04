import getPrismaInstance from "../utils/PrismaClient.js"
export const checkUser = async (req, res) => {

    try {
        const { email } = req.body;
        if (!email) {
            res.json({ msg: "Email is required", status: false })
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            return res.json({ msg: "User not found", status: false })
        } else {
            return res.json({ msg: "User found", status: true, data: user })
        }
    } catch (error) {
        console.log(error)
    }

}
export const onBoardUser = async (req, res) => {
    try {
        const { email, name, about, image: profilePicture } = req.body;
        if (!email || !name || !profilePicture) {
            return res.send({ msg: "Email, name and profile image is required", status: false })
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data: { email, name, about, profilePicture }
        })
        return res.json({ msg: "Success", status: true, data: user })
    } catch (error) {
        console.log("🚀 ~ file: AuthController.js:25 ~ onBoardUser ~ error:", error)

    }
}