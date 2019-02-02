import { h } from 'hyperapp'

const Cell = (
  {
    x,
    y,
    title,
    enTitle,
    type,
    typeDetail,
    imgIndex,
    config,
    cellActions,
    updateHint
  }) => (
  h('div', {
    class: 'hexagon',
    style: {
      width: `${(config.cellSize - 0.8) * 3}vmin`,
      height: `${(config.cellSize - 0.8) * 3}vmin`,
      left: `calc(50vw + ${x * config.cellSize * 0.75}vmin)`,
      top: `calc(50vh + ${y * config.cellSize * 0.75}vmin)`,
      backgroundSize: `${(config.cellSize - 0.8) * 3}vmin`,
      backgroundPosition: `0 -${imgIndex * (config.cellSize - 0.8) * 3}vmin`
    },
    onmouseenter: () => {
      document.title = title
      return updateHint({ zh: title, en: enTitle, active: true })
    },
    onmouseleave: () => {
      document.title = 'AzumaCoding作品集'
      return updateHint({ active: false })
    },
    onclick: () => {
      cellActions[type](typeDetail)
    }
  })
)

const Hint = ({ active, zh, en }) => (
  <div id='hint-box' class={active && 'active'}>
    <div id='zh-hint' class='hint-text'>{zh}</div>
    <div id='en-hint' class='hint-text'>{en}</div>
  </div>
)

const VimeoPlayer = ({ src }) => (
  '123'
)

export { Hint, Cell, VimeoPlayer }
