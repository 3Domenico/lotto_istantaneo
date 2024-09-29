import db from "./db.mjs";

export default function BetDao() {

    this.createBet = (bet) => {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO bets (user_id, draw_id, points_used, number_0, number_1, number_2) VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(sql, [bet.user_id, bet.draw_id, bet.points_used, bet.bet_numbers[0] || 0, bet.bet_numbers[1] || 0, bet.bet_numbers[2] || 0], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    };

    this.hasUserBetInDraw = (user_id, draw_id) => {
        return new Promise((resolve, reject) => {
            const sql = "SELECT 1 FROM bets WHERE user_id = ? AND draw_id = ?";
            db.get(sql, [user_id, draw_id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row !== undefined)
                }
            })
        });

    }


        
    this.updatePointsEarnd = (user_id, draw_id, points_earnd) => {
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE bets SET points_earnd=? WHERE user_id=? AND draw_id=?';
            db.run(sql, [points_earnd, user_id, draw_id], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve()
                }
            })

        })
    }

    this.getBet=(user_id, draw_id)=>{
        return new Promise((resolve,reject)=>{
            const sql= 'SELECT id, number_0, number_1, number_2 FROM bets WHERE user_id=? AND draw_id=?';
            db.get(sql,[user_id,draw_id],(err,row)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(row)
                }
            })

        })
    }
    this.getBetsByDraw=(draw_id)=>{
        return new Promise((resolve,reject)=>{
            const sql="SELECT * FROM bets WHERE draw_id=?";
            db.all(sql,[draw_id],(err,rows)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(rows);
                }
            })

        })
    }

}