import { useEffect, useState } from 'react';
import './App.css';
import Card from './components/Card';

function App() {
    // VARIABLES
    const [pokemonItems, setPokemonItems] = useState([])
    const [pokemonCardShuffoled, setPokemonCardShuffoled] = useState([])
    const [turns, setTurns] = useState(0)
    const [choiseOne, setChoiseOne] = useState(null)
    const [choiseTwo, setChoiseTwo] = useState(null)
    const [disabledCard, setDisabledCard] = useState(false)


    // FUNCTIONS
    const getImagePokemon = async (pokemon) => {
        let promises = []
        pokemon.forEach(p => {
            promises.push(fetch(p.url))
        });
        const response = await Promise.all(promises)
        promises = []
        response.forEach(r => {
            promises.push(r.json())
        });
        const results = await (await Promise.all(promises)).map((res) => {
            return { name: res.name, src: res.sprites.front_default }
        })
        setPokemonItems(results)
    }

    const getPokemon = () => {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=6')
            .then(response => response.json())
            .then(data => {
                getImagePokemon(data.results)
            });
    }

    const shuffle = () => {
        const shuffleDoublePokemon = [...pokemonItems, ...pokemonItems].sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random(), matched: false }))
        setChoiseOne(null)
        setChoiseTwo(null)
        setPokemonCardShuffoled(shuffleDoublePokemon)
        setTurns(0)
    }

    const handleChoice = (card) => {
        choiseOne ? setChoiseTwo(card) : setChoiseOne(card)
    }

    const resetTurn = () => {
        setChoiseTwo(null)
        setChoiseOne(null)
        setTurns((prevTurns => prevTurns + 1))
        setDisabledCard(false)
    }

    // RENDERING
    const renderPokemonCards = () => {
        return pokemonCardShuffoled.map((card) => {
            return <Card key={card.id} card={card} handleChoice={handleChoice} flipped={card === choiseOne || card === choiseTwo || card.matched} disabled={disabledCard} />
        })
    }

    // INITIALIZE
    useEffect(() => {
        getPokemon()
    }, []);

    useEffect(() => {
        if (choiseOne && choiseTwo) {
            setDisabledCard(true)
            if (choiseOne.src === choiseTwo.src) {
                setPokemonCardShuffoled(prevCards => {
                    return prevCards.map((card) => {
                        if (card.src === choiseOne.src) {
                            return { ...card, matched: true }
                        } else {
                            return card
                        }
                    })
                })
                resetTurn()
            } else {
                setTimeout(() => resetTurn(), 1000)
            }
        }
    }, [choiseOne, choiseTwo]);

    return (
        <div className="App">
            <div className='menu'>
                <img src="img/logo2.png" alt="" className='logo' />
                <input className='button' onClick={shuffle} type="button" value="New Game" />
                <h3>Moves: {turns}</h3>
            </div>
            <div className="card-grid">
                {renderPokemonCards()}
            </div>
        </div>
    );
}

export default App;
