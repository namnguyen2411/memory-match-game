import { useEffect, useState } from 'react'
import { PokeBallInfoArray, Pokemon } from '@/interface'
import { Modal, PokeBall, PokeBallList, TimeBar } from '.'

interface Props {
  NUMBER_OF_PAIR: number
  gameStart: boolean
  setGameStart: (val: boolean) => void
  pokemonList: Pokemon[]
  setPokemonList: (val: []) => void
  setNewGame: React.Dispatch<React.SetStateAction<number>>
}

interface KeyboardEvent {
  key: string
  code: string
}

export default function InGameScreen({
  NUMBER_OF_PAIR,
  gameStart,
  setGameStart,
  pokemonList,
  setPokemonList,
  setNewGame
}: Props) {
  const POINTS_PER_PAIR = 10
  const POINTS_FOR_MAX_PAIRS = NUMBER_OF_PAIR * POINTS_PER_PAIR
  const INITIAL_TIME = 60
  // or 90 because it value need to match animationDurationVariants variable in Timebar components
  const INITIAL_POKEBALL_INFO: PokeBallInfoArray = {
    pokemonId: [],
    index: []
  }

  const [SelectedBalls, setSelectedBalls] = useState<PokeBallInfoArray>(INITIAL_POKEBALL_INFO)
  const [correctPairs, setCorrectPairs] = useState<number[][]>([])
  const [timeLeft, setTimeLeft] = useState(INITIAL_TIME)
  const [gamePause, setGamePause] = useState(false)

  const gameEnd: boolean = correctPairs.length * POINTS_PER_PAIR === POINTS_FOR_MAX_PAIRS || timeLeft === 0

  // wait 100ms after the pokeball animation end (300ms) then compare 2 pokeballs
  useEffect(() => {
    if (SelectedBalls.index.length !== 2) return

    const timerId = setTimeout(() => {
      const { pokemonId, index } = SelectedBalls
      if (
        pokemonId[pokemonId.length - 1] === pokemonId[pokemonId.length - 2] &&
        index[index.length - 1] !== index[index.length - 2]
      ) {
        setCorrectPairs((prePairs) => [...prePairs, [index[index.length - 1], index[index.length - 2]]])
      }
      setSelectedBalls(INITIAL_POKEBALL_INFO)
    }, 400)

    return () => clearTimeout(timerId)
  }, [SelectedBalls, INITIAL_POKEBALL_INFO])

  useEffect(() => {
    if (gameStart) {
      // start countdown timer
      const interval = setInterval(() => {
        setTimeLeft((preTimeLeft) => {
          if (preTimeLeft !== 0) return preTimeLeft - 1
          clearInterval(interval)
          return 0
        })
      }, 1000)
      if (gameEnd || gamePause) clearInterval(interval)
      // pause game when user press ESC
      const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Escape' || gameEnd) return
        setGamePause(!gamePause)
      }
      document.addEventListener('keyup', handler)

      return () => {
        clearInterval(interval)
        document.removeEventListener('keyup', handler)
      }
    }
  }, [gameStart, gamePause, gameEnd])

  // check if user open a pokeball with same index, if not add it to SelectedBalls
  const checkBallIndex: ({ pokemonId, index }: { pokemonId: number; index: number }) => void = ({
    pokemonId,
    index
  }: {
    pokemonId: number
    index: number
  }) => {
    if (SelectedBalls.index.includes(index)) return
    setSelectedBalls((preCards) => {
      return {
        pokemonId: [...preCards.pokemonId, pokemonId],
        index: [...preCards.index, index]
      }
    })
  }

  const handlePlayAgain = (): void => {
    setPokemonList([])
    setSelectedBalls(INITIAL_POKEBALL_INFO)
    setTimeLeft(INITIAL_TIME)
    setCorrectPairs([])
    setNewGame((pre: number) => pre + 1)
  }

  const handleQuitGame = (): void => {
    handlePlayAgain()
    setGameStart(false)
  }

  return (
    <div className="relative bg-slate300">
      <div className="container">
        <TimeBar INITIAL_TIME={INITIAL_TIME} gamePause={gamePause} gameEnd={gameEnd} />

        <PokeBallList>
          {pokemonList.map((pokemon: Pokemon, index) => (
            <PokeBall
              key={index}
              pokemon={pokemon}
              SelectedBalls={SelectedBalls}
              checkBallIndex={checkBallIndex}
              index={index}
              correctPairs={correctPairs}
            />
          ))}
        </PokeBallList>

        {(gamePause || gameEnd) && (
          <Modal
            INITIAL_TIME={INITIAL_TIME}
            points={correctPairs.length * POINTS_PER_PAIR}
            timeLeft={timeLeft}
            gamePause={gamePause}
            setGamePause={setGamePause}
            handlePlayAgain={handlePlayAgain}
            handleQuitGame={handleQuitGame}
            gameEnd={gameEnd}
          />
        )}
      </div>
    </div>
  )
}
