import { Pokemon, CardInfo } from '@/interface';
import { PokemonCard } from '..';

interface Props {
  pokemonList: Pokemon[];
  SelectedBalls: CardInfo;
  addSelectedCard: ({
    pokemonId,
    index,
  }: {
    pokemonId: number;
    index: number;
  }) => void;
  correctPairs: number[];
  handleTransitionEnd: () => void;
}

const PokemonList = ({
  pokemonList,
  SelectedBalls,
  addSelectedCard,
  correctPairs,
  handleTransitionEnd,
}: Props) => {
  return (
    <section className="mt-20">
      <div className="grid grid-cols-6 gap-28">
        {pokemonList.map((pokemon: Pokemon, index) => (
          <PokemonCard
            key={index}
            pokemon={pokemon}
            SelectedBalls={SelectedBalls}
            addSelectedCard={addSelectedCard}
            index={index}
            correctPairs={correctPairs}
            handleTransitionEnd={handleTransitionEnd}
          />
        ))}
      </div>
    </section>
  );
};

export default PokemonList;
