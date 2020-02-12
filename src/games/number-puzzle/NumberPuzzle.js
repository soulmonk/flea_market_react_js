import React, { Component, useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'

import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Input from '@material-ui/core/Input'
import * as PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core'
import classNames from 'classnames'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    height: 140,
    width: 100
  },
  sizeField: {
    width: 40
  },
  hint: {
    height: 25
  },
  cell: {
    background: '#ebebeb',
    width: 30,
    height: 30,
    'text-align': 'center',
    'vertical-align': 'middle',
    'line-height': '30px',
    cursor: 'pointer'
  },
  gameMap: {
    display: 'flex',
    // flex: '1 100%',
    'flex-flow': 'row wrap'
    // 'justify-content': 'space-around'
  },
  mapRow: {
    display: 'flex',
    'flex-direction': 'row',
    flex: '1 100%'
  },
  cellTotal: {
    // color: '',
    background: '#989d1b'
  },
  cellSelected: {
    background: '#704c9d'
  },
  cellInactive: {
    background: '#d2d2d2',
    color: '#9c9c9c'
  },
  control: {
    padding: theme.spacing(2)
  }
})

function Cell ({ classes, item, total, onClick, onLongClick }) {

  const backspaceLongPress = useLongPress(onLongClick, 300)
  return (
    <div
      className={classNames(classes.cell, total && classes.cellTotal, item.state === 'selected' && classes.cellSelected,
        item.state === 'inactive' && classes.cellInactive)}
      {...backspaceLongPress}
      onClick={onClick}
    >
      {item.value}
    </div>
  )
}

function GenerateMap ({ classes, generateMap }) {
  const [sizeN, setSizeN] = useState(3)
  const [sizeM, setSizeM] = useState(3)
  return (
    <Grid container spacing={8}>
      <Grid item>
        <Button variant="contained" className={classes.button} onClick={() => generateMap(sizeN, sizeM)}>Generate</Button>
      </Grid>
      <Grid item>
        <Input
          id="size-n"
          label="N"
          className={classes.sizeField}
          value={sizeN}
          onChange={e => setSizeN(Number(e.target.value))}
          type="number"
          inputProps={{ min: 3, max: 9 }}
        />
      </Grid>
      <Grid item>
        <Input
          id="size-m"
          label="M"
          className={classes.sizeField}
          value={sizeM}
          onChange={e => setSizeM(Number(e.target.value))}
          type="number"
          inputProps={{ min: 3, max: 9 }}
        />
      </Grid>
    </Grid>
  )
}

function random (max = 9) {
  return Math.floor(Math.random() * max) + 1
}

// TODO integration with server, save generated map.
// TODO add levels instead of sizes
function generateMap (n = 3, m = 3) {
  const res = [...new Array(n + 1)]
    .map(() => {
      return [...new Array(m + 1)]
        .map(() => ({
          value: 0,
          used: false
        }))
    })

  // TODO 1 in row should be selected

  for (let i = 0; i < n; i++) {

    for (let j = 0; j < m; j++) {
      res[i][j].value = random()
    }
    const selected = []
    const maxSelected = random(m - 1)
    while (maxSelected !== selected.length) {
      let j = random(m) - 1
      if (selected.includes(j)) {
        continue
      }
      selected.push(j)
      res[n][j].value += res[i][j].value
      res[i][j].used = true
    }

    res[i][m].value = selected.reduce((sum, j) => sum + res[i][j].value, 0)
  }
  return res
}

function calcWin (map) {
  return map.every(cells => cells.every(item => (item.state !== 'selected' && !item.used) || (item.state === 'selected') === item.used))
}

function useLongPress (callback = () => {}, ms = 300) {
  const [startLongPress, setStartLongPress] = useState(false)

  useEffect(() => {
    let timerId
    if (startLongPress) {
      timerId = setTimeout(callback, ms)
    } else {
      clearTimeout(timerId)
    }

    return () => {
      clearTimeout(timerId)
    }
  }, [startLongPress])

  return {
    onMouseDown: () => setStartLongPress(true),
    onMouseUp: () => setStartLongPress(false),
    onMouseLeave: () => setStartLongPress(false),
    onTouchStart: () => setStartLongPress(true),
    onTouchEnd: () => setStartLongPress(false)
  }
}

class NumberPuzzle extends Component {

  constructor (props) {
    super(props)
    this.state = {
      map: false,
      size: {
        n: 3,
        m: 3
      },
      hint: false,
      done: false
    }
  }

  generateMap (n, m) {
    this.setState({
      done: false,
      size: { n, m },
      map: generateMap(n, m)
    })
  }

  handleLongClick (i, j) {
    const { map, done, size } = this.state
    if (done) {
      return
    }
    if (i === size.n || j === size.m) {
      return
    }

    map[i][j].state = map[i][j].state === 'inactive' ? '' : 'inactive'

    this.setState({
      map,
      last: `${i}${j}`,
      action: 'inactive',
      done: calcWin(map)
    })
  }

  handleClick (i, j) {
    // todo click on total disable (hint do not use) all not selected
    // todo count moves
    const { map, done, size, last, hint } = this.state
    if (done) {
      return
    }
    if (hint) {
      if (i === size.n || j === size.m) {
        return
      }
      map[i][j].state = map[i][j].used ? 'selected' : 'inactive'
      this.setState({
        map,
        hint: false,
        last: '',
        done: calcWin(map)
      })
      return
    }
    if (last === `${i}${j}`) {
      this.setState({ last: '' })
      return
    }
    if (i === size.n) {
      for (let k = 0; k < size.n; k++) {
        if (map[k][j].state === 'selected') { continue }
        map[k][j].state = 'inactive'
      }
    } else if (j === size.m) {
      for (let k = 0; k < size.m; k++) {
        if (map[i][k].state === 'selected') { continue }
        map[i][k].state = 'inactive'
      }
    } else {
      map[i][j].state = map[i][j].state === 'selected' ? '' : 'selected'
    }
    this.setState({
      map,
      last: '',
      done: calcWin(map)
    })
  }

  renderMap (map) {
    const { classes } = this.props
    const { n, m } = this.state.size
    return (
      <div className={classes.gameMap}>
        {map.map((cells, i) => (
          <div className={classes.mapRow} key={i}>
            {cells.map((item, j) => (
              <Cell
                item={i === n && j === m ? { value: '' } : item}
                key={i * cells.length + j}
                total={i === n || j === m}
                classes={classes}
                onLongClick={() => this.handleLongClick(i, j)}
                onClick={() => this.handleClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  render () {
    const { classes } = this.props
    const { map, done, hint } = this.state
    let displayMap
    let stats = '..'
    if (map === false) {
      stats = 'First generate map'
    } else {
      if (calcWin(map)) {
        stats = 'done'
      } else {
        stats = 'in progress'
      }
      displayMap = this.renderMap(map)
    }
    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          Number Puzzle
        </Typography>
        <div>
          <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
              <GenerateMap classes={classes} generateMap={(n, m) => this.generateMap(n, m)}/>
            </Grid>
            <Grid item xs={12}>
              <div>stats: {stats}</div>
            </Grid>
            {map ? (<Grid item xs={12}>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <ToggleButton
                    value="check"
                    disabled={done}
                    className={classes.hint}
                    selected={!hint}
                    aria-label="label"
                    onChange={() => this.useHint()}>Hint</ToggleButton>
                </Grid>
                <Grid item>
                  {displayMap}
                </Grid>
              </Grid>
            </Grid>) : ''}
            <Grid item xs={12}>
              <h4>TODOS (use material typography)</h4>
              <ol>
                <li>add server todods for game</li>
                <li>add timer</li>
                <li>click on total disable (hint do not use) all not selected</li>
                <li>hold click disable cell</li>
                <li>count moves</li>
                <li>integration with server, save generated map.</li>
                <li>add levels instead of sizes</li>
              </ol>
            </Grid>
          </Grid>

        </div>
      </div>
    )
  }

  useHint () {
    const { done, hint } = this.state
    if (done) return
    this.setState({ hint: !hint })
  }
}

// export default NumberPuzzle;

NumberPuzzle.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NumberPuzzle)
