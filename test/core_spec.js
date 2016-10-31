import {List, Map} from 'immutable';
import {expect} from 'chai';

import {setEntries, next, vote} from '../src/core';

describe('app logic', () => {

  describe('set entries', () => {

    it('adds entries to the state', () => {

      const state = Map();
      const entries = List.of('Lisa\'s First Word', 'And Maggie Makes Three');
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
      }));

    });

    it('converts to immutable', () => {

      const state = Map();
      const entries = ['Lisa\'s First Word', 'And Maggie Makes Three'];
      const nextState = setEntries(state, entries);

      expect(nextState).to.equal(Map({
        entries: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
      }));

    });

  });

  describe('next', () => {

    it('marks winner when there\'s one entry left', () => {

      const state = Map({
        vote: Map({
          pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
          tally: Map({
            'Lisa\'s First Word': 4,
            'And Maggie Makes Three': 2
          })
        }),
        entries: List()
      });

      const nextState = next(state);
      expect(nextState).to.equal(Map({
        winner: 'Lisa\'s First Word'
      }));

    });

    it('puts winner of the current vote back to entries', () => {

      const state = Map({
        vote: Map({
          pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
          tally: Map({
            'Lisa\'s First Word': 4,
            'And Maggie Makes Three': 2
          })
        }),
        entries: List.of('Treehouse of Horror V', 'Homer at the Bat', 'Lemon of Troy')
      });

      const nextState = next(state);

      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Treehouse of Horror V', 'Homer at the Bat')
        }),
        entries: List.of('Lemon of Troy', 'Lisa\'s First Word')
      }));

    });

    it('puts both from tied vote back to entries', () => {
      const state = Map({
        vote: Map({
          pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
          tally: Map({
            'Lisa\'s First Word': 3,
            'And Maggie Makes Three': 3
          })
        }),
        entries: List.of('Treehouse of Horror V', 'Homer at the Bat', 'Lemon of Troy')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Treehouse of Horror V', 'Homer at the Bat')
        }),
        entries: List.of('Lemon of Troy', 'Lisa\'s First Word', 'And Maggie Makes Three')
      }))
    })

    it('takes the next two entries under vote', () => {

      const state = Map({
        entries: List.of('Lisa\'s First Word', 'And Maggie Makes Three', 'Treehouse of Horror V')
      });
      const nextState = next(state);
      expect(nextState).to.equal(Map({
        vote: Map({
          pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
        }),
        entries: List.of('Treehouse of Horror V')
      }));
    });

  });

  describe('vote', () => {

    it('creates a tally for the voted entry', () => {
      const state = Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
      });
      const nextState = vote(state, 'Lisa\'s First Word');
      expect(nextState).to.equal(Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
        tally: Map({
          'Lisa\'s First Word': 1
        })
      }));
    });

    it('adds to existing tally for the voted entry', () => {

      const state = Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
        tally: Map({
          'Lisa\'s First Word': 3,
          'And Maggie Makes Three': 2
        }),
        entries: List()
      });

      const nextState = vote(state, 'Lisa\'s First Word');

      expect(nextState).to.equal(Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three'),
        tally: Map({
          'Lisa\'s First Word': 4,
          'And Maggie Makes Three': 2
        }),
        entries: List()
      }));

    });

    it('ignores entries voted on if they are not included in the current pair', () => {
      const state = Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
      });
      const nextState = vote(state, 'Homer the Heretic');
      expect(nextState).to.equal(Map({
        pair: List.of('Lisa\'s First Word', 'And Maggie Makes Three')
      }));
    });

  })

});
