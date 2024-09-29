import ResultDao from "../db/result-dao.mjs";
const result_dao=new ResultDao();

export default function ResultController(){
    this.getResultsByUser=async (req,res)=>{
        try {
            const user_id = req.user.id; 
            const results = await result_dao.getResultsByUser(user_id);
            res.status(200).json(results);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error', details: error });
        }

    }


}