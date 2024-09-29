import DrawDao from "../db/draw-dao.mjs";
import { updateBetResultsForDraw } from "./bet-controller.mjs";
import { validationResult } from "express-validator";
import { calculateWin, isDrawComplete } from "../utilities/draw-utils.mjs";
import DrawResult from "../models/draw-model.mjs";


const draw_dao = new DrawDao()

export async function startDraws() {
    try {
        const draw_numbers = generateDrawNumbers();
        const draw_id = await draw_dao.createDraw(draw_numbers);
        console.log('Nuova estrazione:', draw_numbers);
        // il timeout serve per richiamare la funzione di calcolo dei risulati 2 minuti dopo ovvero quando l'estrazione deve terimanre
        setTimeout(async () => {
            try{
                //aggiorna il punteggio degli utenti e della bet impostando i points_earnd(così facendo la bet risulta effettivamente pagata)
                await updateBetResultsForDraw(draw_id);
                //imposta l estrazione come completa
                await draw_dao.updateDrawCompleted(draw_id);
                console.log(`Draw ${draw_id} marked as completed.`);
            }catch (err){
                console.log(err)
            }
         
        }, 2 * 60 * 1000);
    } catch (err) {
        console.log(err);
    }

}

function generateDrawNumbers() {
    //il set mi elimina automaticamente i duplicati
    const numbers = new Set();
    while (numbers.size < 5) {
        // dato che math random genera numeri con virgola tra 0 e 1(escluso), floor mi prmette di arrotondare il numero per difetto, cosi ho sempre un range tra 0 e 90
        numbers.add(Math.floor(Math.random() * 90 + 1));
    }
    return [...numbers]

}

export default function DrawController() {
    this.getCurrentDraw = async (req, res) => {
        try {
            const current_draw = await draw_dao.getCurrentDraw();
            if (!current_draw) {
                return res.status(404).json({ error: 'no draws available.' });
            }
            res.status(200).json(current_draw);
        } catch(err) { 
            res.status(500).json({ error: "Internal Server Error", details: err })
        }

    }

    //crea un json con le informazioni relative ad una vincita da parte di un utente specifico rispetto a una draw specifica
    //non posso sfruttare la tabella in quanto non si aggiorna in tempo e questa api viene chiamata poco dopo il termine dell'estrazione
    this.getResultDraw=async (req,res)=>{
        try{
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const {drawId}=req.params;
            const user_id=req.user.id;
            const result= await draw_dao.getBetResult(user_id,drawId);
            //verifica l'esistenza di una bet sulla specifica draw, e della draw stessa
            if(!result){
                return res.status(404).json({ error: "Bet or draw not found." });
            }

            if(!isDrawComplete(result.draw_date)){
                return res.status(400).json({ error: "The extraction is not finished yet." });
            }
            const draw_numbers = [
                result.number_1, result.number_2, result.number_3, 
                result.number_4, result.number_5
            ];
            const bet_numbers = [result.bet_number_0, result.bet_number_1, result.bet_number_2].filter((n) => n !== 0);
            //gestisce il caso in cui la tabella della bet non è stata aggiornata in tempo con il valore points_earnd
            if(result.points_earnd!==0 && !result.points_earnd){
                const [points_earnd,guessed_numbers]=calculateWin(bet_numbers,draw_numbers,result.points_used);
                result.points_earnd=points_earnd;
                result.guessed_numbers=guessed_numbers;
            }else{
            const guessed_numbers = bet_numbers.filter(num =>draw_numbers.includes(num));
            result.guessed_numbers=guessed_numbers;
            }
            const draw_result=new DrawResult(drawId,result.draw_date,draw_numbers,bet_numbers,result.points_used,result.points_earnd,result.guessed_numbers);
            const total_win=draw_result.total_win()
            return res.status(200).json({...draw_result,total_win})

            
        }catch(err){
            console.log(err);
            res.status(500).json({ error: "Internal Server Error", details: err })
        }

    }


}