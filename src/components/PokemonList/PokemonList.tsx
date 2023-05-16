import { Pokemon } from '@/interface';
import { PokemonCard } from '..';

interface Props {
  pokemonList: Pokemon[];
  getCardId: (id: number) => void;
}

const PokemonList = ({ pokemonList, getCardId }: Props) => {
  return (
    <section>
      <div className="grid grid-cols-6 gap-10 p-10">
        {pokemonList.map((pokemon: Pokemon, index) => (
          <PokemonCard key={index} pokemon={pokemon} getCardId={getCardId} />
        ))}
      </div>
    </section>
  );
};

export default PokemonList;
