import { memo } from 'react';

interface Props {
  score: number;
  timeLeft: number;
  isGamePaused: boolean;
  setGamePause: React.Dispatch<React.SetStateAction<boolean>>;
  handlePlayAgain: () => void;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const Modal = ({
  score,
  timeLeft,
  isGamePaused,
  setGamePause,
  handlePlayAgain,
  setGameStarted,
}: Props) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-[1px]">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black p-10 font-bold text-white">
        <div className="flex h-full flex-col justify-around">
          <p>
            POINTS <span className="float-right">{score}</span>
          </p>
          <p>
            TIME LEFT <span className="float-right">{timeLeft}</span>
          </p>
          <p>
            TOTAL
            <span className="float-right text-primary">{timeLeft + score}</span>
          </p>
          <div className="item-center flex justify-between text-lg">
            {isGamePaused ? (
              <button
                onClick={() => setGamePause(false)}
                className="mx-auto cursor-pointer rounded-2xl border-2 bg-white px-4 py-2 text-primary shadow-sm shadow-white"
              >
                Resume
              </button>
            ) : (
              <>
                <button
                  onClick={handlePlayAgain}
                  className="cursor-pointer rounded-2xl border-2 bg-white px-4 py-2 text-primary shadow-sm shadow-white"
                >
                  Play Again
                </button>
                <button
                  onClick={() => setGameStarted(false)}
                  className="cursor-pointer rounded-2xl border-2 bg-white px-4 py-2 text-primary shadow-sm shadow-white"
                >
                  Quit Game
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Modal);
