import dayjs from 'dayjs';


export function isDrawComplete(draw_date) {
    const drawTime = dayjs(draw_date);
    const currentTime = dayjs();
    // Verifica se sono passati più di 2 minuti dall'ora dell'estrazione
    return currentTime.diff(drawTime, 'minute') >= 2;
}

export function calculateWin(bet_numbers, draw_numbers, points_used) {
    const guessed_numbers = bet_numbers.filter(num => draw_numbers.includes(num));
    const win_amount = (guessed_numbers.length / bet_numbers.length) * 2 * points_used;
    return [win_amount,guessed_numbers];
}