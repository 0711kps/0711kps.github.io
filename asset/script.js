const { h, app } = hyperapp

const randomIn = (min, max) => (
  Math.floor(
    Math.random() * (max - min + 1)
  ) + min
)

const directions = {
  odd: [
    { x: -1, y: -1 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 }
  ],
  even: [
    { x: 0, y: -1 },
    { x: -1, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: -1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 }
  ]
}

const cellExists = (cells, target) => (
  cells.some(cell => (
    cell.x === target.x && cell.y === target.y
  ))
)

const nextCell = lastCell => {
  let directionBase = lastCell.y % 2 ? 'odd' : 'even'
  let movement = directions[directionBase][randomIn(0, 5)]
  return { x: lastCell.x + movement.x, y: lastCell.y + movement.y }
}

const state = {
  cells: [
    { x: 0, y: 0 }
  ]
}

const actions = {
  go: direction => state => {
    let nextC = nextCell(state.cells[state.cells.length - 1])
    while (cellExists(state.cells, nextC)) {
      nextC = nextCell(state.cells[state.cells.length - 1])
    }
    return {
      cells: state.cells.concat(nextC)
    }
  } 
}

// pos(position) format { x: additional pUnit, y: additional pUnit}
const WorkCell = ({ size, color, pos }) => (
  h('div', {
    class: 'hexagon',
    style: {
      width: `${size}em`,
      height: `${size}em`,
      backgroundColor: `${color}`,
      left: `calc(50vw + ${pos.x * size / 4}em)`,
      top: `calc(50vh + ${pos.y * size / 4}em)`
    }
  })
)

const toWindowPos = pos => (
  pos.y % 2 ? { x: pos.x * 4 - 2, y: pos.y * 3 } : { x: pos.x * 4, y: pos.y * 3 }
)

const view = (state, actions) => (
  h('main', {}, [
    state.cells.map(pos => (toWindowPos(pos))).map(pos => (
      WorkCell({ size: 3, color: `hsl(${randomIn(0, 359)},${randomIn(30, 70)}%,${randomIn(30, 70)}%)`, pos: { x: pos.x, y: pos.y } })
    ))
  ])
)
const main = app(state, actions, view, document.body)
setInterval(main.go, 1000)
