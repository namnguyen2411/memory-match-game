interface Props {
  score: number;
}

const ScoreBoard = ({ score }: Props) => {
  return (
    <section className="mt-16">
      <div className="flex items-center justify-between">
        <div className="w-[80%] border-2 border-red-200">Time</div>
        <div className="w-[10%] border-2 border-red-200">{score}</div>
      </div>
    </section>
  );
};

export default ScoreBoard;
