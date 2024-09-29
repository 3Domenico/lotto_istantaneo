import { Modal} from "react-bootstrap";
function DrawResult({ showResultModal, result, setShowResultModal, dataResult }) {
    const renderModalContent = () => {
        if (!dataResult) {
            return <Modal.Body> <p>Loading...</p></Modal.Body>;
        }
        switch (result) {
            case 'allNumbers':
                return (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>Congratulations, you guessed all the numbers! <i className="bi bi-emoji-smile-fill"></i> </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h2 className="text-center"><strong> You won: </strong></h2>
                            <h2 className="text-center mb-5">{dataResult.total_win}</h2>
                            <p><strong>Extraction Id:</strong> {dataResult.draw_id}</p>
                            <p><strong>Date of Extraction:</strong> {dataResult.draw_date}</p>
                            <p><strong>Drawn numbers:</strong> {dataResult.draw_numbers.join(', ')}</p>
                            <p><strong>Bet numbers:</strong> {dataResult.bet_numbers.join(', ')} </p>
                            <p><strong>Guessed numbers:</strong> {dataResult.guessed_numbers.join(', ')}</p>
                            <p><strong>Points used: </strong>{dataResult.points_used} </p>
                            <p><strong>Earning points: </strong> {dataResult.points_earnd} </p>


                        </Modal.Body>
                    </>
                );

            case 'someNumbers':
                return (
                    <>
                        <Modal.Header closeButton>
                            <Modal.Title>You guessed some numbers! <i className="bi bi-emoji-expressionless-fill"></i> </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h2 className="text-center"><strong> {dataResult.total_win >=0 ? "You won:": "You lost:"} </strong></h2>
                            <h2 className="text-center mb-5">{dataResult.total_win}</h2>
                            <p><strong>Extraction Id:</strong> {dataResult.draw_id}</p>
                            <p><strong>Date of Extraction:</strong> {dataResult.draw_date}</p>
                            <p><strong>Drawn numbers:</strong> {dataResult.draw_numbers.join(', ')}</p>
                            <p><strong>Bet numbers:</strong> {dataResult.bet_numbers.join(', ')} </p>
                            <p><strong>Guessed numbers:</strong> {dataResult.guessed_numbers.join(', ')}</p>
                            <p><strong>Points used: </strong>{dataResult.points_used} </p>
                            <p><strong>Earning points: </strong> {dataResult.points_earnd} </p>
                        </Modal.Body>
                    </>
                );

            case 'noNumbers':
                return (
                    <>
                        <Modal.Header closeButton >
                            <Modal.Title>  Too bad, you didn't guess any numbers <i className="bi bi-emoji-frown-fill"></i></Modal.Title>
                        </Modal.Header>
                        <Modal.Body >
                            <h2 className="text-center"><strong>You lost:</strong></h2>
                            <h2 className="text-center mb-5">{dataResult.total_win}</h2>
                            <p><strong>Estrazione n.</strong> {dataResult.draw_id}</p>       
                            <p><strong>Date of Extraction:</strong> {dataResult.draw_date}</p>
                            <p><strong>Drawn numbers:</strong> {dataResult.draw_numbers.join(', ')}</p>
                            <p><strong>Bet numbers:</strong> {dataResult.bet_numbers.join(', ')} </p>
                            <p><strong>Guessed numbers:</strong> 0</p>
                            <p><strong>Points used: </strong>{dataResult.points_used} </p>
                            <p><strong>Earning points: </strong> {dataResult.points_earnd} </p>
                        </Modal.Body>
                    </>
                );

            default:
                return <p>Loading...</p>;
        }
    };



    return (
        <>
            <Modal show={showResultModal} className={result==='allNumbers' ? 'custom-modal-AllNumbers' : result==='noNumbers' ? 'custom-modal-noNumbers' : result==='someNumbers' ? 'custom-modal-someNumbers':'' } onHide={() => setShowResultModal(false)}  >

                {renderModalContent()}

            </Modal>
        </>
    )


}
export default DrawResult;