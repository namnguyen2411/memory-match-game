import { useState, useEffect } from 'react';
import axios from 'axios';
import { PokemonList } from './components';

interface Pokemon {
  id: number;
  name: string;
  image: string;
}

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const NUMBER_OF_CARD = 8;

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const getPokemons = async () => {
      try {
        const res = await axios.get(
          'https://pokeapi.co/api/v2/pokemon?limit=4&offset=0',
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
    let tempPokemonList: Pokemon[] = [];
    let tempPokemonList2: Pokemon[] = [];

    if (pokemonList.length === NUMBER_OF_CARD / 2) {
      tempPokemonList = [...pokemonList, ...pokemonList];
      while (tempPokemonList.length !== 0) {
        const startIndex = Math.floor(Math.random() * tempPokemonList.length);
        tempPokemonList2.push(tempPokemonList.splice(startIndex, 1)[0]);
      }
      setPokemonList(tempPokemonList2);
    }
  }, [pokemonList]);

  return (
    <div>
      <h1 className="text-center font-bold text-cyan-500">
        Memory Card Game - Version Pokemon
      </h1>
      <PokemonList />
    </div>
  );
};

export default App;
