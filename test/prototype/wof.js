
var wof = require('../../prototype/wof');

/**
  Mock object used for all tests in this file

  The mock stores all function calls in an internal Array for
  later inspection during tests, this let's us know how many times
  each function was called and which arguments were provided.
**/
var Mock = function(){
  var calls = { addToken: [], setEdge: [], set: [] };
  this._calls = calls;

  // mock methods
  this.graph = {
    addToken: function(){ calls.addToken.push( arguments ); },
    setEdge: function(){ calls.setEdge.push( arguments ); }
  };
  this.store = {
    set: function( _, __, next ){
      calls.set.push( Array.prototype.slice.call( arguments, 0, 2 ) );
      next();
    }
  };
};
Mock.prototype.insertWofRecord = wof.insertWofRecord;
// End of Mock

module.exports.store_record = function(test, util) {

  test( 'empty data', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({}, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.deepEqual( mock._calls.setEdge, [] );
      t.deepEqual( mock._calls.set, [] );
      t.end();
    });
  });

  test( 'id only', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.deepEqual( mock._calls.setEdge, [] );
      t.deepEqual( mock._calls.set, [[
        1, {
          id: 1,
          name: undefined,
          names: {},
          placetype: undefined,
          population: undefined,
          abbr: undefined,
          lineage: undefined,
          geom: {
            area: undefined,
            bbox: undefined,
            lat: undefined,
            lon: undefined
          }
        }
      ]]);
      t.end();
    });
  });
};

module.exports.store_default_name = function(test, util) {

  test( 'name: no name', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].name, undefined);
      t.end();
    });
  });

  test( 'name: prefer label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:label': 'A',
      'wof:name': 'B'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].name, 'A');
      t.end();
    });
  });

  test( 'name: no label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:name': 'B'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].name, 'B');
      t.end();
    });
  });
};

module.exports.store_abbr = function(test, util) {

  test( 'abbr: no abbr', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].abbr, undefined);
      t.end();
    });
  });

  test( 'abbr: calls function', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'country',
      'wof:country_alpha3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].abbr, 'TEST');
      t.end();
    });
  });
};

module.exports.store_placetype = function(test, util) {

  test( 'placetype: no placetype', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].placetype, undefined);
      t.end();
    });
  });

  test( 'placetype: exists', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'AA'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].placetype, 'AA');
      t.end();
    });
  });
};

module.exports.store_population = function(test, util) {

  test( 'population: no population', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].population, undefined);
      t.end();
    });
  });

  test( 'population: calls function', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'mz:population': 999
    }, function(){
      t.deepEqual( mock._calls.set[0][1].population, 999);
      t.end();
    });
  });
};

module.exports.store_lineage = function(test, util) {

  test( 'lineage: no lineage', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].lineage, undefined);
      t.end();
    });
  });

  test( 'lineage: calls function', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:hierarchy': { a: 'b', c: 'd' }
    }, function(){
      t.deepEqual( mock._calls.set[0][1].lineage, { a: 'b', c: 'd' });
      t.end();
    });
  });
};

module.exports.store_geom = function(test, util) {

  test( 'geom: no area', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.area, undefined);
      t.end();
    });
  });

  test( 'geom: area defined', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'geom:area': 999
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.area, 999);
      t.end();
    });
  });

  test( 'geom: no bbox', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.bbox, undefined);
      t.end();
    });
  });

  test( 'geom: bbox prefer label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'lbl:bbox': 'ABC',
      'geom:bbox': 'DEF'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.bbox, 'ABC');
      t.end();
    });
  });

  test( 'geom: bbox no label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'geom:bbox': 'DEF'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.bbox, 'DEF');
      t.end();
    });
  });

  test( 'geom: no lat', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lat, undefined);
      t.end();
    });
  });

  test( 'geom: lat prefer label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'lbl:latitude': 1,
      'geom:latitude': 2
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lat, 1);
      t.end();
    });
  });

  test( 'geom: lat no label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'geom:latitude': 2
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lat, 2);
      t.end();
    });
  });

  test( 'geom: no lon', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lon, undefined);
      t.end();
    });
  });

  test( 'geom: lon prefer label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'lbl:longitude': 1,
      'geom:longitude': 2
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lon, 1);
      t.end();
    });
  });

  test( 'geom: lon no label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'geom:longitude': 2
    }, function(){
      t.deepEqual( mock._calls.set[0][1].geom.lon, 2);
      t.end();
    });
  });
};

module.exports.getAbbreviation = function(test, util) {

  test( 'no abbreviation', function(t) {
    t.equal( undefined, wof.getAbbreviation({}) );
    t.end();
  });

  test( 'country/dependency', function(t) {
    t.equal( undefined, wof.getAbbreviation({ 'wof:placetype': 'country' }) );
    t.equal( undefined, wof.getAbbreviation({ 'wof:placetype': 'dependency' }) );

    t.equal( undefined, wof.getAbbreviation({
      'wof:placetype': 'country',
      'wof:abbreviation': 'TEST2'
    }));
    t.equal( undefined, wof.getAbbreviation({
      'wof:placetype': 'dependency',
      'wof:abbreviation': 'TEST2'
    }));

    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'country',
      'wof:country_alpha3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));
    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'dependency',
      'wof:country_alpha3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));

    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'country',
      'ne:iso_a3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));
    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'dependency',
      'ne:iso_a3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));

    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'country',
      'wof:country_alpha3': 'TEST',
      'ne:iso_a3': 'TEST2',
      'wof:abbreviation': 'TEST3'
    }));
    t.equal( 'TEST', wof.getAbbreviation({
      'wof:placetype': 'dependency',
      'wof:country_alpha3': 'TEST',
      'ne:iso_a3': 'TEST2',
      'wof:abbreviation': 'TEST3'
    }));
    t.end();
  });

  test( 'wof:abbreviation', function(t) {
    t.equal( 'TEST2', wof.getAbbreviation({
      'ne:iso_a3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));
    t.equal( 'TEST2', wof.getAbbreviation({
      'ne:iso_a3': 'TEST',
      'wof:abbreviation': 'TEST2'
    }));
    t.end();
  });
};

module.exports.getPopulation = function(test, util) {

  test( 'no population', function(t) {
    t.equal( undefined, wof.getPopulation({}) );
    t.end();
  });

  var props = [ 'ne:pop_est', 'statoids:population', 'meso:pop', 'zs:pop10', 'qs:gn_pop', 'qs:pop',
                'gn:pop', 'gn:population', 'wk:population', 'wof:population', 'mz:population' ];

  test( 'population priority', function(t) {
    props.forEach( function( prop, x ){

      // build a properties object containing
      // progessively more of the target props
      var p = {};
      for( var y=0; y<=x; y++ ){ p[ prop ] = y+1; }

      t.equal( x+1, wof.getPopulation( p ) );
    });
    t.end();
  });

};

module.exports.isValidWofRecord = function(test, util) {

  test( 'valid id', function(t) {
    t.true( wof.isValidWofRecord( 1, {} ) );
    t.true( wof.isValidWofRecord( 999999, {} ) );
    t.end();
  });

  test( 'invalid id', function(t) {
    t.false( wof.isValidWofRecord( -1, {} ) );
    t.false( wof.isValidWofRecord( 0, {} ) );
    t.false( wof.isValidWofRecord( null, {} ) );
    t.end();
  });

  test( 'deprecated', function(t) {
    t.false( wof.isValidWofRecord( 1, { 'edtf:deprecated': 'any value' } ) );
    t.end();
  });

  test( 'not deprecated', function(t) {
    t.true( wof.isValidWofRecord( 1, { 'edtf:deprecated': '' } ) );
    t.true( wof.isValidWofRecord( 1, { 'edtf:deprecated': 'uuuu' } ) );
    t.end();
  });

  test( 'superseded', function(t) {
    t.false( wof.isValidWofRecord( 1, { 'wof:superseded_by': [ 'any value' ] } ) );
    t.end();
  });

  test( 'not superseded', function(t) {
    t.true( wof.isValidWofRecord( 1, { 'wof:superseded_by': [] } ) );
    t.true( wof.isValidWofRecord( 1, { 'wof:superseded_by': 'scalar' } ) );
    t.end();
  });

  test( 'not current', function(t) {
    t.false( wof.isValidWofRecord( 1, { 'mz:is_current': 0 } ) );
    t.false( wof.isValidWofRecord( 1, { 'mz:is_current': '0' } ) );
    t.end();
  });

  test( 'current', function(t) {
    t.true( wof.isValidWofRecord( 1, { 'mz:is_current': 1 } ) );
    t.true( wof.isValidWofRecord( 1, { 'mz:is_current': '1' } ) );
    t.true( wof.isValidWofRecord( 1, { 'mz:is_current': '' } ) );
    t.end();
  });

  test( 'default', function(t) {
    t.true( wof.isValidWofRecord( 1, {} ) );
    t.end();
  });
};

module.exports.add_token = function(test, util) {

  test( 'empty data', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({}, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.end();
    });
  });

  test( 'wof:abbreviation', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:abbreviation': 'EXAMPLE'
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 1 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'example' ] );
      t.end();
    });
  });

  test( 'index both wof:label and wof:name', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:label': 'EXAMPLE',
      'wof:name': 'EXAMPLE2'
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 2 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'example' ] );
      t.deepEqual( mock._calls.addToken[1][3], [ 'example2' ] );
      t.end();
    });
  });

  test( 'country/dependency - not one', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'ne:iso_a2': 'EX',
      'ne:iso_a3': 'EXA',
      'iso:country': 'EP',
      'wof:country_alpha3': 'EXP'
    }, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.end();
    });
  });

  test( 'country/dependency - is country', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'country',
      'ne:iso_a2': 'EX',
      'ne:iso_a3': 'EXA',
      'iso:country': 'EP',
      'wof:country_alpha3': 'EXP'
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 4 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'ex' ] );
      t.deepEqual( mock._calls.addToken[1][3], [ 'exa' ] );
      t.deepEqual( mock._calls.addToken[2][3], [ 'ep' ] );
      t.deepEqual( mock._calls.addToken[3][3], [ 'exp' ] );
      t.end();
    });
  });

  test( 'country/dependency - is country - missing iso:country', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'country',
      'ne:iso_a2': 'EX',
      'ne:iso_a3': 'EXA',
      'wof:country_alpha3': 'EXP'
    }, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.end();
    });
  });

  test( 'country/dependency - is dependency', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'dependency',
      'ne:iso_a2': 'EX',
      'ne:iso_a3': 'EXA',
      'iso:country': 'EP',
      'wof:country_alpha3': 'EXP'
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 4 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'ex' ] );
      t.deepEqual( mock._calls.addToken[1][3], [ 'exa' ] );
      t.deepEqual( mock._calls.addToken[2][3], [ 'ep' ] );
      t.deepEqual( mock._calls.addToken[3][3], [ 'exp' ] );
      t.end();
    });
  });

  test( 'country/dependency - is country - missing iso:country', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'dependency',
      'ne:iso_a2': 'EX',
      'ne:iso_a3': 'EXA',
      'wof:country_alpha3': 'EXP'
    }, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.end();
    });
  });

  test( 'country/dependency - dont import some problematic fields (see source)', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'wof:placetype': 'dependency',
      'iso:country': 'EP',
      'wof:country': 'TEST',
      'ne:abbrev': 'TEST2'
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 1 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'ep' ] );
      t.end();
    });
  });
};

module.exports.add_names = function(test, util) {

  test( 'no names', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.addToken, [] );
      t.end();
    });
  });

  test( 'tokens: supported name fields', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'name:foo_x_preferred': [ 'A', 'B' ],
      'name:foo_x_colloquial': [ 'C', 'D' ],
      'name:foo_x_variant': [ 'E', 'F' ],
      'name:foo_x_unknown': [ 'G', 'H' ], // we don't import the 'unknown' language type
      'name:foo_x_foobar': [ 'I', 'J' ], // made-up name
    }, function(){
      t.deepEqual( mock._calls.addToken.length, 6 );
      t.deepEqual( mock._calls.addToken[0][3], [ 'a' ] );
      t.deepEqual( mock._calls.addToken[1][3], [ 'b' ] );
      t.deepEqual( mock._calls.addToken[2][3], [ 'c' ] );
      t.deepEqual( mock._calls.addToken[3][3], [ 'd' ] );
      t.deepEqual( mock._calls.addToken[4][3], [ 'e' ] );
      t.deepEqual( mock._calls.addToken[5][3], [ 'f' ] );
      t.end();
    });
  });

  test( 'store: supported name fields', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1',
      'name:foo_x_preferred': [ 'A', 'B' ],
      'name:foo_x_colloquial': [ 'C', 'D' ],
      'name:foo_x_variant': [ 'E', 'F' ],
      'name:foo_x_unknown': [ 'G', 'H' ], // we don't import the 'unknown' language type
      'name:foo_x_foobar': [ 'I', 'J' ], // made-up name
      'name:bar_x_preferred': [ 'Y', 'Z' ],
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { foo: [ 'A', 'B' ], bar: [ 'Y', 'Z' ] });
      t.end();
    });
  });

};

// In the USA we would like to favor the 'wof:label' property over the 'name:eng_x_preferred' property.
module.exports.usa_english_name_override_with_label = function(test, util) {

  test( 'override name:eng_x_preferred with wof:label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 102085121,
      'wof:country': 'US',
      'wof:label': 'Lake County',
      'name:eng_x_preferred': [ 'Lake' ],
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { eng: [ 'Lake County' ] } );
      t.end();
    });
  });

  test( 'no country', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 102085121,
      'wof:label': 'Lake County',
      'name:eng_x_preferred': [ 'Lake' ],
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { eng: [ 'Lake' ] } );
      t.end();
    });
  });

  test( 'no label', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 102085121,
      'wof:country': 'US',
      'name:eng_x_preferred': [ 'Lake' ],
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { eng: [ 'Lake' ] } );
      t.end();
    });
  });

  test( 'no eng_x_preferred', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 102085121,
      'wof:country': 'US',
      'wof:label': 'Lake County'
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { eng: [ 'Lake County' ] } );
      t.end();
    });
  });

  test( 'wrong country', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 102085121,
      'wof:country': 'DE',
      'wof:label': 'Lake County',
      'name:eng_x_preferred': [ 'Lake' ],
    }, function(){
      t.deepEqual( mock._calls.set.length, 1 );
      t.deepEqual( mock._calls.set[0][1].names, { eng: [ 'Lake' ] } );
      t.end();
    });
  });
};

module.exports.set_edges = function(test, util) {

  test( 'no hierarchy', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': '1'
    }, function(){
      t.deepEqual( mock._calls.setEdge, [] );
      t.end();
    });
  });

  test( 'hierarchy: single lineage', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 100,
      'wof:hierarchy': [{
        'continent_id':     101,
        'country_id':       102,
        'county_id':        103,
        'localadmin_id':    104,
        'locality_id':      105,
        'macrocounty_id':   106,
        'macroregion_id':   107,
        'postalcode_id':    108,
        'region_id':        109
      }]
    }, function(){
      t.deepEqual( mock._calls.setEdge.length, 9 );
      mock._calls.setEdge.forEach( function( c, i ){
        t.deepEqual( c[0], 101+i );
        t.deepEqual( c[1], 100 );
      });
      t.end();
    });
  });

  test( 'hierarchy: multiple lineage', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 100,
      'wof:hierarchy': [{
        'continent_id':     101,
        'country_id':       102,
        'county_id':        103,
        'localadmin_id':    104,
        'locality_id':      105,
        'macrocounty_id':   106,
        'macroregion_id':   107,
        'postalcode_id':    108,
        'region_id':        109
      },{
        'continent_id':     110,
        'country_id':       111,
        'county_id':        112,
        'localadmin_id':    113,
        'locality_id':      114,
        'macrocounty_id':   115,
        'macroregion_id':   116,
        'postalcode_id':    117,
        'region_id':        118
      }]
    }, function(){
      t.deepEqual( mock._calls.setEdge.length, 18 );
      mock._calls.setEdge.forEach( function( c, i ){
        t.deepEqual( c[0], 101+i );
        t.deepEqual( c[1], 100 );
      });
      t.end();
    });
  });

  test( 'hierarchy: invalid values', function(t) {
    var mock = new Mock();
    mock.insertWofRecord({
      'wof:id': 100,
      'wof:hierarchy': [{
        'self_id':          100,
        'null_id':          0,
        'invalid_id':       -1
      }]
    }, function(){
      t.deepEqual( mock._calls.setEdge.length, 0 );
      t.end();
    });
  });

};
