import { err } from '../helpers/debug'

import messages from './messages'

import { formatMessage } from './format'

jest.mock('../helpers/debug', () => ({
  err: jest.fn(),
}))

describe('format', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('formatMessage', () => {
    describe('with valid message', () => {
      describe.each(Object.keys(messages))('%s', (language) => {
        it.each(Object.keys(messages[language]))('%s', (id) => {
          Object.defineProperty(navigator, 'language', {
            writable: true,
            value: language,
          })

          expect(formatMessage(id)).toBe(messages[language][id])
        })
      })

      describe('unsupported language (fallback to en)', () => {
        it.each(Object.keys(messages.en))('%s', (id) => {
          Object.defineProperty(navigator, 'language', {
            writable: true,
            value: 'unsupported',
          })

          expect(formatMessage(id)).toBe(messages.en[id])
        })
      })
    })

    it('with invalid message', () => {
      expect(formatMessage('invalid')).toBe('invalid')
      expect(err).toHaveBeenCalledWith('no message found for id "invalid"')
    })

    it('with overriden message', () => {
      expect(formatMessage('message', 'override')).toBe('override')
    })
  })
})
