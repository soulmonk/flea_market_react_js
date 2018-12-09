import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import * as PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core';
import classNames from 'classnames';

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
  control: {
    padding: theme.spacing.unit * 2
  }
});

function Cell(props) {
  const {classes, item, total} = props;

  return (
    <div
      className={classNames(classes.cell, total && classes.cellTotal, item.selected && classes.cellSelected)}
      onClick={props.onClick}
    >
      {item.value}
    </div>
  );
}

function random(max = 9) {
  return Math.floor(Math.random() * max) + 1;
}

// TODO integration with server, save generated map.
// TODO add levels instead of sizes
function generateMap(n = 3, m = 3) {
  const res = [...new Array(n + 1)]
    .map(() => {
      return [...new Array(m + 1)]
        .map(() => ({
          value: 0,
          used: false
        }));
    });

  // TODO 1 in row should be selected

  for (let i = 0; i < n; i++) {

    for (let j = 0; j < m; j++) {
      res[i][j].value = random();
    }
    const selected = [];
    const maxSelected = random(m - 1);
    while (maxSelected !== selected.length) {
      let j = random(m) - 1;
      if (selected.includes(j)) {
        continue;
      }
      selected.push(j);
      res[n][j].value += res[i][j].value;
      res[i][j].used = true;
    }

    res[i][m].value = selected.reduce((sum, j) => sum + res[i][j].value, 0);
  }
  return res;
}

function calcWin(map) {
  return map.every(cells => cells.every(item => (!item.selected && !item.used) || item.selected === item.used));
}

class NumberPuzzle extends Component {

  handleSizeChange = name => event => {
    const {size} = this.state;
    size[name] = Number(event.target.value);
    this.setState({
      size
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      map: false,
      size: {
        n: 3,
        m: 3
      },
      done: false
    };
  }

  generateMap() {
    const {n, m} = this.state.size;
    this.setState({
      done: false,
      map: generateMap(n, m)
    });
  }

  handleClick(i, j) {
    // todo click on total disable (hint do not use) all not selected
    // todo hold click disable cell
    // todo count moves
    const {map, done, size} = this.state;
    if (done) {
      return;
    }
    if (i === size.n) {
      return
      // map[i][j].value = 'n';
    } else if (j === size.m) {
      // map[i][j].value = 'm';
      return
    } else {
      map[i][j].selected = !map[i][j].selected;
    }
    this.setState({
      map,
      done: calcWin(map)
    });
  }

  renderMap(map) {
    const {classes} = this.props;
    const {n, m} = this.state.size;
    return (
      <div className={classes.gameMap}>
        {map.map((cells, i) => (
          <div className={classes.mapRow} key={i}>
            {cells.map((item, j) => (
              <Cell
                item={i === n && j === m ? {value: ''} : item}
                key={i * cells.length + j}
                total={i === n || j === m}
                classes={classes}
                onClick={() => this.handleClick(i, j)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  render() {
    const {classes} = this.props;
    const {map} = this.state;
    let displayMap;
    let stats = '..';
    if (map === false) {
      stats = 'First generate map';
    } else {
      if (calcWin(map)) {
        stats = 'done';
      } else {
        stats = 'in progress';
      }
      displayMap = this.renderMap(map);
    }
    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          Number Puzzle
        </Typography>
        <div>
          <Grid container className={classes.root} spacing={8}>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item>
                  <Button variant="contained" className={classes.button} onClick={() => this.generateMap()}>Generate</Button>
                </Grid>
                <Grid item>
                  <Input
                    id="size-n"
                    label="N"
                    className={classes.sizeField}
                    value={this.state.size.n}
                    onChange={this.handleSizeChange('n')}
                    type="number"
                    inputProps={{min: 3, max: 9}}
                  />
                </Grid>
                <Grid item>
                  <Input
                    id="size-m"
                    label="M"
                    className={classes.sizeField}
                    value={this.state.size.m}
                    onChange={this.handleSizeChange('m')}
                    type="number"
                    inputProps={{min: 3, max: 9}}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <div>{stats}</div>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item>
                  {displayMap}
                </Grid>
              </Grid>
            </Grid>
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
    );
  }
}

// export default NumberPuzzle;

NumberPuzzle.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NumberPuzzle);
