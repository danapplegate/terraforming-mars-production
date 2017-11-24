import React, { Component } from 'react';
import './App.css';

class Resource extends Component {
  constructor(props) {
    super(props);
    this.onMinus = this.onMinus.bind(this);
    this.onPlus = this.onPlus.bind(this);
  }

  onMinus() {
    this.props.onAmountChange(-1);
  }

  onPlus() {
    this.props.onAmountChange(1);
  }

  render() {
    const classes = `Resource ${this.props.name}`;
    return (
      <div className={classes}>
        <p className="resource-info">
          <button onClick={this.onMinus} className="minus">-</button>
          <span className="number">{this.props.amount}</span>
          <button onClick={this.onPlus} className="plus">+</button>
        </p>
      </div>
    );
  }
}

function DoProduction(props) {
    return (
        <button className="do-production" onClick={props.onDoProduction}>Do Production</button>
    );
}

class ResourceBoard extends Component {
  constructor(props) {
    super(props);
    this.resourceNames = ['megacredits', 'steel', 'titanium', 'plants', 'energy', 'heat'];
    let poolState = {tr: 20};
    this.resourceNames.forEach((name) => {
      poolState[name + '-pool'] = 0;
      poolState[name + '-production'] = 0;
    });
    this.state = poolState;
    this.changeAmount = this.changeAmount.bind(this);
    this.onDoProduction = this.onDoProduction.bind(this);
  }

  changeAmount(poolName) {
    let board = this;
    return (change) => {
      board.setState((prevState) => {
        let update = {};
        update[poolName] = prevState[poolName] + change;
        return update;
      });
    };
  }

  onDoProduction() {
    this.setState((prevState) => {
      let updates = {};
      this.resourceNames.forEach((name) => {
        // Do these specially
        if (name === 'energy' || name === 'heat') {
          return;
        }
        const poolName = name + '-pool';
        const prodName = name + '-production';
        updates[poolName] = prevState[poolName] + prevState[prodName];
      });
      updates['heat-pool'] = prevState['heat-pool'] + prevState['energy-pool'] + prevState['heat-production'];
      updates['energy-pool'] = prevState['energy-production'];
      updates['megacredits-pool'] += prevState['tr'];
      return updates;
    });
  }

  render() {
    const resourcePools = this.resourceNames.map((name) => {
      const poolName = name + "-pool";
      return (
        <Resource key={poolName} name={poolName} amount={this.state[poolName]} onAmountChange={this.changeAmount(poolName)} />
      );
    });
    const resourceProductions = this.resourceNames.map((name) => {
      const productionName = name + "-production";
      return (
        <Resource key={productionName} name={productionName} amount={this.state[productionName]} onAmountChange={this.changeAmount(productionName)} />
      );
    });
    return (
      <div className="ResourceBoard">
        <div className="resource-wrapper">
          {resourcePools}
          {resourceProductions}
        </div>
        <div className="game-buttons">
          <Resource key="tr" name="tr" amount={this.state.tr} onAmountChange={this.changeAmount("tr")} />
          <DoProduction onDoProduction={this.onDoProduction} />
        </div>
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
