import Result from "../models/result-model.mjs";
import db from "./db.mjs";
export default function ResultDao() {

    this.insertResult = (bet_id, user_id, draw_id, guessed_numbers, win_status, total_win) => {
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO bet_results (bet_id, user_id, draw_id, guessed_numbers, win_status, total_win) VALUES (?, ?, ?, ?, ?, ?)'
            db.run(sql, [bet_id, user_id, draw_id, guessed_numbers, win_status, total_win], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            })
        })
    }


    this.getResultsByUser = (user_id) => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 
            draws.id AS draw_id, 
            draws.draw_date, 
            draws.number_1, 
            draws.number_2, 
            draws.number_3, 
            draws.number_4, 
            draws.number_5,
            
            bets.id AS bet_id, 
            bets.number_0 AS bet_number_0, 
            bets.number_1 AS bet_number_1, 
            bets.number_2 AS bet_number_2, 
            bets.points_used,
            bets.points_earnd,
            
            bet_results.guessed_numbers, 
            bet_results.win_status, 
            bet_results.total_win
            
        FROM 
            draws 
        JOIN 
            bets ON draws.id = bets.draw_id  
        JOIN 
            bet_results ON bets.id = bet_results.bet_id  
        WHERE 
            bets.user_id = ? 
        ORDER BY 
            draws.id DESC;`; 
            db.all(sql,[user_id],(err,rows)=>{
                if(err){
                    reject(err);
                }else{
                    const result=rows.map((row)=>{
                        //map numbers li converte ad interi
                        return new Result({...row, guessed_numbers: row.guessed_numbers ? row.guessed_numbers.split(',').map(Number) : []})
                    })
                    
                    resolve(result);
                }

            })

        })
    }


}