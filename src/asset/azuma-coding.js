import { h, app } from 'hyperapp'
import { Enter, Exit } from '@hyperapp/transitions'
import JSONinfo from './cellsInfo.json'
import { configurePosition, Config } from './mylib'
import { Hint, Cell } from './component'
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
    //hintLock = true
    //hintBox.classList.add('active')
    //zhHint.innerText = '請稍等...'
    //enHint.innerText = 'please wait...'
    //let vimeoEvent = () => {
      //popup.classList.remove('visible')
      //hintLock = false
      //document.body.removeAttribute('style')
      //hintBox.classList.remove('active')
      //zhHint.innerText = ''
      //enHint.innerText = ''
      //setTimeout(() => {
        //popup.classList.remove('exist')
        //iframe.remove()
      //}, 200)
      //popup.removeEventListener('click', vimeoEvent)
    //}
    //popup.addEventListener('click', vimeoEvent)
    //let iframe = document.createElement('iframe')
    //iframe.classList.add('vimeo-player')
    //iframe.frameborder = '0'
    //iframe.src = `https://player.vimeo.com/video/${detail.vimeoId}`
    //popup.appendChild(iframe)
    //popup.classList.add('exist')
    //iframe.onload = () => {
      //hintBox.classList.remove('active')
      //popup.classList.add('visible')
      //hintLock = false
    //}
  },
  text: detail => {
    //
  }
}

const state = {
  cells: [],
  hint: {
    zh: '',
    en: '',
    active: false
  }
}

const actions = {
  updateCells: cells => state => (
    { cells: state.cells.concat(cells), hint: state.hint }
  ),
  updateHint: hint => state => (
    { cells: state.cells, hint: Object.assign({}, state.hint, hint) }
  )
}

let cellDelayIndex = 0
const view = (state, actions) => (
  <div id='app-container'>
    {state.cells.map(cell => (
      <Enter
        css={{
          opacity: '0', pointerEvents: 'none'
        }}
        delay={100 + [...new Array(cellDelayIndex++).keys()]
          .map(n => (Math.floor(800 * 0.65 ** n)))
          .reduce((sum, n) => (sum + n), 0)}
        time={300}
        easing='cubic-bezier(0.4, 0, 0.2, 1)'
      >
        <Cell
          x={cell.x}
          y={cell.y}
          title={cell.title}
          enTitle={cell.enTitle}
          type={cell.type}
          typeDetail={cell.typeDetail}
          imgIndex={cell.imgIndex}
          config={Config}
          cellActions={cellActions}
          updateHint={actions.updateHint}
        />
      </Enter>
    ))}
    <Hint zh={state.hint.zh} en={state.hint.en} active={state.hint.active} />
    <div id='popup' />
  </div>
)

let main = app(state, actions, view, document.body)

let newCellsWithPos = configurePosition(state.cells, JSONinfo.cells)
main.updateCells(newCellsWithPos)
