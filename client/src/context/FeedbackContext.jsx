import { createContext, useState } from 'react';
import { Toast,ToastContainer } from 'react-bootstrap';

export const FeedbackContext =createContext();

// Provider che avvolge l'app e gestisce gli errori
export const FeedbackProvider = ({ children }) => {
    const [feedback, setFeedback] = useState({message:'',type:''}); // Stato per il messaggio d'errore
    const [show, setShow]=useState(null);

    // Funzione per mostrare un FeedBack, che chiama setError
    const showFeedback = (message,type='succes') => {
        setFeedback({message,type});
        setShow(true);

    };

    return (
        <FeedbackContext.Provider value={showFeedback}>
            {children}
            <ToastContainer position="top-center" className="p-3" style={{position: "fixed"}}>
                <Toast onClose={() => setShow(false)} show={show} bg={feedback.type} delay={2500} autohide>
                    <Toast.Body>{feedback.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </FeedbackContext.Provider>
    );



}