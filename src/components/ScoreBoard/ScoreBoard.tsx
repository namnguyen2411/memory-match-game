interface Props {
  score: number;
  timeLeft: number;
}

const ScoreBoard = ({ score, timeLeft }: Props) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <div className="w-[80%] border-2 border-red-200">Time</div>
        <div className="item-center flex w-[10%] justify-evenly border-2 border-red-200">
          <p>POINTS: </p>
          <p>{score}</p>
        </div>
      </div>
    </section>
  );
};

export default ScoreBoard;
