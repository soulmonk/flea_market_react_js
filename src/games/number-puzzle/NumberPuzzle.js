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
    flex: '1 100%'
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
  cellDisabled: {
    color: '#989d1b'
  },
  control: {
    padding: theme.spacing.unit * 2
  }
});

function Cell(props) {
  const {classes} = props;
  return (
    <div className={classNames(classes.cell, props.disabled && classes.cellDisabled)}>
      {props.value}
    </div>
  );
}

function random() {
  return Math.floor(Math.random() * 9) + 1;
}

/*
* N|N|N|N T
* N|N|N|N T
* N|N|N|N T
* N|N|N|N T
* T T T T
* */
function generateMap(n = 3, m = 3) {
  const res = [...new Array(n + 1)]
    .map(() => new Array(m + 1).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const v = random();
      res[i][j] = v;
      res[n][j] += v;
    }

    res[i][m] = res[i].slice(0, -1).reduce((sum, v) => sum + v, 0);
  }
  return res;
}

class NumberPuzzle extends Component {

  constructor(props) {
    super(props);
    this.state = {
      map: false,
      size: {
        n: 3,
        m: 3
      }
    }
  }

  handleSizeChange = name => event => {
    const {size} = this.state;
    size[name] = Number(event.target.value);
    this.setState({
      size
    });
  };

  generateMap() {
    const {n, m} = this.state.size;
    this.setState({
      map: generateMap(n, m)
    });
  }

  renderMap(map) {
    const {classes} = this.props;
    return (
      <div className={classes.gameMap}>
        {map.map((cells, i) => (
          <div className={classes.mapRow} key={i}>
            {cells.map((value, j) => (
              <Cell
                value={i === map.length - 1 && j === cells.length - 1 ? '' : value}
                key={i * cells.length + j}
                disabled={i === map.length - 1 || j === cells.length - 1}
                classes={classes}
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
    if (map === false) {
      displayMap = 'First generate map';
    } else {
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
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={8}>
                <Grid item>
                  {displayMap}
                </Grid>
              </Grid>
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
