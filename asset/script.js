const { h, app } = hyperapp

const randomIn = (min, max) => (
  Math.floor(
    Math.random() * (max - min + 1)
  ) + min
)

const rangeIn = (min, max) => (
  [...new Array(max - min + 1).keys()].map(i => (i + min))
)

const cellSize = 7
const viewHeight = Math.floor(window.innerHeight/ 100)
const aspect = Math.floor(window.innerWidth / window.innerHeight * 10) / 10
const cx = Math.floor(window.innerWidth / 2)
const cy = Math.floor(window.innerHeight / 2)

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

const cellExists = (cells, target) => (
  cells.some(cell => (
    cell.x === target.x && cell.y === target.y
  ))
)

const cellInsideBorder = cell => {
  let borderLevel = 45
  let winPos = toWindowPos(cell)
  let realX = winPos.x * cellSize * 3 / 4 * viewHeight
  let realY = winPos.y * cellSize * 3 / 4 * viewHeight
  let isXLegal = realX > Math.floor(-borderLevel * viewHeight * aspect) + 1 &&
    realX < Math.floor(borderLevel * viewHeight * aspect) - 1
  let isYLegal = realY > Math.floor(-borderLevel * viewHeight) &&
    realY < Math.floor(borderLevel * viewHeight)
  return isXLegal && isYLegal
}

const shuffle = arr => {
  let i = 0
  while (i < arr.length) {
    let randomIndex = randomIn(0, arr.length - 1)
    let tmp = arr[i]
    arr[i] = arr[randomIndex]
    arr[randomIndex] = tmp
    i++
  }
  return arr
}

const state = {
  cells: [
    { x: 0, y: 0 }
  ]
}

const getNextCell = (targetCell, directionNumber) => {
  let directionBase = targetCell.y % 2 ? 'odd' : 'even'
  let movement = directions[directionBase][directionNumber]
  return { x: targetCell.x + movement.x, y: targetCell.y + movement.y }
}

const getNextLegalMove = cells => {
  let targetCell = cells[randomIn(0, cells.length - 1)]
  let availableDirections = shuffle(rangeIn(0, 5))
  let nextCell = null
  while (!nextCell || cellExists(cells, nextCell) || !cellInsideBorder(nextCell)) {
    nextCell = getNextCell(targetCell, availableDirections.shift())
    if (availableDirections.length === 0) {
      targetCell = cells[randomIn(0, cells.length - 1)]
      availableDirections =shuffle(rangeIn(0, 5))
    }
  }
  return nextCell
}

const cellGrow = (cells, amount) => {
  if (amount > 0 && cells.length < 100) {
    return cellGrow(cells.concat(getNextLegalMove(cells)), amount - 1)
  } else {
    return cells
  }
}

const actions = {
  drawCells: amount => state => {
    return { cells: cellGrow(state.cells, amount) }
  }
}

// pos(position) format { x: additional pUnit, y: additional pUnit}
const WorkCell = ({ pos }) => (
  h('div', {
    class: 'hexagon',
    style: {
      width: `${(cellSize - 1) * 3}vh`,
      height: `${(cellSize - 1) * 3}vh`,
      left: `calc(50vw + ${pos.x * cellSize * 3 / 4}vh)`, 
      top: `calc(50vh + ${pos.y * cellSize * 3 / 4}vh)`,
      backgroundImage: 'url(https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F5e%2F1b%2F12%2F5e1b12585af75b9bdcb2c1921ab17447.png&f=1)'
    }
  })
)

const toWindowPos = pos => (
  pos.y % 2 ? { x: pos.x * 4 - 2, y: pos.y * 3 } : { x: pos.x * 4, y: pos.y * 3 }
)

const view = (state, actions) => (
  h('div', { id: 'app-container' }, [
    state.cells.map(pos => (toWindowPos(pos))).map(pos => (
      WorkCell({ size: cellSize, color: 'red', pos: { x: pos.x, y: pos.y } })
    ))
  ])
)
const main = app(state, actions, view, document.body)
main.drawCells(30)
