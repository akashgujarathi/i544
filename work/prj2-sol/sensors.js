'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

  constructor(client, db){
    this.client = client;
    this.db =db;
  }
  
  /** Return a new instance of this class with database as
   *  per mongoDbUrl.  Note that mongoDbUrl is expected to
   *  be of the form mongodb://HOST:PORT/DB.
   */
  static async newSensors(mongoDbUrl) {
   
    /*
     *  Following code is to 
     *  seperate url and database name from mongoDbUrl
     *  url = mongodb://HOST:PORT
     *  dbName = DB
     */ 
    
    let parameter = mongoDbUrl.toString();
    let url = parameter.substring(0, parameter.lastIndexOf("/"));
    let dbName = mongoDbUrl.toString().split('/').pop();
    let client; 
    let db;
    
    try {
      client = await mongo.connect(url, MONGO_OPTIONS);
      db = client.db(dbName);    
    } catch (error) {
      console.log(error);
    }
    return new Sensors(client,db);
  }

  /** Release all resources held by this Sensors instance.
   *  Specifically, close any database connections.
   */
  async close() {
    await this.client.close();
  }

  /** Clear database */
  async clear() {
    await this.db.dropDatabase();
  }

  /** Subject to field validation as per validate('addSensorType',
   *  info), add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    /**
     *  Collection name 
     */
    const collectionName = "SensorType";

    try {
      
      /**
       *  Check if sensorType already exist
       *  if yes, delete the old data and insert the new data
       *  else add new data 
       */

      if( !(await this.db.collection(collectionName).findOne({"id": sensorType.id})) ){
        await this.db.collection(collectionName).insertOne(sensorType);
      }
      else{
        await this.db.collection(collectionName).deleteOne({"id": sensorType.id});
        await this.db.collection(collectionName).insertOne(sensorType);
      } 
    } catch (error) {
      console.log(error);
    }
  }
  
  /** Subject to field validation as per validate('addSensor', info)
   *  add sensor specified by info to this.  Note that info.model must
   *  specify the id of an existing sensor-type.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);

    /**
     *  Collection name 
     */
    const collectionName = "Sensor";

    try {
      
      /**
       *  Check if sensor already exist
       *  if yes, delete the old data and insert the new data
       *  else add new data 
       */
      if( !(await this.db.collection(collectionName).findOne({"id": sensor.id})) ){
        await this.db.collection(collectionName).insertOne(sensor);
      }
      else{
        await this.db.collection(collectionName).deleteOne({"id": sensor.id});
        await this.db.collection(collectionName).insertOne(sensor);
      }

    }catch(error){
      console.log(error)
    }
  }

  /** Subject to field validation as per validate('addSensorData',
   *  info), add reading given by info for sensor specified by
   *  info.sensorId to this. Note that info.sensorId must specify the
   *  id of an existing sensor.  Replace any earlier reading having
   *  the same timestamp for the same sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);

    /**
     *  Collection name 
     */
    const collectionName = "SensorData";

    try {
      
      /**
       *  Check if sensordata already exist with same timestamp and sensorID
       *  if yes, delete the old data and insert the new data
       *  else add new data 
       */
      if( !(await this.db.collection(collectionName).findOne({"sensorId": sensorData.sensorId, "timestamp": sensorData.timestamp})) ){
        await this.db.collection(collectionName).insertOne(sensorData);
      }
      else{
        await this.db.collection(collectionName).deleteOne({"sensorId": sensorData.sensorId, "timestamp": sensorData.timestamp});
        await this.db.collection(collectionName).insertOne(sensorData);
      }

    }catch(error){
      console.log(error)
    }
    
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorTypes', info), return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types (except for meta-properties starting
   *  with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index
   *  (when set to the lastIndex) and _count search-spec
   *  meta-parameters can be used in successive calls to allow
   *  scrolling through the collection of all sensor-types which meet
   *  some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorTypes(info) {
    //@TODO index
    const searchSpecs = validate('findSensorTypes', info);
    /**
     *  Assigning collection name   
     */
    const collectionName = "SensorType";

    /**
     *  Remove index and count from object info 
     *  so as to directly use info to find in database
     *  store the value of index and count     
     */
    let index;
    let count;
    if(info._index !== undefined){
      index = info._index;
      delete info._index;
    }
    if(info._count !== undefined){
      count = info._count;
      delete info._count;
    }
    
    /**
     * Code to get required document from mongoDB
     */
    const sortAscending = {"id": 1};
    let rArray = await this.db.collection(collectionName).find(info).sort(sortAscending).toArray()
    if(rArray.length == 0){
      let x  = Object.keys(info)
      let y = info[x]
      const err = `${x} : ${y} not found`;
      throw [new AppError('X_ID', err)];
    }
    let tSize = await this.db.collection(collectionName).countDocuments();
    let tArray = [];
    let nI = searchSpecs._index;

    for(let i = searchSpecs._index; i < tSize; i++){
      if(searchSpecs._count)
      {
        if(rArray[i])
        {
          tArray.push(rArray[i]);
          searchSpecs._count--;
        }
      }else{
        break;
      }
      nI++;
    }
    tArray.filter(x => delete x._id);
    /**
     * Code to get the next index
     */
    if(nI > (tSize-1)){
      nI = - (nI%(tSize-1))
    }
  
    return { data: tArray, nextIndex: nI }
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when 
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO index 
    const searchSpecs = validate('findSensors', info);
    /**
     *  Assigning collection name   
     */
    const collectionName = "Sensor";
    /**
     *  Remove index and count from object info 
     *  so as to directly use info to find in database
     *  store the value of index and count     
     */
    let index;
    let count;
    if(info._index !== undefined){
      index = info._index;
      delete info._index;
    }
    if(info._count !== undefined){
      count = info._count;
      delete info._count;
    }
    /**
     *  Sort in ascending order of ID 
     */
    const sortAscending = {"id": 1};
    let rArray = await this.db.collection(collectionName).find(info).sort(sortAscending).toArray()
    

    let tSize = await this.db.collection(collectionName).countDocuments();
    let tArray = [];
    let nI = searchSpecs._index;
    /**
     *  Search data from mongo until count 
     */
    for(let i = searchSpecs._index; i < tSize; i++){
      if(searchSpecs._count)
      {
        if(rArray[i])
        {
          tArray.push(rArray[i]);
          searchSpecs._count--;
        }
      }else{
        break;
      }
      nI++;
    }
    /*
    *   Filter out default mongo ID 
    */
    tArray.filter(x => delete x._id);
    /**
     * Code to get the next index
     */
    if(nI > (tSize-1)){
      nI = - (nI%(tSize-1))
    }

    return { data: tArray, nextIndex: nI };
  }
  
  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   * 
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   * 
   *  If info specifies a truthy value for a doDetail property, 
   *  then the returned object will have additional 
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);
    /**
     *  Assigning collection name   
     */
    const collectionName = "SensorData";
    /**
     *  Remove statuses and count from object info 
     *  so as to directly use info to find in database
     *  store the value of index and count     
     */
    
    if(info.statuses !== undefined){
      delete info.statuses;
    }
    if(info._count !== undefined){
      delete info._count;
    }
    if(info._doDetail !== undefined){
      delete info._doDetail;
    }
    if(info.timestamp !== undefined){
      delete info.timestamp
    }   
    /**
     *  Sort in decending order of timestamp 
     */
    let sortDecending  = {"timestamp": -1}
    /**
     *  Search data from mongo until count 
     */
    let rArray = await this.db.collection(collectionName).find(info).sort(sortDecending).toArray();
    if(rArray.length === 0){
      let x  = Object.keys(info)
      let y = info[x]
      const err = `${x} : ${y} not found`;
      throw [new AppError('X_ID', err)];
    }
    /*
    *   Filter out default mongo ID 
    */
    rArray.filter(x=> delete x._id);
    /**
     *  Get data from SensorType and Sensors for statuses 
     */
    let forSensor = await this.db.collection("Sensor").find({"id":info.sensorId}).toArray();
    let sensorMin = forSensor[0].expected.min;
    let sensorMax = forSensor[0].expected.max;
    let getModel = forSensor[0].model;
    let forSensorType = await this.db.collection("SensorType").find({"id": getModel}).toArray();
    let sensorTypeMin = forSensorType[0].limits.min;
    let sensorTypeMax = forSensorType[0].limits.max;
    
    let itr = searchSpecs.statuses;
    let a = itr.values();
    let b = a.next().value;
    let c = a.next().value;
    let d = a.next().value;
   /**
    *   Add statuses to each document 
    */
    for(const x of rArray){ 
      if((sensorTypeMin > x.value) || ( x.value >  sensorTypeMax) ){
        x.status = "error"
      }
      else if(( (sensorMin > x.value) || (sensorMax < x.value) )){
        x.status = "outOfRange"
      }
      else{
        x.status = "ok"
      }
    }
    /**
     *  Filter data according to statues given in the specification
     */
    let tArray = [];
    for(const x of rArray){
      if( (x.status === b ) || (x.status === c ) || (x.status === d)){
        if(x.timestamp <= searchSpecs.timestamp){
          tArray.push(x);

        }
      }
    }
    /**
     *  Slice array acc to the count
     */

    tArray = tArray.slice(0,searchSpecs._count);
    tArray.filter(x => delete x.sensorId)
    /**
     * If _doDetails is true add sensorType and Sensor
     */
    if(searchSpecs._doDetail){
      forSensorType.filter(x => delete x._id);
      forSensor.filter(x => delete x._id);  
        return {"data": tArray,
        "sensorType":forSensorType[0], "sensor":forSensor[0]
      }
    }

    return { data: tArray, };
  } 
} //class Sensors

module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}

