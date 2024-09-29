export default function DrawResult(draw_id,draw_date, draw_numbers, bet_numbers, points_used,points_earnd,guessed_numbers) {
   this.draw_id=draw_id;
   this.draw_date=draw_date;
   this.draw_numbers=draw_numbers;
   this.bet_numbers=bet_numbers;
   this.points_used=points_used;
   this.points_earnd=points_earnd;
   this.guessed_numbers=guessed_numbers;
   this.total_win=()=>this.points_earnd-this.points_used
}