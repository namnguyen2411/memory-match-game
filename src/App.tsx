import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HomePage, PokeBall, TimeBar, Modal, LoadingModal } from './components';
import { Pokemon, PokeBallArrayInfo } from './interface';

interface KeyboardEvent {
  key: string;
  code: string;
}

const App = () => {
  const NUMBER_OF_PAIR = 9;
  const INITIAL_TIME = 90;
  const INITIAL_POKEBALL_INFO: PokeBallArrayInfo = {
    pokemonId: [],
    index: [],
  };

  const [isGameStarted, setGameStart] = useState(false);
  const [isGamePaused, setGamePause] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [SelectedBalls, setSelectedBalls] = useState<PokeBallArrayInfo>(
    INITIAL_POKEBALL_INFO,
  );
  const [correctPairs, setCorrectPairs] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME);
  const [newGame, setNewGame] = useState(0);

  const gameEnded: boolean = score === NUMBER_OF_PAIR || timeLeft === 0;

  useEffect(() => {
    const controller = new AbortController();
    const randomNumber = Math.floor(Math.random() * 400);
    const getPokemons = async () => {
      try {
        const res = await axios.get(
          // random a number to get different pokemons
          `https://pokeapi.co/api/v2/pokemon?limit=${NUMBER_OF_PAIR}&offset=${randomNumber}`,
          { signal: controller.signal },
        );

        res.data.results.forEach(async ({ name }: { name: string }) => {
          const res = await axios.get(
            `https://pokeapi.co/api/v2/pokemon/${name}`,
          );
          setPokemonList((preList) => [
            ...preList,
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
    if (pokemonList.length === NUMBER_OF_PAIR) {
      let duplicatedPokemonList: Pokemon[] = [];
      let changedIndexPokemonList: Pokemon[] = [];
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
    if (isGameStarted) {
      // countdown timer
      const interval = setInterval(() => {
        setTimeLeft((preTimeLeft) => {
          if (preTimeLeft !== 0) return preTimeLeft - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
      if (gameEnded || isGamePaused) clearInterval(interval);
      // pause game when user press ESC
      const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Escape' || gameEnded) return;
        setGamePause(!isGamePaused);
      };
      document.addEventListener('keyup', handler);

      return () => {
        clearInterval(interval);
        document.removeEventListener('keyup', handler);
      };
    }
  }, [isGameStarted, isGamePaused, gameEnded]);

  // wait 100ms after the pokeball animation end (300ms) then compare 2 pokeballs
  useEffect(() => {
    if (SelectedBalls.index.length !== 2) return;

    const timerId = setTimeout(() => {
      const { pokemonId, index } = SelectedBalls;
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
      setSelectedBalls(INITIAL_POKEBALL_INFO);
    }, 400);

    return () => clearTimeout(timerId);
  }, [SelectedBalls]);

  // check if user open a pokeball with same index, if not add it to SelectedBalls
  const checkBallIndex = useCallback(
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

  const handlePlayAgain = useCallback(() => {
    setPokemonList([]);
    setSelectedBalls(INITIAL_POKEBALL_INFO);
    setTimeLeft(INITIAL_TIME);
    setScore(0);
    setCorrectPairs([]);
    setNewGame((pre) => pre + 1);
  }, []);

  const handleQuitGame = useCallback(() => {
    handlePlayAgain();
    setGameStart(false);
  }, []);

  return (
    <div className="relative bg-slate300">
      {isGameStarted ? (
        <>
          {pokemonList.length === NUMBER_OF_PAIR * 2 ? (
            <div className="container">
              <TimeBar timeLeft={timeLeft} />
              <section className="mt-16 pb-10">
                <div className="grid grid-cols-5 place-items-center gap-[90px]">
                  {pokemonList.map((pokemon: Pokemon, index) => (
                    <PokeBall
                      key={index}
                      pokemon={pokemon}
                      SelectedBalls={SelectedBalls}
                      checkBallIndex={checkBallIndex}
                      index={index}
                      correctPairs={correctPairs}
                    />
                  ))}
                </div>
              </section>
              {(isGamePaused || gameEnded) && (
                <Modal
                  score={score}
                  timeLeft={timeLeft}
                  isGamePaused={isGamePaused}
                  setGamePause={setGamePause}
                  handlePlayAgain={handlePlayAgain}
                  handleQuitGame={handleQuitGame}
                />
              )}
            </div>
          ) : (
            <LoadingModal />
          )}
        </>
      ) : (
        <HomePage setGameStart={setGameStart} />
      )}
    </div>
  );
};

export default App;
