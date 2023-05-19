import { memo } from 'react';
interface Props {
  score: number;
  timeLeft: number;
}

const ScoreBoard = ({ score, timeLeft }: Props) => {
  return (
    <section className="pt-4">
      <div className="flex items-center justify-evenly gap-40 text-white">
        <div className="item-center flex rounded-2xl bg-black px-4 py-2 font-bold">
          <p>
            TIME <span className="ml-10 text-primary">{timeLeft} s</span>
          </p>
        </div>
        <div className="item-center flex rounded-2xl bg-black px-4 py-2 font-bold">
          <p>
            POINTS <span className="ml-10 text-primary">{score}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default memo(ScoreBoard);
