interface Props {
  score: number;
  timeLeft: number;
}

const ScoreBoard = ({ score, timeLeft }: Props) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-center gap-80">
        <div className="item-center flex gap-10 border-2 border-red-200">
          <p>TIME: </p>
          <p>{timeLeft} s</p>
        </div>
        <div className="item-center flex gap-10 border-2 border-red-200">
          <p>POINTS: </p>
          <p>{score}</p>
        </div>
      </div>
    </section>
  );
};

export default ScoreBoard;
