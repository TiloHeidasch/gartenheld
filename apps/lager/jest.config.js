module.exports = {
  name: 'lager',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/lager',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
