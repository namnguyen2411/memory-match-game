import { Pokemon, CardInfo } from '@/interface';
import { PokemonCard } from '..';

interface Props {
  pokemonList: Pokemon[];
  selectedCards: CardInfo;
  addSelectedCard: ({
    pokemonId,
    index,
  }: {
    pokemonId: number;
    index: number;
  }) => void;
  correctPairs: number[];
}

const PokemonList = ({
  pokemonList,
  selectedCards,
  addSelectedCard,
  correctPairs,
}: Props) => {
  return (
    <section className="mt-20">
      <div className="grid grid-cols-6 gap-28">
        {pokemonList.map((pokemon: Pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            selectedCards={selectedCards}
            addSelectedCard={addSelectedCard}
            index={index}
            correctPairs={correctPairs}
          />
        ))}
      </div>
    </section>
  );
};

export default PokemonList;
