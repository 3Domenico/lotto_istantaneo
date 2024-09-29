import UserDao from "../db/dao-user.mjs";
const user_dao = new UserDao();

export default function UserController() {
    this.getTopThreeUsers = async (req, res) => {
        try {
            const top_users = await user_dao.getTopThreeUsers();
            res.status(200).json(top_users);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    }


};