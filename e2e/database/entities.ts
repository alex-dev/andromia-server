export class Entities {
  public static invalidAuthentication = [
    { name: 'invalid', password: 'invalid'}
  ];
  public static validAuthentication = [
    { name: 'user0', password: 'valid' },
    { name: 'user0', password: 'valid' }
  ];

  public static invalidUnitKey = 'invalid';
  public static validUnitKeys = new Map([
    [Entities.validAuthentication[0].name, ['']]
  ]);

  public static invalidExplorationKey = 'invalid';
  public static validExplorationKeys = new Map([
    [Entities.validAuthentication[0].name, ['']]
  ]);

  public static invalidUnit = 'invalidunit';
  public static validUnit = 'validunit';
}
