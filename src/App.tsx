import { useState, useEffect, Suspense, lazy } from 'react'
import axios from 'axios'
import { HomeScreen } from './components'
import { Pokemon } from './interface'
import { Loading } from './components'

type ModuleType = typeof import('./components/InGameScreen')

const App = () => {
  const NUMBER_OF_PAIR = 10

  const [gameStart, setGameStart] = useState(false)
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([])
  const [newGame, setNewGame] = useState(0)

  const InGameScreen = lazy(() => delay(import('./components/InGameScreen')))
  const delay = async (promise: Promise<ModuleType>) => {
    await new Promise<void>((resolve) => {
      if (pokemonList.length === NUMBER_OF_PAIR * 2) resolve()
    })
    return promise
  }

  useEffect(() => {
    const controller = new AbortController()
    const randomNumber = Math.floor(Math.random() * 400)
    const getPokemons = async () => {
      try {
        const res = await axios.get(
          // random a number to get different pokemons
          `https://pokeapi.co/api/v2/pokemon?limit=${NUMBER_OF_PAIR}&offset=${randomNumber}`,
          { signal: controller.signal }
        )

        res.data.results.forEach(async ({ name }: { name: string }) => {
          const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
          setPokemonList((preList) => [
            ...preList,
            {
              id: res.data.id,
              name: res.data.name,
              image: res.data.sprites.front_default
            }
          ])
        })
      } catch (error) {
        console.log(error)
      }
    }
    getPokemons()
    return () => controller.abort()
  }, [newGame])

  // duplicate current pokemonList to create pairs and switch their index
  if (pokemonList.length === NUMBER_OF_PAIR) {
    let duplicatedList: Pokemon[] = []
    const changedIndexList: Pokemon[] = []
    duplicatedList = [...pokemonList, ...pokemonList]

    while (duplicatedList.length !== 0) {
      const startIndex = Math.floor(Math.random() * duplicatedList.length)
      changedIndexList.push(duplicatedList.splice(startIndex, 1)[0])
    }
    setPokemonList(changedIndexList)
  }

  return (
    <>
      {!gameStart ? (
        <HomeScreen setGameStart={setGameStart} />
      ) : (
        <Suspense fallback={<Loading />}>
          <InGameScreen
            NUMBER_OF_PAIR={NUMBER_OF_PAIR}
            gameStart={gameStart}
            setGameStart={setGameStart}
            setPokemonList={setPokemonList}
            pokemonList={pokemonList}
            setNewGame={setNewGame}
          />
        </Suspense>
      )}
    </>
  )
}

export default App
