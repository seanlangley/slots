import { useEffect, useState } from "react"
import { Cherry, Apple, Banana } from "./Icons"
import styled from "@emotion/styled"

type Fruit = {
  type: string
  multiplier: number
  img: string
}

const Fruits: Fruit[] = [
  {
    type: "Cherry",
    multiplier: 2,
    img: Cherry,
  },
  {
    type: "Apple",
    multiplier: 4,
    img: Apple,
  },
  {
    type: "Banana",
    multiplier: 8,
    img: Banana,
  },
]

type FruitMap = {
  [type: string]: Fruit
}

const numFruits = 120
const getRand = () => Math.floor(Math.random() * 3)

const createFruitMap = () => {
  let fruitMap: FruitMap = {}
  Fruits.forEach((fruit) => {
    fruitMap[fruit.type] = fruit
  })
  return fruitMap
}

type FoundType = {
  [type: string]: number
}

const getNumFound = (fruits: Fruit[]) => {
  let found: FoundType = {}
  for (let i = 0; i < fruits.length; i++) {
    const { type } = fruits[i]
    if (type in found) {
      found[type]++
    } else {
      found[type] = 1
    }
  }
  return found
}

const fruitMap = createFruitMap()
const costPerRoll = 100

const calculateWinnnings = (fruits: Fruit[]) => {
  const winningFruits = [
    fruits[0],
    fruits[numFruits / 3],
    fruits[(numFruits / 3) * 2],
  ]
  const numFound = getNumFound(winningFruits)
  let multiplier = 0
  Object.keys(numFound).forEach((type) => {
    if (numFound[type] === 2) multiplier = fruitMap[type].multiplier
    if (numFound[type] === 3) multiplier = fruitMap[type].multiplier * 2
  })
  return costPerRoll * (multiplier - 1)
}

const App = () => {
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [winnings, setWinnings] = useState<number>(1000)
  const [rollStarted, setRollStarted] = useState(false)
  const [speeds, setSpeeds] = useState<number[]>([])

  const handleRoll = () => {
    if (rollStarted) return
    const newSpeeds = Array.from(Array(3))
      .map(() => Math.floor(Math.random() * 10) + 1)
      .sort((a, b) => a - b)
    const newFruits = Array.from(Array(numFruits)).map(() => Fruits[getRand()])
    setSpeeds(newSpeeds)
    setFruits(newFruits)
    setRollStarted(true)
    setTimeout(() => {
      setWinnings((winnings) => calculateWinnnings(newFruits) + winnings)
    }, Math.max.apply(Math, newSpeeds) * 1000)
  }

  return (
    <Container>
      <AppHeader>
        <SlotContainer>
          {rollStarted &&
            Array.from(Array(3)).map((_, i) => (
              <FruitColumn
                key={i}
                fruits={fruits.slice(
                  (i * numFruits) / 3,
                  (numFruits / 3) * (i + 1)
                )}
                speed={speeds[i]}
              />
            ))}
        </SlotContainer>
        <button type="submit" onClick={handleRoll}>
          Roll
        </button>
        <button type="submit" onClick={() => setRollStarted(false)}>
          Reset Roll
        </button>
        <p>Cost per roll: {costPerRoll}</p>
        <p>Current winnings: {winnings.toString()}</p>
      </AppHeader>
    </Container>
  )
}

const FruitColumn = ({ fruits, speed }: { fruits: Fruit[]; speed: number }) => {
  const [numRows, setNumRows] = useState(0)
  useEffect(() => {
    setNumRows(numFruits / 3 - 1)
  }, [])
  return (
    <Column numRows={numRows} speed={speed}>
      {fruits.map((fruit, i) => (
        <FruitImg key={i} src={fruit.img} />
      ))}
    </Column>
  )
}

const FruitImg = styled.img`
  width: 100px;
  height: 100px;
`

const SlotContainer = styled.div`
  display: flex;
  width: 300px;
  height: 100px;
  overflow: hidden;
`

const Column = styled.div`
  ${({ numRows, speed }: { numRows: number; speed: number }) => `
  transform: translate(0px, calc(100px * (-${numFruits / 3 - 1} + ${numRows})));
  transition: transform ${speed}s; 
  `}
  display: flex;
  flex-direction: column;
`

const AppHeader = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`

const Container = styled.div`
  text-align: center;
`

export default App
