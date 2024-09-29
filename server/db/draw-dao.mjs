import dayjs from "dayjs"
import db from "./db.mjs"


export default function DrawDao() {
    this.getCurrentDraw = () => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT id , draw_date  FROM draws WHERE completed = 0 ORDER BY draw_date DESC LIMIT 1"
            db.get(sql, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            })
        })
    }

    this.getDrawById = (draw_id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM draws WHERE id= ?";
            db.get(sql, [draw_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            })


        })

    }

    this.createDraw = (draw_numbers) => {
        return new Promise((resolve, reject) => {
            const current_date = dayjs().format()
            const sql = "INSERT INTO draws (draw_date,number_1,number_2,number_3,number_4,number_5)  VALUES (?,?,?,?,?,?)"
            db.run(sql, [current_date, ...draw_numbers], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }

            });

        })

    }

    this.updateDrawCompleted = (draw_id) => {
        return new Promise((resolve, reject) => {
            const sql = "UPDATE draws SET completed = 1 WHERE id = ?";
            db.run(sql, [draw_id], function (err) {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    this.getBetResult = (user_id, draw_id) => {
        return new Promise((resolve, reject) => {
            const sql = `
            SELECT d.number_1, d.number_2, d.number_3, d.number_4, d.number_5, d.draw_date, 
                b.number_0 AS bet_number_0, b.number_1 AS bet_number_1, b.number_2 AS bet_number_2, b.points_used, b.points_earnd
            FROM bets b
            JOIN draws d ON b.draw_id = d.id
            WHERE b.user_id = ? AND b.draw_id = ?`;

            db.get(sql, [user_id, draw_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row)
                }
            })
        })
    }



}