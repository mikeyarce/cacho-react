import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useState } from 'react';


function Board() {
  const initialState = {
    0: { value: 0, picked: false },
    1: { value: 0, picked: false },
    2: { value: 0, picked: false },
    3: { value: 0, picked: false },
    4: { value: 0, picked: false },    
  }
  const [ turn, setTurn ] = useState(1)
  const [ rollTurn, setRollTurn ] = useState(0)
  const [ state, setState ] = useState(initialState)
  const [ total, setTotal ] = useState(0)

  function randInt() {
    return Math.floor(Math.random() * (6 - 1 + 1) + 1)   
  }

  function roll() {
    if ( turn < 12 ) {
      if ( 0 === rollTurn ) {
        setRollTurn(1);
      } 
      console.log(turn)
      if ( rollTurn < 3  ){
        setRollTurn( rollTurn + 1);
        let arr = [0,0,0,0,0];
        for ( let i in arr ) {
          arr[i] = randInt()
          // arr[i] = 4
          setState( prevState => ({
            ...prevState,
            [i]: { value: state[i].picked ? state[i].value : arr[i], picked: state[i].picked }
          }))
        }
      }
    } 
  }

  function pick(die, key) {
    setState( prevState => ({
      ...prevState,
      [key]: { value: state[key].value ,picked: ! state[key].picked }
    }))
  }

  const die = Object.keys(state).map((die, key) => {
    return (
    <div 
      onClick={() => pick(state[key], key)} 
      key={key} 
      className={"die die" + die}
      style={state[key].picked ? { background:'lightblue' } : {background: '#ccc'}}
      >
      <p>
        {state[key].value}
      </p>
    </div>
    )
  })
  function reset() {
    setState(initialState)
    setRollTurn(0)
  }

  function countSum(key) {
    let count = 0;
    Object.keys(state).map( (item, k) => {
      for( let i of item ) {
        if ( key == state[i].value ) {
          count++;
        }
      }
    })
    // reset();
    console.log(count * key)
    return ( 0 === count * key ? 'X' : count * key ) 
  }
  // Helper function to convert state to array 
  function makeArray(state) {
    let newArr = [];
    Object.keys(state).map( (item, k) => {
      for( let i of item ) {
        newArr.push(state[i].value)
      }
    })
    return newArr;
  }
  function checkStraight() {
    const possibles = [
      [1,2,3,4,5], 
      [2,3,4,5,6],
      [1,3,4,5,6],
      [1,2,4,5,6],
      [1,2,3,5,6],
      [1,2,3,4,6]
    ]
    let newArr = [];
    Object.keys(state).map( (item, k) => {
      for( let i of item ) { 
        newArr.push(state[i].value)
      }
    })
    newArr.sort();
    reset();
    if( -1 !==  JSON.stringify(possibles).indexOf(JSON.stringify(newArr)) ) {
      if ( 1 === rollTurn ) {
        return 25;
      } else {
        return 20;
      }
    }
    return 'X';
  }
  function getOccurrence(array, value) {
    return array.filter((v) => (v === value)).length;
}
  function checkFlush() {
    let newArr = [];
    Object.keys(state).map( (item, k) => {
      for( let i of item ) {
        newArr.push(state[i].value)
      }
    })
    newArr.sort();
    let results = [];
    for( let i of newArr ) {
      results.push( getOccurrence( newArr, i))
    }
    results.sort()
    // reset()
    if ( JSON.stringify([2,2,3,3,3]) == JSON.stringify(results) ) {
      if ( 1 === rollTurn ) {
        return 35;
      } else {
        return 30;
      }
    }
    return 'X';
  }
  function checkFour() {
    let newArr = [];
    Object.keys(state).map( (item, k) => {
      for( let i of item ) {
        newArr.push(state[i].value)
      }
    })
    newArr.sort();
    let results = [];
    for( let i of newArr ) {
      results.push( getOccurrence( newArr, i))
    }
    results.sort()
    // reset()
    if ( JSON.stringify([5,5,5,5,5]) == JSON.stringify(results) ||
        JSON.stringify([1,4,4,4,4]) == JSON.stringify(results) ) {
        if ( 1 === rollTurn ) {
          return 45;
        } else {
          return 40;
        }
    }
    return 'X';
  }

  function checkGrande() {
    let results = makeArray(state)   
    // reset() 
    if ( results.every( (val, i, arr) => val === arr[0] ) ) {
      return 50;
    } else {
      return 'X'
    }
  }
  function checkGrande2() {
    if ( 50 === places[9] ){
      let results = makeArray(state)   
      // reset()
      if ( results.every( (val, i, arr) => val === arr[0] ) ) {
        return 100;
      }
    } else {
      reset()
      return 'X'
    }

  }

  function place(key) {
    if ( rollTurn <= 3 && rollTurn > 0 ) {
      let count = ''
        console.log(state);
        switch(key) {
          case 0:
            count = countSum(1)
            break;
          case 1: 
            count = checkStraight()
            break;
          case 2: 
            count = countSum(4)
            break;
          case 3: 
            count = countSum(2)
            break;
          case 4: 
            count = checkFlush()
            break;
          case 5: 
            count = countSum(5)
            break;
          case 6: 
            count = countSum(3)
            break;
          case 7: 
            count = checkFour()
            break;
          case 8: 
            count = countSum(6)
            break;
          case 9: 
            count = checkGrande()
            break;
          case 10: 
            count = checkGrande2()
            break;
          default:
            break;
        }
        if ( 
          0 === places[key] || 
          'straight' === places[key] ||
          'flush' === places[key] ||
          'four of a kind' === places[key] ||
          'grande' === places[key] ||
          'grande x 2' === places[key]
          ) {
            setPlaces( prevState => ({
              ...prevState,
              [key]: count
            }))
            reset()
            setTurn( turn + 1 )
            setRollTurn(0)
            if ( 'X' !== count ){
              setTotal(count + total)
            }
        }
    }
  }

  const initialPlace = {
    0: 0,
    1: 'straight',
    2: 0,
    3: 0,
    4: 'flush',
    5: 0,
    6: 0,
    7: 'four of a kind',
    8: 0,
    9: 'grande',
    10: 'grande x 2',
  }

  const [ places, setPlaces ] = useState(initialPlace)

  function checkPlace(key) {
    if ( 
      0 === places[key] ||
      'straight' === places[key] ||
      'flush' === places[key] || 
      'four of a kind' === places[key] ||
      'grande' === places[key] ||
      'grande x 2' === places[key]
      ) {
        return { background: '#ccc'}
      } else {
        return { background: 'lightblue'}
      }
  }
  const board = Object.keys(places).map((die, key) => {
    if ( key < 3 ) {
      return (
        <div 
        onClick={() => place(key)} 
        className={"board-item row row1 block" + key} 
        key={key}
        style={checkPlace(key)}
        >
        <p>{places[key]}</p></div> 
      )
    }
    if ( key > 2 && key < 6 ) {
      return ( 
        <div 
          onClick={() => place(key)} 
          className={"board-item row row2 block" + key} 
          key={key}
          style={checkPlace(key)}
          >
          <p>{places[key]}</p></div> 
      )
    }
    if ( key > 5 && key < 9 ) {
      return (
        <div 
          onClick={() => place(key)} 
          className={"board-item row row3 block" + key} 
          key={key}
          style={checkPlace(key)}
          >
          <p>{places[key]}</p></div> 
      )
    }
    if ( key > 8 && key < 10 ) {
      return (
        <div 
          onClick={() => place(key)} 
          className={"board-item row row4 block" + key} 
          key={key}
          style={checkPlace(key)}
          >
          <p>{places[key]}</p></div>
      )
    }
    if ( key > 9 && key < 11 ) {
      return (
        <div 
          onClick={() => place(key)} 
          className={"board-item row row5 block" + key} 
          key={key}
          style={checkPlace(key)}
          >
          <p>{places[key]}</p></div> 
      )
    }
  })

  return (
    <>
      <button onClick={roll}>Roll</button>
      <button onClick={reset}>Reset</button>
      <p>Roll: {rollTurn}</p>
      <p>Turn: {turn}</p>
      {/* <button onClick={place}>Place</button> */}
      <div className='dice'>
        {die}
      </div>
      <div className="board">
        {board}
      </div>
      <p>Total: {total}</p>
    </>
  )
}

function App() {
  return (
    <div className='cacho'>
      <Board />
    </div>
  );
}

export default App;
