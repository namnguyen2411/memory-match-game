import { memo } from 'react';
import pokemon_logo from '../../assets/images/pokemon_logo.svg';
import version from '../../assets/images/version.png';

interface Props {
  setGameStart: React.Dispatch<React.SetStateAction<boolean>>;
}

const HomePage = ({ setGameStart }: Props) => {
  return (
    <div className="h-screen w-screen bg-black">
      <section className="item-center container flex flex-col gap-10 pt-[5%] text-center text-white">
        <h1 className="text-cyan400">MEMORY MATCH GAME</h1>
        <div className="mx-auto flex w-[80%] items-center">
          {/* pokeball */}
          <div className="aspect-square h-24 animate-spin-slow rounded-full">
            {/* upper part */}
            <div className="z-10 flex h-[47%] items-end justify-center rounded-t-full bg-red600"></div>
            {/* middle part */}
            <div className="mx-auto flex h-[6%] w-[95%] items-center justify-center bg-black">
              <div className="flex aspect-square h-12 items-center justify-center rounded-full bg-black">
                <div className="flex aspect-square h-8 items-center justify-center rounded-full bg-white">
                  <div className="aspect-square h-4 rounded-full border-2 border-black bg-white"></div>
                </div>
              </div>
            </div>
            {/* lower part */}
            <div className="h-[47%] rounded-b-full bg-white"></div>
          </div>
          {/* logo */}
          <div className="mx-auto w-[500px]">
            <img src={pokemon_logo} alt="pokemon-logo" className="w-full" />
            <img src={version} className="mx-auto w-[300px]" />
          </div>
          {/* pokeball */}
          <div className="aspect-square h-24 animate-spin-slow rounded-full">
            {/* upper part */}
            <div className="z-10 flex h-[47%] items-end justify-center rounded-t-full bg-red600"></div>
            {/* middle part */}
            <div className="mx-auto flex h-[6%] w-[95%] items-center justify-center bg-black">
              <div className="flex aspect-square h-12 items-center justify-center rounded-full bg-black">
                <div className="flex aspect-square h-8 items-center justify-center rounded-full bg-white">
                  <div className="aspect-square h-4 rounded-full border-2 border-black bg-white"></div>
                </div>
              </div>
            </div>
            {/* lower part */}
            <div className="h-[47%] rounded-b-full bg-white"></div>
          </div>
        </div>
        <button
          onClick={() => setGameStart(true)}
          className="hover:glowing mx-auto mt-10 w-fit rounded-lg px-6 py-2 text-5xl font-semibold"
        >
          START
        </button>
      </section>
    </div>
  );
};

export default memo(HomePage);
