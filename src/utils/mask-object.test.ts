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

  it('should ignore null properties', () => {
    const obj = {
      method: 'putJson',
      url: 'https://api.offertoown.cc/oto/v1/staff/sdw2mfxs',
      json: {
        firstName: 'Offer to Own',
        lastName: 'Integration',
        mobileNumber: null,
        email: 'crm@offertoown.com.au',
        crmStaffRole: 'admin',
        jobTitle: null,
        showMobile: false,
        crmActive: true,
      },
    };
    expect(maskObject(obj)).toEqual({
      method: 'putJson',
      url: 'https://api.offertoown.cc/oto/v1/staff/sdw2mfxs',
      json: {
        firstName: 'Offer to Own',
        lastName: 'Integration',
        mobileNumber: null,
        email: 'crm@offertoown.com.au',
        crmStaffRole: 'admin',
        jobTitle: null,
        showMobile: false,
        crmActive: true,
      },
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
      method: 'getJson',
      url: 'https://api.agentboxcrm.com.au/inspections',
      gotOptions: {
        headers: {
          'X-Client-ID': 'aHR0crgwok43-0igermp34-0jkvwa4pm4',
          'X-API-Key': '7f8e377a-7a06-45a1-86c5-e655d6bc792b',
        },
        searchParams: {
          limit: 0,
          include: 'contact,listing',
          'filter[modifiedAfter]': '2023-06-23T06:33:29.398Z',
          version: 2,
        },
      },
    };
    const options = { maskProperties: ['X-Client-ID', 'X-API-Key'] };
    const result = maskObject(obj, options);
    expect(result).toEqual({
      method: 'getJson',
      url: 'https://api.agentboxcrm.com.au/inspections',
      gotOptions: {
        headers: {
          'X-Client-ID': '*********************************',
          'X-API-Key': '************************************',
        },
        searchParams: {
          limit: 0,
          include: 'contact,listing',
          'filter[modifiedAfter]': '2023-06-23T06:33:29.398Z',
          version: 2,
        },
      },
    });
    // Original should not be mutated
    expect(obj).toEqual({
      method: 'getJson',
      url: 'https://api.agentboxcrm.com.au/inspections',
      gotOptions: {
        headers: {
          'X-Client-ID': 'aHR0crgwok43-0igermp34-0jkvwa4pm4',
          'X-API-Key': '7f8e377a-7a06-45a1-86c5-e655d6bc792b',
        },
        searchParams: {
          limit: 0,
          include: 'contact,listing',
          'filter[modifiedAfter]': '2023-06-23T06:33:29.398Z',
          version: 2,
        },
      },
    });
  });
});
