interface Props {
  score: number;
  timeLeft: number;
  handlePlayAgain: () => void;
}

const GameEndedModal = ({ score, timeLeft, handlePlayAgain }: Props) => {
  return (
    <div className="fixed left-0 top-0 h-screen w-screen backdrop-blur-[2px]">
      <div className="absolute left-1/2 top-1/2 h-[400px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-black p-10 font-bold text-white">
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
          <button
            onClick={handlePlayAgain}
            className="mx-auto block cursor-pointer rounded-2xl border-2 bg-white px-4 py-2 text-primary shadow-sm shadow-white"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameEndedModal;
