import { memo } from 'react';
import { Pokemon, CardInfo } from '@/interface';
interface Props {
  pokemon: Pokemon;
  index: number;
  SelectedBalls: CardInfo;
  addSelectedCard: ({
    pokemonId,
    index,
  }: {
    pokemonId: number;
    index: number;
  }) => void;
  correctPairs: number[][];
  handleTransitionEnd: () => void;
}

const PokeBall = ({
  pokemon,
  SelectedBalls,
  addSelectedCard,
  index,
  correctPairs,
  handleTransitionEnd,
}: Props) => {
  const { id, name, image } = pokemon;

  return (
    <div
      className="pokeball relative col-span-1 aspect-square h-[110px] cursor-pointer rounded-full"
      onClick={() => {
        addSelectedCard({ pokemonId: id, index });
      }}
    >
      <img
        src={image}
        alt={name}
        style={{
          opacity:
            SelectedBalls.index.includes(index) ||
            correctPairs.flat().includes(index)
              ? 1
              : 0,
        }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition duration-300"
      />
      <div
        className={`z-10 flex h-[47%] items-end justify-center rounded-t-full bg-red600 transition duration-300${
          correctPairs.flat().includes(index) ? ' animate-fade' : ''
        }`}
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: SelectedBalls.index.includes(index)
            ? 'translateY(-80%)'
            : '',
        }}
      >
        <div className="h-[1.2rem] w-10 rounded-t-full bg-slate-300">
          <div className="mt-[1px] h-full w-full rounded-t-full bg-slate-300"></div>
        </div>
      </div>

      <div
        style={{
          opacity: SelectedBalls.index.includes(index) ? 0 : 1,
        }}
        className={`mx-auto flex h-[6%] w-[95%] items-center justify-center bg-black transition duration-300${
          correctPairs.flat().includes(index) ? ' animate-fade' : ''
        }`}
      >
        <div className="flex aspect-square h-12 items-center justify-center rounded-full bg-black">
          <div className="flex aspect-square h-8 items-center justify-center rounded-full bg-white">
            <div className="aspect-square h-4 rounded-full border-2 border-black bg-white"></div>
          </div>
        </div>
      </div>

      <div
        className={`h-[47%] rounded-b-full bg-white transition duration-300${
          correctPairs.flat().includes(index) ? ' animate-fade' : ''
        }`}
        style={{
          transform: SelectedBalls.index.includes(index)
            ? 'translateY(80%)'
            : '',
        }}
      ></div>
    </div>
  );
};

export default memo(PokeBall);
