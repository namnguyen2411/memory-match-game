import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { PokemonList, ScoreBoard } from './components';
import { Pokemon, CardInfo } from './interface';

const App = () => {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [selectedCards, setSelectedCards] = useState<CardInfo>({
    pokemonId: [],
    index: [],
  });
  const [correctPairs, setCorrectPairs] = useState<number[]>([]);
  const [isTransitionEnd, setTransitiondEnd] = useState(false);
  const [score, setScore] = useState(0);
  // const [time, setTime] = useState(0);
  const NUMBER_OF_PAIR = 2;

  console.log('correctPairs', correctPairs);
  console.log(selectedCards);

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

  useEffect(() => {
    const { pokemonId, index } = selectedCards;
    if (index.length === 2) {
      console.warn('So sanh');
      if (
        pokemonId[pokemonId.length - 1] === pokemonId[pokemonId.length - 2] &&
        index[index.length - 1] !== index[index.length - 2]
      ) {
        setScore((preScore) => preScore + 1);
        setCorrectPairs((preIndex) => [
          ...preIndex,
          index[index.length - 1],
          index[index.length - 2],
        ]);
      }
      setSelectedCards({
        pokemonId: [],
        index: [],
      });
    }
  }, [selectedCards]);

  const addSelectedCard = useCallback(
    ({ pokemonId, index }: { pokemonId: number; index: number }) => {
      if (selectedCards.index.includes(index)) return;
      setSelectedCards((preCards) => {
        return {
          pokemonId: [...preCards.pokemonId, pokemonId],
          index: [...preCards.index, index],
        };
      });
      // checkMatching();
    },
    [selectedCards],
  );

  return (
    <div className="bg-slate-300">
      <div className="container">
        <h1 className="text-center font-bold text-cyan-500">
          Memory Match Game - Version Pokemon
        </h1>
        <ScoreBoard score={score} />
        <PokemonList
          pokemonList={pokemonList}
          selectedCards={selectedCards}
          addSelectedCard={addSelectedCard}
          correctPairs={correctPairs}
        />
      </div>
    </div>
  );
};

export default App;
