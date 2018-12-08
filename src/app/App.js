import React, {Component} from 'react';
import Main from '../main/Main';

class App extends Component {

  render() {
    return (
      // go to login or main page
      // no only main page
      <div className="App">
        <Main/>
      </div>
    );
  }
}

export default App;
