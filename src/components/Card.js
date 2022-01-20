import './Card.css';

function Card({ card, handleChoice, flipped, disabled }) {

    // FUNCTIONS
    const handleClick = () => {
        if (!disabled) {
            handleChoice(card)
        }
    }

    return (
        <div className='card'>
            <div className={flipped ? "flipped" : ""}>

                <img className='front-card' src={card.src} alt={card.name} />
                <img className='back-card' src="/img/card-back.png" alt="card back" onClick={handleClick} />
            </div>
        </div>
    );
}

export default Card;
