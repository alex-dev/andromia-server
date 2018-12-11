import { expect } from 'chai';
import * as moment from 'moment';

export function validateSets(data: any) {
  expect(data).to.be.an('array').that.is.not.empty;
  data.forEach((item: any) => {
    expect(item).to.be.a('string');
  });
}

export function validateRunes(data: any) {
  expect(data).to.be.an('array').that.is.not.empty;
  data.forEach((item: any) => {
    expect(item).to.be.a('string');
  });
}

export function validateLocations(data: any) {
  expect(data).to.be.an('array').that.is.not.empty;
  data.forEach((item: any) => {
    expect(item).to.be.a('string');
  });
}

export function validateUnits(data: any) {
  expect(data).to.be.an('array');
  data.forEach((item: any) => {
    validateUnit(item);
  });
}

export function validateUnit(data: any) {
  expect(data).to.haveOwnProperty('href').that.is.a('string');
  expect(data).to.haveOwnProperty('number').that.is.a('number');
  expect(data).to.haveOwnProperty('name').that.is.a('string');
  expect(data).to.haveOwnProperty('set').that.is.a('string');
  expect(data).to.haveOwnProperty('life').that.is.a('number');
  expect(data).to.haveOwnProperty('speed').that.is.a('number');
  expect(data).to.haveOwnProperty('imageURL').that.is.a('string');
  expect(data).to.haveOwnProperty('affinity').that.is.a('string');
  expect(data).to.haveOwnProperty('runes').that.is.an('object');
  expect(data.runes).to.haveOwnProperty('weapons').that.is.an('array');
  data.runes.weapons.forEach((item: any) => {
    expect(item).to.be.a('string');
  });
  expect(data.abilities).to.haveOwnProperty('abilities').that.is.an('array');
  data.runes.abilities.forEach((item: any) => {
    expect(item).to.be.a('string');
  });
}

export function validateOwnedUnits(data: any) {
  expect(data).to.be.an('array');
  data.forEach((item: any) => {
    validateOwnedUnit(item);
  });
}

export function validateOwnedUnit(data: any) {
  console.log(data);
  expect(data).to.haveOwnProperty('href').that.is.a('string');
  validateUnit(data);
  validateRuneDictionnary(data, 'kernel');
  expect(data).to.haveOwnProperty('uuid').that.is.a('string');
}

export function validateExplorations(data: any) {
  expect(data).to.be.an('array');
  data.forEach((item: any) => {
    validateExploration(item);
  });
}

export function validateExploration(data: any) {
  expect(data).to.haveOwnProperty('href').that.is.a('string');
  validateDate(data, 'started');
  validateDate(data, 'ended');
  validateRuneDictionnary(data, 'runes');
  expect(data).to.haveOwnProperty('from').that.is.a('string');
  expect(data).to.haveOwnProperty('to').that.is.a('string');
  expect(data).to.haveOwnProperty('unit').that.is.an('object');
  expect(data.unit).to.haveOwnProperty('accepted').that.is.a('boolean');
  expect(data.unit).to.haveOwnProperty('unit').that.is.an('object');
  validateOwnedUnit(data.unit.unit);
}

export function validateExplorateurs(data: any) {
  expect(data).to.be.an('array');
  data.forEach((item: any) => {
    validateExplorateur(item);
  });
}

export function validateExplorateur(data: any, expandUnits = false, expandExplorations = false) {
  expect(data).to.haveOwnProperty('href').that.is.a('string');
  expect(data).to.haveOwnProperty('email').that.is.a('string');
  expect(data).to.haveOwnProperty('name').that.is.a('string');
  expect(data).to.not.haveOwnProperty('password');
  expect(data).to.haveOwnProperty('location').that.is.a('string');
  expect(data).to.haveOwnProperty('inox').that.is.a('number');
  validateRuneDictionnary(data, 'runes');
  if (expandExplorations) {
    expect(data).to.haveOwnProperty('explorations').that.is.an('array');
    data.explorations.forEach((item: any) => {
      validateOwnedUnit(item);
    });
  } else {
    expect(data).to.haveOwnProperty('explorations').that.is.a('string');
    expect(data.explorations.includes(`${data.name}/explorations`)).to.be.true;
  }
  if (expandUnits) {
    expect(data).to.haveOwnProperty('units').that.is.an('array');
    data.units.forEach((item: any) => {
      validateOwnedUnit(item);
    });
  } else {
    expect(data).to.haveOwnProperty('units').that.is.a('string');
    expect(data.units.includes(`${data.name}/units`)).to.be.true;
  }
}

export function validateRunesCounts(data: any) {
  expect(data).to.be.an('object');
  Object.entries(data).forEach(([ability, count]) => { 
    expect(ability).to.be.a('string'); 
    expect(count).to.be.a('number'); 
    expect(count as number % 1).to.be.equal(0); 
  });
}

function validateDate(data: any, property: string) {
  expect(data).to.haveOwnProperty(property).that.is.a('string');
  expect(moment(data[property]).isValid()).to.be.true;
}

function validateRuneDictionnary(data: any, property: string) {
  expect(data).to.haveOwnProperty(property).that.is.an('object');
  validateRunesCounts(data[property]);
}
