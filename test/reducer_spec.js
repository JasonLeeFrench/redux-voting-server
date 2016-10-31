import {List, Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {
      type: 'SET_ENTRIES',
      entries: ['Lisa\'s First Word']
    };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      entries: ['Lisa\'s First Word']
    }))
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['Lisa\'s First Word', 'And Maggie Makes Three']
    });
    const action = {
      type: 'NEXT'
    };
    const nextState = reducer(initialState, action);
    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Lisa\'s First Word', 'And Maggie Makes Three']
      },
      entries: []
    }))
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        pair: ['Lisa\'s First Word', 'And Maggie Makes Three']
      },
      entries: []
    });
    const action = {
      type: 'VOTE',
      entry: 'Lisa\'s First Word'
    };
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        pair: ['Lisa\'s First Word', 'And Maggie Makes Three'],
        tally: {'Lisa\'s First Word': 1}
      },
      entries: []
    }));
  });

  it('has an inital state', () => {
    const action = {
      type: 'SET_ENTRIES',
      entries: ['And Maggie Makes Three']
    };
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      entries: ['And Maggie Makes Three']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['Lisa\'s First Word', 'And Maggie Makes Three']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: 'Lisa\'s First Word'},
      {type: 'VOTE', entry: 'And Maggie Makes Three'},
      {type: 'VOTE', entry: 'Lisa\'s First Word'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: 'Lisa\'s First Word'
    }));

  });

});
