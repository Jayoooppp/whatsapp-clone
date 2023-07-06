import getPrismaInstance from "../utils/PrismaClient.js"

export const getAllUsers = async (req, res) => {
    try {
        const prisma = getPrismaInstance();
        const users = await prisma.user.findMany({
            orderBy: { name: "asc" },
            select: {
                id: true,
                email: true,
                name: true,
                profilePicture: true,
                about: true
            }
        })
        const usersGroupByInitialLetters = {};
        users.map((user) => {
            const initialLetter = user.name.charAt(0).toUpperCase();
            if (!usersGroupByInitialLetters[initialLetter]) {
                usersGroupByInitialLetters[initialLetter] = [];
            }
            usersGroupByInitialLetters[initialLetter].push(user);
        })
        return res.status(200).json({ users: usersGroupByInitialLetters })
    } catch (error) {
        console.log("🚀 ~ file: MessageController.js:6 ~ getAllUser ~ error:", error)

    }
}