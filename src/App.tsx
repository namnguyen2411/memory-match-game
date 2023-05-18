import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PokemonList, ScoreBoard } from './components';
import { Pokemon, CardInfo } from './interface';

const App = () => {
  const TIME = 180;
  const NUMBER_OF_PAIR = 2;

  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [SelectedBalls, setSelectedBalls] = useState<CardInfo>({
    pokemonId: [],
    index: [],
  });
  const [correctPairs, setCorrectPairs] = useState<number[][]>([]);
  const [isTransitionEnd, setTransitiondEnd] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [newGame, setNewGame] = useState(0);

  const gameEnded = score === NUMBER_OF_PAIR || timeLeft === 0;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    // random a page number to get different pokemon
    const randomNumb = Math.floor(Math.random() * 400);

    const getPokemons = async () => {
      try {
        const res = await axios.get(
          `https://pokeapi.co/api/v2/pokemon?limit=${NUMBER_OF_PAIR}&offset=${randomNumb}`,
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

    return () => {
      controller.abort();
    };
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
    setTransitiondEnd(false);
  }, [isTransitionEnd]);

  const handleTransitionEnd = useCallback(() => {
    setTransitiondEnd(true);
  }, []);

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

  const handlePlayAgain = () => {
    setScore(0);
    setTimeLeft(TIME);
    setPokemonList([]);
    setCorrectPairs([]);
    setNewGame((pre) => pre + 1);
  };

  return (
    <div className="relative bg-slate-300">
      <div className="container">
        <h1 className="text-center font-bold text-cyan-500">
          Memory Match Game - Pokémon Version
        </h1>
        <ScoreBoard score={score} timeLeft={timeLeft} />
        <PokemonList
          pokemonList={pokemonList}
          SelectedBalls={SelectedBalls}
          addSelectedCard={addSelectedCard}
          correctPairs={correctPairs}
          handleTransitionEnd={handleTransitionEnd}
        />

        {gameEnded && (
          <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-[1px]">
            <div className="absolute left-1/2 top-1/2 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2 border-2 p-10 ">
              <div className="flex h-full flex-col justify-around">
                <p>
                  Points: <span className="float-right">{score}</span>
                </p>
                <p>
                  Time left: <span className="float-right">{timeLeft}</span>
                </p>
                <p>
                  Total: <span className="float-right">{timeLeft + score}</span>
                </p>
                <button
                  onClick={handlePlayAgain}
                  className="mx-auto block cursor-pointer border-2 bg-red-300 px-4 py-2"
                >
                  Play Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
