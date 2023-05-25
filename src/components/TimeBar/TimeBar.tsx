interface Props {
  timeLeft: number;
}

export default function TimeBar({ timeLeft }: Props) {
  return (
    <section>
      <div className="flex items-center justify-evenly gap-40 text-white">
        <div className="item-center flex min-w-[165px] rounded-2xl bg-black px-4 py-2 font-bold">
          <p>
            TIME <span className="ml-10 text-cyan400">{timeLeft} s</span>
          </p>
        </div>
      </div>
    </section>
  );
}
