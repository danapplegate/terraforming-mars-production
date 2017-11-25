import React, { Component } from 'react';
import './App.css';

function storageAvailable(type) {
    try {
        var storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

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

function Reset(props) {
  return (
    <button className="reset" onClick={props.onReset}>Reset Game</button>
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
    this.gameStateKey = '__terraforming-mars-game-state__';
    this.state = poolState;
    this.initialState = Object.assign({}, poolState);
    this.changeAmount = this.changeAmount.bind(this);
    this.onDoProduction = this.onDoProduction.bind(this);
    this.onReset = this.onReset.bind(this);

    if (storageAvailable('localStorage')) {
      this.localStorage = window.localStorage;
    } else {
      this.localStorage = null;
    }
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

  componentDidMount() {
    if (this.localStorage) {
      console.log('Checking local storage for game state...');
      let gameState = localStorage.getItem(this.gameStateKey);
      if (gameState) {
        console.log('Game state found, attempting to parse JSON');
        try {
          gameState = JSON.parse(gameState);
        } catch (e) {
          if (e instanceof SyntaxError) {
            console.log('Invalid JSON state stored, clearing');
            localStorage.removeItem(this.gameStateKey);
          } else {
            throw e;
          }
        }
        console.log('Successfully restored game state:');
        console.log(gameState);
        this.setState(gameState);
      } else {
        console.log('No game state found');
      }
    } else {
      console.log('Local storage not enabled, skipping game state load');
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.localStorage) {
      console.log('Saving game state...');
      localStorage.setItem(this.gameStateKey, JSON.stringify(this.state));
    } else {
      console.log('Local storage not enabled, skipping game state save');
    }
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

  onReset() {
    this.setState(this.initialState);
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
          <Reset onReset={this.onReset} />
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
