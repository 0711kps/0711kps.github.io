import { h, app } from 'hyperapp'
import { Enter } from '@hyperapp/transitions'
import JSONinfo from './cellsInfo.json'
import { configurePosition, Config } from './mylib'
const hintBox = document.getElementById('hint-box')
const zhHint = document.getElementById('zh-hint')
const enHint = document.getElementById('en-hint')
const popup = document.getElementById('popup')
let hintLock = false

const cellActions = {
  link: detail => {
    window.open(detail.url, '_blank')
  },
  mail: detail => {
    window.location.href = `mailto:${detail.addr}`
  },
  vimeo: detail => {
    hintLock = true
    hintBox.classList.add('active')
    zhHint.innerText = '請稍等...'
    enHint.innerText = 'please wait...'
    let vimeoEvent = () => {
      popup.classList.remove('visible')
      hintLock = false
      document.body.removeAttribute('style')
      hintBox.classList.remove('active')
      zhHint.innerText = ''
      enHint.innerText = ''
      setTimeout(() => {
        popup.classList.remove('exist')
        iframe.remove()
      }, 200)
      popup.removeEventListener('click', vimeoEvent)
    }
    popup.addEventListener('click', vimeoEvent)
    let iframe = document.createElement('iframe')
    iframe.classList.add('vimeo-player')
    iframe.frameborder = '0'
    iframe.src = `https://player.vimeo.com/video/${detail.vimeoId}`
    popup.appendChild(iframe)
    popup.classList.add('exist')
    iframe.onload = () => {
      hintBox.classList.remove('active')
      popup.classList.add('visible')
      hintLock = false
    }
  },
  text: detail => {
    //
  }
}
const WorkCell = (
  {
    x,
    y,
    id,
    title,
    enTitle,
    type,
    typeDetail,
    imgIndex
  }) => (
  h('div', {
    class: 'hexagon',
    style: {
      width: `${(Config.cellSize - 0.8) * 3}vmin`,
      height: `${(Config.cellSize - 0.8) * 3}vmin`,
      left: `calc(50vw + ${x * Config.cellSize * 0.75}vmin)`,
      top: `calc(50vh + ${y * Config.cellSize * 0.75}vmin)`,
      backgroundSize: `${(Config.cellSize - 0.8) * 3}vmin`,
      backgroundPosition: `0 -${imgIndex * (Config.cellSize - 0.8) * 3}vmin`
    },
    onmouseenter: () => {
      zhHint.innerText = title
      enHint.innerText = enTitle
      if (!hintLock) {
        hintBox.classList.add('active')
        document.title = `AzumaCoding作品 - ${title}`
        document.body.style.backgroundPosition = `center -${100 * imgIndex}vh`
      }
    },
    onmouseleave: () => {
      if (!hintLock) {
        hintBox.classList.remove('active')
        document.body.removeAttribute('style')
        document.title = 'AzumaCoding作品集'
      }
    },
    onclick: () => {
      cellActions[type](typeDetail)
    }
  })
)

const state = {
  cells: []
}

const actions = {
  updateCells: cells => state => (
    cells
  )
}

let delayIndex = 0
const view = (state, actions) => (
  h(
    'div', { id: 'app-container' },
    state.cells.map(cell => (
      Enter(
        {
          css: { opacity: '0' },
          delay: 100 + delayIndex++ * 280,
          time: 300
        },
        [WorkCell(cell, Config, { hintLock: hintLock, zhHint: zhHint, enHint: enHint, hintBox: hintBox })]
      )
    ))
  )
)

const main = app(state, actions, view, document.body)

let cloneState = JSON.parse(JSON.stringify(state))
let newCellsWithPos = configurePosition(state.cells, JSONinfo.cells)
cloneState.cells.push(...newCellsWithPos)
console.log(cloneState)
main.updateCells(cloneState)
