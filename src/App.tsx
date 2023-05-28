import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { HomePage, PokeBall, TimeBar, Modal, LoadingModal } from './components';
import { Pokemon, PokeBallInfoArray } from './interface';

interface KeyboardEvent {
  key: string;
  code: string;
}

const App = () => {
  const NUMBER_OF_PAIR = 10;
  const POINTS_FOR_A_PAIR = 10;
  const POINTS_FOR_MAX_PAIRS = NUMBER_OF_PAIR * POINTS_FOR_A_PAIR;
  const INIT_TIME = 60;
  const INIT_POKEBALL_INFO: PokeBallInfoArray = {
    pokemonId: [],
    index: [],
  };

  const [gameStart, setGameStart] = useState(false);
  const [gamePause, setGamePause] = useState(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [SelectedBalls, setSelectedBalls] =
    useState<PokeBallInfoArray>(INIT_POKEBALL_INFO);
  const [correctPairs, setCorrectPairs] = useState<number[][]>([]);
  const [timeLeft, setTimeLeft] = useState(INIT_TIME);
  const [newGame, setNewGame] = useState(0);

  const gameEnd: boolean =
    correctPairs.length * POINTS_FOR_A_PAIR === POINTS_FOR_MAX_PAIRS ||
    timeLeft === 0;

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
      let duplicatedList: Pokemon[] = [];
      let changedIndexList: Pokemon[] = [];
      duplicatedList = [...pokemonList, ...pokemonList];

      while (duplicatedList.length !== 0) {
        const startIndex = Math.floor(Math.random() * duplicatedList.length);
        changedIndexList.push(duplicatedList.splice(startIndex, 1)[0]);
      }
      setPokemonList(changedIndexList);
    }
  }, [pokemonList]);

  useEffect(() => {
    if (gameStart) {
      // countdown timer
      const interval = setInterval(() => {
        setTimeLeft((preTimeLeft) => {
          if (preTimeLeft !== 0) return preTimeLeft - 1;
          clearInterval(interval);
          return 0;
        });
      }, 1000);
      if (gameEnd || gamePause) clearInterval(interval);
      // pause game when user press ESC
      const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Escape' || gameEnd) return;
        setGamePause(!gamePause);
      };
      document.addEventListener('keyup', handler);

      return () => {
        clearInterval(interval);
        document.removeEventListener('keyup', handler);
      };
    }
  }, [gameStart, gamePause, gameEnd]);

  // wait 100ms after the pokeball animation end (300ms) then compare 2 pokeballs
  useEffect(() => {
    if (SelectedBalls.index.length !== 2) return;

    const timerId = setTimeout(() => {
      const { pokemonId, index } = SelectedBalls;
      if (
        pokemonId[pokemonId.length - 1] === pokemonId[pokemonId.length - 2] &&
        index[index.length - 1] !== index[index.length - 2]
      ) {
        setCorrectPairs((prePairs) => [
          ...prePairs,
          [index[index.length - 1], index[index.length - 2]],
        ]);
      }
      setSelectedBalls(INIT_POKEBALL_INFO);
    }, 400);

    return () => clearTimeout(timerId);
  }, [SelectedBalls]);

  // check if user open a pokeball with same index, if not add it to SelectedBalls
  const checkBallIndex: ({
    pokemonId,
    index,
  }: {
    pokemonId: number;
    index: number;
  }) => void = useCallback(
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

  const handlePlayAgain = useCallback((): void => {
    setPokemonList([]);
    setSelectedBalls(INIT_POKEBALL_INFO);
    setTimeLeft(INIT_TIME);
    setCorrectPairs([]);
    setNewGame((pre) => pre + 1);
  }, []);

  const handleQuitGame = useCallback((): void => {
    handlePlayAgain();
    setGameStart(false);
  }, []);

  return (
    <div className="relative bg-slate300">
      {gameStart ? (
        <>
          {pokemonList.length === NUMBER_OF_PAIR * 2 ? (
            <div className="container">
              <TimeBar INIT_TIME={INIT_TIME} gamePause={gamePause} />
              <section className="mt-14 pb-10">
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
              {(gamePause || gameEnd) && (
                <Modal
                  INITIAL_TIME={INIT_TIME}
                  points={correctPairs.length * POINTS_FOR_A_PAIR}
                  timeLeft={timeLeft}
                  gamePause={gamePause}
                  setGamePause={setGamePause}
                  handlePlayAgain={handlePlayAgain}
                  handleQuitGame={handleQuitGame}
                  gameEnd={gameEnd}
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
