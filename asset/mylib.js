const CellConfig = {}

if (typeof window === 'object') {
  CellConfig.cellSize = 7
  CellConfig.viewHeight = Math.floor(window.innerHeight / 100)
  CellConfig.aspect = Math.floor(window.innerWidth / window.innerHeight * 10) / 10
}

const directions = {
  odd: [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 1 },
    { x: -1, y: 0 },
    { x: -1, y: -1 }
  ],
  even: [
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 0, y: -1 }
  ]
}

const randomIn = (min, max) => (
  Math.floor(
    Math.random() * (max - min + 1)
  ) + min
)

const rangeIn = (min, max) => (
  [...new Array(max - min + 1).keys()].map(i => (i + min))
)

const calcNextPos = positionArray => {
  let basePosition = positionArray[randomIn(0, positionArray.length - 1)]
  let directionType = basePosition.y % 2 ? 'odd' : 'even'
  let randomDirection = randomIn(0, 5)
  let movement = directions[directionType][randomDirection]
  return { x: basePosition.x + movement.x, y: basePosition.y + movement.y }
}

const getNextPos = positionArray => {
  let nextPos = calcNextPos(positionArray) // {x, y}
  while (!verifyPos(positionArray, nextPos)) {
    nextPos = calcNextPos(positionArray)
  }
  return nextPos
}

const configurePosition = (currentCells, newCells) => {
  let positionArray = currentCells.map(cell => ({ x: cell.x, y: cell.y  }))
  return newCells.map(newCell => {
    let cellPos = getNextPos(positionArray)
    let completeNewCell = Object.assign({}, newCell, toWindowPos(cellPos))
    positionArray = positionArray.concat(cellPos)
    // {id, x, y}
    return completeNewCell
  })
}

const verifyPos = (positionList, targetPosition) => (
  positionInsideBorder(targetPosition) && !positionConflict(positionList, targetPosition)
)
const positionConflict = (positionList, targetCell) => (
  positionList.some(position => (
    position.x === targetCell.x && position.y === targetCell.y
  ))
)

const positionInsideBorder = cell => {
  let borderLevel = 45
  let winPos = toWindowPos(cell)
  let realX = winPos.x * CellConfig.cellSize * 3 / 4 * CellConfig.viewHeight
  let realY = winPos.y * CellConfig.cellSize * 3 / 4 * CellConfig.viewHeight
  let isXLegal = realX > Math.floor(-borderLevel * CellConfig.viewHeight * CellConfig.aspect) + 1 &&
    realX < Math.floor(borderLevel * CellConfig.viewHeight * CellConfig.aspect) - 1
  let isYLegal = realY > Math.floor(-borderLevel * CellConfig.viewHeight) &&
    realY < Math.floor(borderLevel * CellConfig.viewHeight)
  return isXLegal && isYLegal
}

const toWindowPos = pos => (
  pos.y % 2 ? { x: pos.x * 4 - 2, y: pos.y * 3 } : { x: pos.x * 4, y: pos.y * 3 }
)

if (typeof module === 'object') {
  module.exports = { rangeIn, calcNextPos, positionConflict }
}
