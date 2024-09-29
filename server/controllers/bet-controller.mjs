import BetDao from "../db/bet-dao.mjs";
import UserDao from "../db/dao-user.mjs";
import DrawDao from "../db/draw-dao.mjs";
import ResultDao from "../db/result-dao.mjs";
import Bet from "../models/bet-model.mjs";
import { isDrawComplete } from "../utilities/draw-utils.mjs";
import { validationResult } from "express-validator";
import { calculateWin } from "../utilities/draw-utils.mjs";

const bet_dao = new BetDao();
const draw_dao = new DrawDao();
const user_dao = new UserDao();
const result_dao = new ResultDao();


export async function updateBetResultsForDraw(draw_id) {
    try {
        // Recupera tutte le scommesse per il draw_id specificato
        const bets = await bet_dao.getBetsByDraw(draw_id);
        if (!bets || bets.length === 0) {
            console.log("No bets found for the specified draw.");
            return;
        }

        const drawResult = await draw_dao.getDrawById(draw_id);
        if (!drawResult) {
            throw new Error("Draw not found.");
        }

        if (!isDrawComplete(drawResult.draw_date)) {
            throw new Error("The extraction is not finished yet.");
        }

        const draw_numbers = [
            drawResult.number_1, drawResult.number_2, drawResult.number_3,
            drawResult.number_4, drawResult.number_5
        ];

        // Itera su ciascuna scommessa e calcola il risultato
        for (const bet of bets) {
            // Filtra i numeri della scommessa, escludendo i numeri non puntati (che sono rappresentati come 0)
            const bet_numbers = [bet.number_0, bet.number_1, bet.number_2].filter((n) => n !== 0);
            const win = calculateWin(bet_numbers, draw_numbers, bet.points_used);
            const win_amount = win[0];
            const guessed_numbers = win[1].length > 0 ? win[1].join(',') : '0';
            const win_status = win[1].length === bet_numbers.length ? 'all' : win[1].length > 0 ? 'some' : 'none'
            // Aggiorna i punti guadagnati nella scommessa
            await bet_dao.updatePointsEarnd(bet.user_id, draw_id, win_amount);
            // Aggiorna i punti totali dell'utente
            const total_win = win_amount - bet.points_used;
            await user_dao.addPoints(bet.user_id, total_win);
            await result_dao.insertResult(bet.id, bet.user_id, draw_id, guessed_numbers, win_status, total_win);
            console.log(`User ${bet.user_id} won ${total_win} points for draw ${draw_id}`);
        }

        return { message: "All bets updated successfully." };
    } catch (err) {
        console.log(err);
        throw err;
    }
}






export default function BetController() {

    this.createBet = async (req, res) => {
        try {
            const user_id = req.user.id;
            const { draw_id, numbers } = req.body;
            const errors = validationResult(req);
            //puntata senza numeri
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            //l'array non deve contenere duplicati
            if (new Set(numbers).size !== numbers.length) {
                return res.status(422).json({ error: "Numbers must be unique" });
            }
            const pointsRequired = numbers.length * 5;
            const draw = await draw_dao.getDrawById(draw_id);
            if (!draw) {
                return res.status(404).json({ error: "Draw not found" });

            }
            //l'estrazione non deve essere terminata
            if (isDrawComplete(draw.draw_date)) {
                return res.status(400).json({ error: "Cannot bet on a completed draw." });
            }
            //non deve esistere più di una bet per estrazione
            const hasBet = await bet_dao.hasUserBetInDraw(user_id, draw_id);
            if (hasBet) {
                return res.status(400).json({ error: "You have already placed a bet for this draw." });
            }
            //si hanno i punti necessari??
            const user = await user_dao.getUserById(req.user.id);
            if (user.points < pointsRequired) {
                return res.status(400).json({ error: "Not enough points to place this bet." });
            }
            const bet = new Bet(user_id, draw_id, numbers, pointsRequired);
            await bet_dao.createBet(bet);

            res.status(200).json({ message: "Bet placed successfully." });

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error", details: err })
        }
    }

    this.getBet = async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const user_id = req.user.id;
            const draw_id = req.params.drawId;
            const bet = await bet_dao.getBet(user_id, draw_id)
            if (!bet) {
                return res.status(404).json({ error: "Bet not found." });
            }
            return res.status(200).json(bet);

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Internal Server Error", details: err });
        }
    }

}