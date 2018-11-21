import { expect } from 'chai';

export function validateCollection(collection: any) {
  expect(collection).to.haveOwnProperty('item').that.is.an('array');
  expect(collection).to.haveOwnProperty('index').that.is.a('number').that.is.at.least(0);
  expect(collection).to.haveOwnProperty('count').that.is.a('number').that.is.at.least(0);
  expect(collection).to.haveOwnProperty('total').that.is.a('number').that.is.at.least(0);
  expect(collection.total).to.be.at.least(collection.count);
  expect(collection.total % collection.count).to.be.at.least(collection.index);
  expect(collection).to.haveOwnProperty('_links').that.is.an('object');
  expect(collection._links).to.haveOwnProperty('self').that.is.a('string');
  expect(collection._links).to.haveOwnProperty('first').that.is.a('string');
  expect(collection._links).to.haveOwnProperty('last').that.is.a('string');
  expect(collection._links).to.haveOwnProperty('next').that.is.a('string');
  expect(collection._links).to.haveOwnProperty('prev').that.is.a('string');
}
