// based on https://github.com/rluque8/nested-mask-attributes with various fixes including handling arrays
export type MaskOptions = {
  maskProperties?: string[];
  hideProperties?: string[];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const maskObject = (object: any, options?: MaskOptions) => {
  if (!object || typeof object !== 'object') return object;
  if (!options?.maskProperties && !options?.hideProperties) return object;

  const copyObject = JSON.parse(JSON.stringify(object));
  recursiveMask(copyObject, options);
  return copyObject;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const recursiveMask = (object: any, options: MaskOptions) => {
  Object.keys(object).forEach((key) => {
    if (typeof object[key] === 'object' && !Array.isArray(object[key])) {
      recursiveMask(object[key], options);
    } else if (typeof object[key] === 'object' && Array.isArray(object[key])) {
      for (const obj of object[key]) {
        recursiveMask(obj, options);
      }
    } else {
      if (options.hideProperties?.includes(key)) {
        executeAction(object, key, 'hide');
      } else if (options.maskProperties?.includes(key)) {
        executeAction(object, key, 'mask');
      }
      return;
    }
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeAction = (object: any, key: string, option: 'mask' | 'hide') => {
  switch (option) {
    case 'hide': {
      object[key] = undefined;
      break;
    }
    case 'mask': {
      const length = getLengthOfAttribute(object[key]);

      object[key] = generateString(length, '*');
      break;
    }
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLengthOfAttribute = (attrValue: any) =>
  Array.isArray(attrValue) ? attrValue.length : attrValue.toString().length;

const generateString = (length: number, char = '*') => char.repeat(length);
