import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PokemonList, ScoreBoard } from './components';
import { Pokemon } from './interface';

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [score, setScore] = useState(0);
  // const [time, setTime] = useState(0);
  // const [isBallOpen, setBallOpen] = useState(false);
  const NUMBER_OF_PAIR = 4;

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
  }, []);

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

  console.log(cardIndex);
  const getCardId = useCallback((id: number) => {
    setCardIndex((preIndex) => {
      if (preIndex === 0) return id;
      if (preIndex === id) setScore((preScore) => preScore + 1);
      return 0;
    });
  }, []);

  return (
    <div>
      <h1 className="text-center font-bold text-cyan-500">
        Memory Card Game - Version Pokemon
      </h1>
      <ScoreBoard score={score} />
      <PokemonList pokemonList={pokemonList} getCardId={getCardId} />
    </div>
  );
};

export default App;
