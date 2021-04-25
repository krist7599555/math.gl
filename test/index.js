// Copyright (c) 2017 Uber Technologies, Inc.
// MIT License

require('reify');

const {configure} = require('@math.gl/core');

configure({debug: true});

require('./modules.spec');
