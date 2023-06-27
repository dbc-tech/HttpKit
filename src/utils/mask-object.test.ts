import { maskObject } from './mask-object';

describe('maskObject', () => {
  it.each`
    value
    ${'test'}
    ${1}
    ${true}
    ${null}
    ${undefined}
    ${[1, 2, 3]}
  `('should return same value', async ({ value }) => {
    expect(maskObject(value)).toEqual(value);
  });

  it('should return the original object if no options are provided', () => {
    const obj = { a: 1, b: 2 };
    expect(maskObject(obj)).toEqual(obj);
  });

  it('should hide properties specified in the options', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const options = { hideProperties: ['b'] };
    expect(maskObject(obj, options)).toEqual({ a: 1, c: 3 });
  });

  it('should mask properties specified in the options', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const options = { maskProperties: ['b'] };
    expect(maskObject(obj, options)).toEqual({ a: 1, b: '*', c: 3 });
  });

  it('should recursively hide and mask properties', () => {
    const obj = { a: 1, b: { c: 2, d: 3 }, e: 4 };
    const options = { hideProperties: ['c'], maskProperties: ['d'] };
    expect(maskObject(obj, options)).toEqual({ a: 1, b: { d: '*' }, e: 4 });
  });

  it('should mask string with same length', () => {
    const obj = { a: 1, b: { c: 2, d: 'abc' }, e: 4 };
    const options = { maskProperties: ['d'] };
    expect(maskObject(obj, options)).toEqual({
      a: 1,
      b: { c: 2, d: '***' },
      e: 4,
    });
  });

  it('should not mask whole objects', () => {
    const obj = { a: 1, b: { c: 2, d: 'abc' }, e: 4 };
    const options = { maskProperties: ['b'] };
    expect(maskObject(obj, options)).toEqual({
      a: 1,
      b: { c: 2, d: 'abc' },
      e: 4,
    });
  });

  it('should mask properties within an array', () => {
    const obj = { a: 1, b: [{ c: 3 }, { d: 4 }], e: 5 };
    const options = { maskProperties: ['c'] };
    expect(maskObject(obj, options)).toEqual({
      a: 1,
      b: [{ c: '*' }, { d: 4 }],
      e: 5,
    });
  });

  it('should ignore undefined properties within an array', () => {
    const obj = { a: 1, b: [{ c: 3 }, { d: 4 }, { e: undefined }], f: 5 };
    expect(maskObject(obj)).toEqual({
      a: 1,
      b: [{ c: 3 }, { d: 4 }, { e: undefined }],
      f: 5,
    });
  });

  it('should ignore null properties within an array', () => {
    const obj = { a: 1, b: [{ c: 3 }, { d: 4 }, { e: null }], f: 5 };
    expect(maskObject(obj)).toEqual({
      a: 1,
      b: [{ c: 3 }, { d: 4 }, { e: null }],
      f: 5,
    });
  });

  it('should ignore empty array', () => {
    const obj = { a: 1, b: [] };
    expect(maskObject(obj)).toEqual({
      a: 1,
      b: [],
    });
  });

  it('should ignore empty object', () => {
    const obj = { a: 1, b: {} };
    expect(maskObject(obj)).toEqual({
      a: 1,
      b: {},
    });
  });

  it('should ignore array of empty object', () => {
    const obj = { a: 1, b: [{}] };
    expect(maskObject(obj)).toEqual({
      a: 1,
      b: [{}],
    });
  });

  it('should hide properties within an array', () => {
    const obj = { a: 1, b: [{ c: 3 }, { d: 4 }], e: 5 };
    const options = { hideProperties: ['c'] };
    expect(maskObject(obj, options)).toEqual({
      a: 1,
      b: [{ c: undefined }, { d: 4 }],
      e: 5,
    });
  });

  it('should correctly mask a complex object', () => {
    const obj = {
      method: 'filterByCrmSync',
      crmApiKeys: [
        {
          id: '2',
          apiKey: 'xxxxxxxxxx22cf-ee91-9f94-9cbe-9966-1e45-234b-f051',
          clientId:
            'xxxxxxxxxx9kYmNzYW5kYm94LmFnZW50Ym94Y3JtLmNvbS5hdS9hZG1pbi8',
          hash: 'ABApiKey',
          createdAt: '2023-03-16T06:24:44.000Z',
          updatedAt: '2023-03-16T06:24:44.000Z',
          agencies: [
            {
              id: '2',
              name: 'AgentBox Test Account',
              crmOfficeId: '1',
              status: 'Enabled',
              unitNumber: '1',
              streetAddress: 'test street',
              suburb: 'QA Suburb',
              state: 'QLD',
              postcode: '4000',
              country: 'Australia',
              website: 'offertoown.cc',
              phone: '0400000000',
              email: 'qa@dbc.com.au',
              hash: 'AgentBoxHash',
              crmSync: true,
              timeZone: 'Australia/Sydney',
              displayName: 'd AgentBox Test Account',
              primaryColor: '241, 242, 242, 1',
              logoImage: 'agentbox-logo.png',
              rexAccountId: null,
              createdAt: '2023-03-16T06:24:46.000Z',
              updatedAt: '2023-03-21T03:43:12.000Z',
              isTestAccount: true,
              operationalStates: ['QLD', 'NSW'],
            },
          ],
          crm: {
            id: '2',
            name: 'AgentBox',
            createdAt: '2023-03-16T06:24:42.000Z',
            updatedAt: '2023-03-16T06:24:42.000Z',
          },
        },
      ],
    };
    const options = {
      maskProperties: ['apiKey', 'clientId', 'email', 'phone'],
    };
    const result = maskObject(obj, options);
    expect(result).toEqual({
      method: 'filterByCrmSync',
      crmApiKeys: [
        {
          id: '2',
          apiKey: '*************************************************',
          clientId:
            '***********************************************************',
          hash: 'ABApiKey',
          createdAt: '2023-03-16T06:24:44.000Z',
          updatedAt: '2023-03-16T06:24:44.000Z',
          agencies: [
            {
              id: '2',
              name: 'AgentBox Test Account',
              crmOfficeId: '1',
              status: 'Enabled',
              unitNumber: '1',
              streetAddress: 'test street',
              suburb: 'QA Suburb',
              state: 'QLD',
              postcode: '4000',
              country: 'Australia',
              website: 'offertoown.cc',
              phone: '**********',
              email: '*************',
              hash: 'AgentBoxHash',
              crmSync: true,
              timeZone: 'Australia/Sydney',
              displayName: 'd AgentBox Test Account',
              primaryColor: '241, 242, 242, 1',
              logoImage: 'agentbox-logo.png',
              rexAccountId: null,
              createdAt: '2023-03-16T06:24:46.000Z',
              updatedAt: '2023-03-21T03:43:12.000Z',
              isTestAccount: true,
              operationalStates: ['QLD', 'NSW'],
            },
          ],
          crm: {
            id: '2',
            name: 'AgentBox',
            createdAt: '2023-03-16T06:24:42.000Z',
            updatedAt: '2023-03-16T06:24:42.000Z',
          },
        },
      ],
    });
    // Original should not be mutated
    expect(obj).toEqual({
      method: 'filterByCrmSync',
      crmApiKeys: [
        {
          id: '2',
          apiKey: 'xxxxxxxxxx22cf-ee91-9f94-9cbe-9966-1e45-234b-f051',
          clientId:
            'xxxxxxxxxx9kYmNzYW5kYm94LmFnZW50Ym94Y3JtLmNvbS5hdS9hZG1pbi8',
          hash: 'ABApiKey',
          createdAt: '2023-03-16T06:24:44.000Z',
          updatedAt: '2023-03-16T06:24:44.000Z',
          agencies: [
            {
              id: '2',
              name: 'AgentBox Test Account',
              crmOfficeId: '1',
              status: 'Enabled',
              unitNumber: '1',
              streetAddress: 'test street',
              suburb: 'QA Suburb',
              state: 'QLD',
              postcode: '4000',
              country: 'Australia',
              website: 'offertoown.cc',
              phone: '0400000000',
              email: 'qa@dbc.com.au',
              hash: 'AgentBoxHash',
              crmSync: true,
              timeZone: 'Australia/Sydney',
              displayName: 'd AgentBox Test Account',
              primaryColor: '241, 242, 242, 1',
              logoImage: 'agentbox-logo.png',
              rexAccountId: null,
              createdAt: '2023-03-16T06:24:46.000Z',
              updatedAt: '2023-03-21T03:43:12.000Z',
              isTestAccount: true,
              operationalStates: ['QLD', 'NSW'],
            },
          ],
          crm: {
            id: '2',
            name: 'AgentBox',
            createdAt: '2023-03-16T06:24:42.000Z',
            updatedAt: '2023-03-16T06:24:42.000Z',
          },
        },
      ],
    });
  });
});
