import React, { Component } from 'react';
import './App.css';

class ResourcePool extends Component {
  render() {
    const classes = `ResourcePool ${this.props.type}`;
    return (
      <div className={classes}>
        <p className="number">{this.props.amount}</p>
      </div>
    );
  }
}

class ResourceProduction extends Component {
  render() {
    const classes = `ResourceProduction ${this.props.type}`;
    return (
      <div className={classes}>
        <p className="number">{this.props.amount}</p>
      </div>
    );
  }
}

class ResourceBoard extends Component {
  constructor(props) {
    super(props);
    this.changeAmount = this.changeAmount.bind(this);
    this.resourceNames = ['megacredits', 'steel', 'titanium', 'plants', 'energy', 'heat'];
  }

  changeAmount(poolName, change) {
    this.setState((prevState) => {
      return {
        poolName: prevState[poolName] + change
      };
    });
  }

  render() {
    const resourcePools = this.resourceNames.map((name) => {
      return (
        <ResourcePool key={name + "-pool"} type={name} amount="0" />
      );
    });
    const resourceProductions = this.resourceNames.map((name) => {
      return (
        <ResourceProduction key={name + "-production"} type={name} amount="0" />
      );
    });
    return (
      <div className="ResourceBoard">
        {resourcePools}
        {resourceProductions}
      </div>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <ResourceBoard />
      </div>
    );
  }
}

export default App;
