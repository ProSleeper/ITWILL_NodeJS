/*
GeoSpatial Schema Definition
 
Geometry
	'type': {type: String, enum: ["Point", "MultiPoint", "LineString",
	"MultiLineString", "Polygon", "MultiPolygon"] },
	coordinates: []
  
Point
	'type': {type: String, 'default': "Point"},
	coordinates: [{type: "Number"}]
  
MultiPoint
	'type': {type: String, default: "MultiPoint"},
	coordinates: [{type: "Array"}]
  
MultiLineString
	'type': {type: String, default: "MultiLineString"},
	coordinates: [{type: "Array"}]
 
Polygon
	'type': {type: String, default: "Polygon"},
	coordinates: [{type: "Array"}]
 
MultiPolygon
	'type': {type: String, default: "MultiPolygon"},
	coordinates: [{type: "Array"}]
  
GeometryCollection
	'type': {type: String, default: "GeometryCollection"},
	geometries: [Geometry]
  
Feature
	id: {type: "String"},
	'type': {type: String, default: "Feature"},
	geometry: Geometry,
	properties: {type: "Object"}
  
FeatureCollection
	'type': {type: String, default: "FeatureCollection"},
	features: [Feature]
 
*/

const Schema = {};

Schema.createSchema = function(mongoose) {
  //스키마 정의
  const CoffeeShopSchema = mongoose.Schema({
    name: { type: String, index: 'hashed' },
    addr: { type: String },
    tel: { type: String },
    geometry: {
      type: { type: String, 'default': 'Point' },
      coordinates: [{ type: "Number" }]
    },
    created: { type: Date, 'default': Date.now }
  });

  //geometry에 공간 인덱싱을 적용
  CoffeeShopSchema.index({ geometry: '2dsphere' });
  //모든 스타벅스 조회
  CoffeeShopSchema.static('findAll', function(callback){
    return this.find({}, callback);
  })

  console.log('CoffeeShopSchema 정의함')
  return CoffeeShopSchema;
}

module.exports = Schema;