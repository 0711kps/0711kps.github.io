const { h, app } = hyperapp
const { Enter } = transitions
const hint = document.getElementById("hint")
const popup = document.getElementById("popup")

// cells.details: { id, title, logo, vimeoUrl }
// cells.positionList: { id, x, y }
// updateCells: update cells object and posList object
// pos(position) format { x: additional pUnit, y: additional pUnit}

const cellActions = {
  link: detail => {
    window.open(detail.url, '_blank')
  },
  mail: detail => {
    window.location.href = `mailto:${detail.addr}`
  },
  vimeo: detail => {
    let iframe = document.createElement('iframe')
    iframe.classList.add('vimeo-player')
    iframe.frameborder = "0"
    iframe.src = `https://player.vimeo.com/video/${detail.vimeoId}`
    popup.appendChild(iframe)
    popup.classList.add('exist')
    let vimeoEvent = () => {
      popup.classList.remove('visible')
      setTimeout(() => {
        popup.classList.remove('exist')
        iframe.remove()
      }, 200)
      popup.removeEventListener('click', vimeoEvent)
    }
    popup.addEventListener('click', vimeoEvent)
    iframe.onload = () => {
      popup.classList.add('visible')
    }
  }
}
const WorkCell = ({ x, y, id, title, type, typeDetail }) => (
  h('div', {
    class: 'hexagon',
    style: {
      width: `${(CellConfig.cellSize - 0.8) * 3}vh`,
      height: `${(CellConfig.cellSize - 0.8) * 3}vh`,
      left: `calc(50vw + ${x * CellConfig.cellSize * 3 / 4}vh)`,
      top: `calc(50vh + ${y * CellConfig.cellSize * 3 / 4}vh)`,
      backgroundImage: `url(img/${id}.png)`
    },
    onmouseenter: () => {
      hint.innerText = title
      hint.classList.add('active')
      document.body.style.backgroundImage = `url(img/${id}.png)`
      document.title = `AzumaCoding作品 - ${title}`
    },
    onmouseleave: () => {
      hint.classList.remove('active')
      document.body.removeAttribute('style')
      document.title = 'AzumaCoding作品集'
    },
    onclick: () => {
      cellActions[type](typeDetail)
      popup.style.backgroundImage = `url(img/${id}.png)`
    }
  })
)

const getCells = new Promise(resolve => {
  let xhr = new XMLHttpRequest()
  xhr.open('get', '/cellsInfo.json')
  xhr.onloadend = event => {
    resolve(JSON.parse(event.target.response))
  }
  xhr.send()
})

//const getCoderInfomation = new Promise(resolve => {
  //let xhr = new XMLHttpRequest
  //xhr.open('get', '/coderInfo.json')
  //xhr.onloadend = event => {
    //resolve(JSON.parse(event.target.response))
  //}
  //xhr.send()
//})

// prepare complete

const state = {
  cells: [
    {
      id: 'aboutMe',
      type: 'resume',
      title: '關於我',
      x: 0,
      y: 0,
      bgImg: 'not-yet'
    }
  ],
  selected: {
    id: null
  }
}

const actions = {
  updateCells: cells => state => (
    cells
  ),
  updateCoderInfo: coderInfo => state => (
    Object.assign({}, state,
      {
        cells: {
          details: {
            aboutMe: coderInfo
          }
        }
      })
  )
}

let x = rangeIn(0, 100)
const view = (state, actions) => (
  h(
    'div', { id: 'app-container' },
    state.cells.map(cell => (
      Enter({ css: { opacity: '0' }, delay: 100 + x.shift() * 280, time: 300 }, [WorkCell(cell)])
    ))
  )
)

getCells.then(json => {
  let cloneState = JSON.parse(JSON.stringify(state))
  let newCellsWithPos = configurePosition(state.cells, json.cells)
  cloneState.cells.push(...newCellsWithPos)
  console.log(cloneState)
  main.updateCells(cloneState)
})

// getCoderInfomation.then()

const main = app(state, actions, view, document.body)
