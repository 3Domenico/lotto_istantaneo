export default function Result({bet_number_0,bet_number_1,bet_number_2,draw_date,draw_id,guessed_numbers,number_1,number_2,number_3,number_4,number_5,points_used,points_earnd,total_win,win_status}){
    this.bet_numbers=[bet_number_0,bet_number_1,bet_number_2].filter(num => num !== 0);
    this.draw_date=draw_date;
    this.draw_id=draw_id;
    this.guessed_numbers=guessed_numbers;
    this.draw_numbers=[number_1,number_2,number_3,number_4,number_5];
    this.points_used=points_used;
    this.points_earnd=points_earnd;
    this.total_win=total_win;
    this.win_status=win_status;

}