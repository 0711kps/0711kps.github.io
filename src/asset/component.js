import { h } from 'hyperapp'

const Cell = (
  {
    x,
    y,
    title,
    enTitle,
    cellEvent,
    imgIndex,
    config,
    cellActions,
    updateHint,
    handleCell
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
      document.body.style.backgroundPosition = `center ${imgIndex * -100}vh`
      return updateHint({ zh: title, en: enTitle, active: true })
    },
    onmouseleave: () => {
      document.title = 'AzumaCoding作品集'
      document.body.removeAttribute('style')
      return updateHint({ active: false })
    },
    onclick: () => handleCell(cellEvent)
  })
)

const Hint = ({ active, zh, en }) => (
  <div id='hint-box' class={active && 'active'}>
    <div id='zh-hint' class='hint-text'>{zh}</div>
    <div id='en-hint' class='hint-text'>{en}</div>
  </div>
)

// const List = (items) => (
//   {items.map(item => (
//       <div class='item' title={item.tooltip}>{item.value}</div>
//   ))}
// )

const Resume = ({ detail }) => (
  <div id='resume'>
    {Object.keys(detail).map(key =>(
      <div class='list'>
        <div class='list-title'>{key}</div>
        <div class='list-contents'>
          {detail[key].map(item => (
            <div class='item' title={item.tooltip}>{item.value}</div>
          ))}
        </div>
      </div>
    ))}
  </div>
)

const VimeoPlayer = ({ detail }) => (
  <iframe id='vimeo-player' src={'https://player.vimeo.com/video/' + detail.vimeoId} />
)

export { Hint, Cell, VimeoPlayer, Resume }
