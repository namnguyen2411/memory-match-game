import { Pokemon } from '@/interface';
import pokeball from '../../assets/images/pokeball.png';

interface Props {
  pokemon: Pokemon;
  getCardId: (id: number) => void;
}

const PokemonCard = ({ pokemon, getCardId }: Props) => {
  const { id, name, image } = pokemon;

  return (
    <div
      onClick={() => {
        getCardId(id);
      }}
      className="card hover:rotate-y-180 col-span-1 aspect-square h-40 rounded-full border-2 border-red-300"
    >
      <div className="front-card grid place-items-center">
        <img src={pokeball} alt="pokeball" />
      </div>
      <div className="back-card grid place-items-center">
        <img src={image} alt={name} />
      </div>
    </div>
  );
};

export default PokemonCard;
