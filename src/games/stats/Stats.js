import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import {Link} from 'react-router-dom';

class Stats extends Component {
  render() {
    return (
      <div>
        <Typography variant="h4" gutterBottom component="h2">
          Stats
        </Typography>
        <Link to={'/games/number-puzzle'}>Number Puzzles</Link>
      </div>
    );
  }
}

export default Stats;