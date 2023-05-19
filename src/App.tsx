import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  HomePage,
  PokemonList,
  ScoreBoard,
  GameEndedModal,
} from './components';
import { Pokemon, CardInfo } from './interface';

const App = () => {
  const TIME_IN_SECOND = 120;
  const NUMBER_OF_PAIR = 11;
  const [gameStarted, setGameStarted] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [SelectedBalls, setSelectedBalls] = useState<CardInfo>({
    pokemonId: [],
    index: [],
  });
  const [correctPairs, setCorrectPairs] = useState<number[][]>([]);
  const [isTransitionEnd, setTransitiondEnd] = useState({
    status: false,
  });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_IN_SECOND);
  const [newGame, setNewGame] = useState(0);
  const gameEnded = score === NUMBER_OF_PAIR || timeLeft === 0;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const randomNumber = Math.floor(Math.random() * 400);
    // random a page number to get different pokemon

    const getPokemons = async () => {
      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${NUMBER_OF_PAIR}&offset=${randomNumber}`,
          { signal },
        );

        res.data.results.forEach(async ({ name }: { name: string }) => {
          const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${name}`,
          );
          setPokemonList((pre) => [
            ...pre,
            {
              id: res.data.id,
              name: res.data.name,
              image: res.data.sprites.front_default,
            },
          ]);
        });
      } catch (error) {
        console.log(error);
      }
    };
    getPokemons();
    return () => controller.abort();
  }, [newGame]);

  // duplicate current pokemonList to create pairs and switch their index
  useEffect(() => {
    let duplicatedPokemonList: Pokemon[] = [];
    let changedIndexPokemonList: Pokemon[] = [];

    if (pokemonList.length === NUMBER_OF_PAIR) {
      duplicatedPokemonList = [...pokemonList, ...pokemonList];
      while (duplicatedPokemonList.length !== 0) {
        const startIndex = Math.floor(
          Math.random() * duplicatedPokemonList.length,
        );
        changedIndexPokemonList.push(
          duplicatedPokemonList.splice(startIndex, 1)[0],
        );
      }
      setPokemonList(changedIndexPokemonList);
    }
  }, [pokemonList]);

  // countdown timer
  useEffect(() => {
    if (!gameStarted) return;

    const interval = setInterval(() => {
      setTimeLeft((preTimeLeft) => {
        if (preTimeLeft !== 0) return preTimeLeft - 1;
        clearInterval(interval);
        return 0;
      });
    }, 1000);

    if (gameEnded) clearInterval(interval);

    return () => {
      clearInterval(interval);
    };
  }, [gameStarted, gameEnded, newGame]);

  const addSelectedCard = useCallback(
    ({ pokemonId, index }: { pokemonId: number; index: number }) => {
      if (SelectedBalls.index.includes(index)) return;
      setSelectedBalls((preCards) => {
        return {
          pokemonId: [...preCards.pokemonId, pokemonId],
          index: [...preCards.index, index],
        };
      });
    },
    [SelectedBalls],
  );

  const handleTransitionEnd = useCallback(() => {
    setTransitiondEnd({ status: true });
  }, []);

  useEffect(() => {
    const { pokemonId, index } = SelectedBalls;
    if (index.length === 2) {
      if (
        pokemonId[pokemonId.length - 1] === pokemonId[pokemonId.length - 2] &&
        index[index.length - 1] !== index[index.length - 2]
      ) {
        setScore((preScore) => preScore + 1);
        setCorrectPairs((prePairs) => [
          ...prePairs,
          [index[index.length - 1], index[index.length - 2]],
        ]);
      }
      setSelectedBalls({
        pokemonId: [],
        index: [],
      });
    }
  }, [isTransitionEnd]);

  const handlePlayAgain = useCallback(() => {
    setScore(0);
    setTimeLeft(TIME_IN_SECOND);
    setPokemonList([]);
    setCorrectPairs([]);
    setNewGame((pre) => pre + 1);
  }, []);

  return (
    <div className="relative bg-slate300">
      {gameStarted ? (
        <>
          <div className="container">
            <ScoreBoard score={score} timeLeft={timeLeft} />
            <PokemonList
              pokemonList={pokemonList}
              SelectedBalls={SelectedBalls}
              addSelectedCard={addSelectedCard}
              correctPairs={correctPairs}
              handleTransitionEnd={handleTransitionEnd}
            />
            {gameEnded && (
              <GameEndedModal
                score={score}
                timeLeft={timeLeft}
                handlePlayAgain={handlePlayAgain}
                setGameStarted={setGameStarted}
              />
            )}
          </div>
        </>
      ) : (
        <HomePage setGameStarted={setGameStarted} />
      )}
    </div>
  );
};

export default App;
