import db from "./db.mjs";
import crypto from "crypto";
import User from "../models/user-model.mjs";
import { resolve } from "path";
import { rejects } from "assert";


export default function UserDao() {
    //login is possible with both email and username, identifier is email or username 

    this.getUserByCredentials = (identifier, password) => {
        return new Promise((resolve, rejects) => {
            const sql = 'SELECT * FROM users WHERE email=? OR username=?';
            db.get(sql, [identifier, identifier], (err, row) => {
                if (err) {
                    rejects(err);
                } else if (row === undefined) {
                    resolve(false);
                } else {
                    const user = new User(row.id, row.username, row.email, row.points);
                    crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) {
                        if (!crypto.timingSafeEqual(Buffer.from(row.password, 'hex'), hashedPassword))
                            resolve(false);
                        else
                            resolve(user);
                    });
                }
            })
        })

    }

    this.addPoints = (user_id, total_win) => {
        return new Promise((resolve, rejects) => {
            const sql = `UPDATE users SET points = points + ? WHERE id = ?`
            db.run(sql, [total_win, user_id], function (err) {
                if (err) {
                    rejects(err)
                } else {
                    resolve(true)
                }
            })

        });
    }

    this.getUserById = (user_id) => {
        return new Promise((resolve, rejects) => {
            const sql = 'SELECT id, username, email, points FROM users WHERE id=?'
            db.get(sql,[user_id],(err,row)=>{
                if(err){
                    rejects(err);
                }else{
                    resolve(new User(row.id,row.username,row.email,row.points))
                }

            })

        })
    }

    this.getTopThreeUsers = () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT username, points FROM users ORDER BY points DESC LIMIT 3`;
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }



};