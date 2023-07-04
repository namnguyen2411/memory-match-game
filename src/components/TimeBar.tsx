import { memo } from 'react'

interface Props {
  INITIAL_TIME: number
  gamePause: boolean
  gameEnd: boolean
}
interface animationDurationVariants {
  [key: number]: string
}

export default memo(function TimeBar({ INITIAL_TIME, gamePause, gameEnd }: Props) {
  // Always use complete class names
  const animationDurationVariants: animationDurationVariants = {
    60: 'animation-duration-[60s]',
    90: 'animation-duration-[90s]'
  }

  return (
    <section>
      <div className="relative mx-auto h-8 w-4/5 overflow-hidden rounded-full border-4 border-black">
        <span
          className={`absolute inset-0 animate-timebar ${
            animationDurationVariants[INITIAL_TIME]
          } rounded-full bg-cyan400 ${gamePause || gameEnd ? 'pause' : ''}`}
        />
      </div>
    </section>
  )
})
