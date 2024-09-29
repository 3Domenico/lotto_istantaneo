import passport from 'passport';
import UserDao from '../db/dao-user.mjs';
const user_dao = new UserDao();

export default function AuthController() {

    this.login = (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ error: info });
            }
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json(req.user);
            });
        })(req, res, next);
    };

    this.getCurrentSession = async (req, res) => {
        if (req.isAuthenticated()) {
            const user= await user_dao.getUserById(req.user.id)
            res.status(200).json(user);
        } else {
            res.status(401).json({ error: 'Not authenticated' });
        }
    };

    this.logout = (req, res) => {
        req.logout((err) => {
            if (err) return res.status(500).json({ error: 'Logout failed' });
            res.status(200).json({ error: 'Logged out successfully' });
        });
    };

}