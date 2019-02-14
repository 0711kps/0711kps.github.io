import { h, app } from 'hyperapp'
import { Enter, Exit } from '@hyperapp/transitions'
import JSONinfo from './cellsInfo.json'
import { configurePosition, Config } from './mylib'
import { Hint, Cell, VimeoPlayer, Resume } from './component'
const popup = document.getElementById('popup')
let hintLock = false

const state = {
  cells: [],
  hint: {
    active: false,
    zh: '',
    en: ''
  },
  popup: {
    active: false,
    type: '',
    detail: ''
  }
}

const actions = {
  updateCells: cells => state => (
    { cells: state.cells.concat(cells) }
  ),
  updateHint: hint => state => (
    { hint: Object.assign({}, state.hint, hint) }
  ),
  handleCell: cellEvent => state => {
    switch (cellEvent.type) {
      case 'link':
        window.open(cellEvent.detail.url, '_blank')
        break
      case 'mail':
        window.location.href = `mailto:${cellEvent.detail.addr}`
        break
      case 'vimeo':
        return { popup: { active: true, type: cellEvent.type, detail: cellEvent.detail } }
        break
      case 'resume':
      return { popup: { active: true, type: cellEvent.type, detail: cellEvent.detail } }
        break
    }
  },
  resetPopUp: () => state => (
    { popup: { active: false, type: '', detail: '' } }
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
          cellEvent={cell.cellEvent}
          imgIndex={cell.imgIndex}
          config={Config}
          updateHint={actions.updateHint}
          handleCell={actions.handleCell}
        />
      </Enter>
    ))}
    <Hint zh={state.hint.zh} en={state.hint.en} active={state.hint.active} />
    <div id='popup' class={state.popup.active && 'active'} onclick={() => actions.resetPopUp()}>
      {state.popup.type === 'vimeo' && <VimeoPlayer detail={state.popup.detail} />}
      {state.popup.type === 'resume' && <Resume detail={state.popup.detail} />}
    </div>
  </div>
)

let main = app(state, actions, view, document.body)

let newCellsWithPos = configurePosition(state.cells, JSONinfo.cells)
main.updateCells(newCellsWithPos)
