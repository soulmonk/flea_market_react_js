import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import NumberPuzzle from './number-puzzle/NumberPuzzle';
import Stats from './stats/Stats';

class Games extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route exact path={'/games'} component={Stats}/>
          <Route path={'/games/number-puzzle'} component={NumberPuzzle}/>
        </Switch>
      </>
    );
  }
}

export default Games;