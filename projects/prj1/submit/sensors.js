'use strict';

const assert = require('assert');

class Sensors {

  constructor() {
    //@TODO
    this.sensorTypeMap = {}
    this.sensorMap = {}
    this.sensorDataMap = new Array()
  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
    this.sensorTypeMap = null
    this.sensorMap = null
    this.sensorDataMap = null
  }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */

  async addSensorType(info) 
  {
    const sensorType = validate('addSensorType', info);
     //@TODO
    this.sensorTypeMap[sensorType.id]  = sensorType 
  }
  
  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    if(this.sensorTypeMap[sensor.model]!=null && this.sensorTypeMap[sensor.model]!= undefined)
    {
      this.sensorMap[sensor.id] = sensor
    }    
  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO
    this.sensorDataMap.push(sensorData)
  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO
    
    let keys = Object.keys(info)
    let nextIndex = searchSpecs.index
    let arr = new Array()
    let keysMap = Object.keys(this.sensorTypeMap)
    let count_default = 0
    let arrError = new Array()
    keysMap.sort()
    /*
    * Default condition : find sensor-type
    */
    if(keys[0] === "index" || keys[0] === undefined)
    {  
      for(let i = searchSpecs.index; i<(searchSpecs.index+searchSpecs.count); i++)
      {
          arr.push(this.sensorTypeMap[keysMap[i]])
          nextIndex++;
      }
    }
    else if(keys[0] === "id" || keys[0] === "sensorId" )  //Check condition if ID not found
    {
      if(this.sensorTypeMap[info.id] === null || this.sensorTypeMap[info.id] === undefined)
      {
        return ["unknown sensor id" + info.id ]
      }
       arr.push(this.sensorTypeMap[info.id])
    }

    else if(keys[0] === "quantity")
    {
      if(keys.length===1)
      {
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].quantity === info.quantity && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++
        }
      }
      else
      {
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].quantity === info.quantity && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++;
        }
      }
    }
    
    else if(keys[0] === "manufacturer")
    {
      if(keys.length===1)
      {
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].manufacturer === info.manufacturer && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++
        }
      }
      else
      {
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].manufacturer === info.manufacturer && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++;
        }
      }
    }
    
    else if(keys[0] === "modelNumber")
    {
      if(keys.length===1)
      {
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].modelNumber === info.modelNumber && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++
        }
      }
      else
      {
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].modelNumber === info.modelNumber && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++;
        }
      }
    }

    else if(keys[0] === "unit")
    {
      if(keys.length===1)
      {
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].unit === info.unit && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++
        }
      }
      else
      {
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorTypeMap[keysMap[i]].manufacturer === info.manufacturer && searchSpecs.count){
            arr.push(this.sensorTypeMap[keysMap[i]])
            searchSpecs.count--
          }
          nextIndex++;
        }
      }
    }


    if(arr.length > 0)  //Error if quantity not found
    {
      if(nextIndex > (keysMap.length-1))
      {
        nextIndex = -(nextIndex%(keysMap.length-1))
      }  
      return {"nextIndex": nextIndex,"data": arr}  
    }
    
    return {};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.  
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property, 
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete 
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when 
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO

    let keys = Object.keys(info)
    let nextIndex = searchSpecs.index
    let arr = new Array()
    let keysMap = Object.keys(this.sensorMap)
    
    keysMap.sort()
    if(keys[0] === "index" || keys[0] === undefined)
    {  
      for(let i = searchSpecs.index; i<keysMap.length; i++)
      {
        if(!searchSpecs.count--) break;
        
        arr.push(this.sensorMap[keysMap[i]])
        nextIndex++;
      }
    }
    else if(keys[0] === "id")
    {
      if(this.sensorTypeMap[info.id] === null || this.sensorTypeMap[info.id] === undefined)
      {
        return ["cannot find sensor for id " + info.id ]
      }
      arr.push(this.sensorMap[info.id])
    }
    else if(keys[0] === "model")
    {
      if(keys.length===1)
      {
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorMap[keysMap[i]].model === info.model){
            if(!searchSpecs.count--) break;
            arr.push(this.sensorMap[keysMap[i]])
          }
          nextIndex++
        }
      }
      else
      {
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorMap[keysMap[i]].model === info.model){
            if(!(searchSpecs.count)--) 
            {
              break
            }
            arr.push(this.sensorMap[keysMap[i]])
          }
          nextIndex++
          if(!(searchSpecs.count)) 
          {
              break
          }
          
        }
      }
    }

    else if(keys[0] === "period")
    {
      if(keys.length===1)
      {
        
        for(let i = 0; i<keysMap.length; i++)
        {
          if(this.sensorMap[keysMap[i]].period === info.period){
            if(!searchSpecs.count--) break;
            arr.push(this.sensorMap[keysMap[i]])
          }
          nextIndex++
        }
      }
      else
      {
        
        for(let i = searchSpecs.index; i<keysMap.length; i++)
        {
          if(this.sensorMap[keysMap[i]].period === info.period){
            if(!searchSpecs.count--) break;
            arr.push(this.sensorMap[keysMap[i]])
          }
          nextIndex++
        }
      }
    }


    if(arr.length > 0)  //Error if quantity not found
    {
      if(nextIndex > keysMap.length-1)
      {
        nextIndex = -(nextIndex%keysMap.length)
      }  
      return {"nextIndex": nextIndex,"data": arr}  
    }
    return {Error :["cannot find sensor for  "+ keys[0] +" "+info.keys[0]]};
  }
  
  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
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
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */

  

  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    //@TODO
    let keys = Object.keys(info)
    let arr = new Array()
    let getStatus
    this.sensorDataMap.sort()
    let r = []
    
    if(keys[0] === "index" || keys[0] === undefined) { return ["missing value for sensorId"] }  
    if(searchSpecs.timestamp < 0) {return {"data": []}} 

    else if(keys[0] === "sensorId")
    {
      let itr = searchSpecs.statuses;
          let a = itr.values();
          let b = a.next().value;
          let c = a.next().value;
          let d = a.next().value;
      
      for(let i = 0; i<this.sensorDataMap.length; i++)
      {
        if(this.sensorDataMap[i].sensorId === info.sensorId){
          
          if(this.sensorTypeMap[this.sensorMap[info.sensorId].model].limits.min > this.sensorDataMap[i].value ||
            this.sensorTypeMap[this.sensorMap[info.sensorId].model].limits.max < this.sensorDataMap[i].value )
          {
            getStatus = "error"
          }

          else if(this.sensorDataMap[i].value < this.sensorMap[info.sensorId].expected.min)
          {
            getStatus = "outOfRange"
          }
          else if(this.sensorDataMap[i].value > this.sensorMap[info.sensorId].expected.max)
          {
            getStatus = "outOfRange"
          }
          else
          {
            getStatus = "ok"
          }

          var tempObject = {
            "timestamp" : this.sensorDataMap[i].timestamp,
            "value" : this.sensorDataMap[i].value,
            "status" : getStatus  
          }
          
          if( (b === getStatus) || (c === getStatus) || (d === getStatus) )
          {
            if(this.sensorDataMap[i].timestamp <= searchSpecs.timestamp)
            {
              if(!searchSpecs.count--) break;
              arr.push(tempObject)
            }
          } 
        }
      }
    }

    if(arr.length > 0)  //Error if quantity not found
    { 
      
      if(searchSpecs.doDetail) 
      {
        return {"data": arr, "sensorType": this.sensorTypeMap[this.sensorMap[info.sensorId].model] , "sensor": this.sensorMap[info.sensorId] }
      }
      return {"data": arr}  
    }

    return {};
  }
  
  
}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary

const DEFAULT_COUNT = 5;    

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors; 
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { }, 
    manufacturer: { }, 
    modelNumber: { }, 
    quantity: { }, 
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null, 
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};  
