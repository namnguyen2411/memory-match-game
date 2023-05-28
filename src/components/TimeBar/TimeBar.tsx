interface Props {
  INIT_TIME: number;
  gamePause: boolean;
}

export default function TimeBar({ INIT_TIME, gamePause }: Props) {
  return (
    <section>
      <div className="relative mx-auto h-8 w-4/5 overflow-hidden rounded-full border-4 border-black">
        <span
          className={`absolute inset-0 animate-timebar rounded-full bg-cyan400 animation-duration-[${INIT_TIME}s] ${
            gamePause ? 'pause' : ''
          }`}
        />
      </div>
    </section>
  );
}
