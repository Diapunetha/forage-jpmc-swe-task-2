import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean,
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  interval: NodeJS.Timeout | undefined;

  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,
    };
  }

  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />);
    }
    return null;
  }

  getDataFromServer() {
    this.setState({ showGraph: true });
    const fetchData = () => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Remove duplicate data
        const newData = serverResponds.filter(newRespond => {
          return !this.state.data.some(existingRespond =>
            existingRespond.stock === newRespond.stock &&
            existingRespond.top_ask_price === newRespond.top_ask_price &&
            existingRespond.timestamp === newRespond.timestamp
          );
        });

        // Update the state with the new data
        this.setState({ data: [...this.state.data, ...newData] });
      });
    };

    fetchData();  // Initial fetch
    this.interval = setInterval(fetchData, 100);  // Fetch data every 100ms
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            onClick={() => { this.getDataFromServer() }}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
