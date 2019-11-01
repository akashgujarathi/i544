const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function serve(port, sensors) {
  //@TODO set up express app, routing and listenconst app = express();
  const app = express();
  app.locals.port = port;
  app.locals.sensors = sensors;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

module.exports = { serve: serve };

function setupRoutes(app) {
  const base = app.locals.base;
  app.use(cors());
  app.use(bodyParser.json());
  app.get('/sensors', sensorFind(app));
  app.get('/sensors/:id', sensorFindId(app));
  
  app.get('/sensor-types', sensorType(app));
  app.get('/sensor-types/:id', sensorTypeId(app));

  app.get('/sensor-data/:id/:timestamp', sensorDataIdTimestamp(app));
  app.get('/sensor-data/:id', sensorDataId(app));
  
  app.post('/sensor-types', createSensorType(app))
  app.post('/sensors', createSensor(app))
  app.post('/sensor-data/:id', createSensorData(app))
  
}
//@TODO routing function, handlers, utility functions

function createSensorData(app) {
  return errorWrap(async function(req, res) {
  try {
    const obj = req.body;
    obj.sensorId = req.params.id;
    const result = await app.locals.sensors.addSensorData(obj);
    res.append('Location', requestUrl(req) + '/' + obj.id);
    res.sendStatus(CREATED);
  }
  catch(err) {
    const mapped = mapError(err);
    sendError = {"errors" :[mapped]};
    res.status(NOT_FOUND).json(sendError);
  }
});
}

function createSensor(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const result = await app.locals.sensors.addSensor(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}


function createSensorType(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const result = await app.locals.sensors.addSensorType(obj);
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}


function sensorDataIdTimestamp(app){
  return errorWrap(async function(req, res) {
    try 
    {
      const q = req.params.timestamp
      const status = req.query.statuses
      const id = req.params.id;
      const result = await app.locals.sensors.findSensorData({sensorId: id, timestamp:q, statuses:status});
      
      result.data = result.data.filter(function(val){
        return Number(val.timestamp) === Number(q);
      });

      if (result.data.length === 0) 
      {
        throw {
          isDomain: true,
          errorCode: NOT_FOUND,
          message: `no data for timestamp ${Number(q)}`,
        };
      }
      else 
      {
        result.self = requestUrl(req);
	      res.json(result);
      }
    }
    catch(err) {
      const mapped = mapError(err,"NOT_FOUND");
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}

function sensorDataId(app){
  return errorWrap(async function(req, res) {
    try 
    {
      const q = req.query.timestamp
      const status = req.query.statuses
      const id = req.params.id;
      const result = await app.locals.sensors.findSensorData({sensorId: id, timestamp:q, statuses:status});
      result.self = requestUrl(req);
      if (result.length === 0) 
      {
        throw {
          isDomain: true,
          errorCode: NOT_FOUND,
          message: `user ${id} not found`,
        };
      }
      else 
      {
	      res.json(result);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}

function sensorFind(app){
  return errorWrap(async function(req, res){
    const q = req.query || {};
    try{
      const result = await app.locals.sensors.findSensors(q);
      if(result.nextIndex > 0){
        if(req.query._index){
          result.next = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.nextIndex)  
        }
        else{
          result.next = requestUrl(req)+"?_index="+result.nextIndex
        }
      }
      if(result.previousIndex > 0){
        if(req.query._index){
          result.prev = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.previousIndex)  
        }
        else{
          result.prev = requestUrl(req)+"?_index="+result.previousIndex
        }
      }
      result.self = requestUrl(req);
      res.json(result);
    }
    catch(err){
      const mapped = mapError(err,"NOT_FOUND");
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}

function sensorFindId(app){
  return errorWrap(async function(req, res) {
    try 
    {
      const id = req.params.id;
      const result = await app.locals.sensors.findSensors({ id: id });
      result.self = requestUrl(req);
      if(result.nextIndex > 0){
        if(req.query._index){
          result.next = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.nextIndex)  
        }
        else{
          result.next = requestUrl(req)+"?_index="+result.nextIndex
        }
      }
      if(result.previousIndex > 0){
        if(req.query._index){
          result.prev = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.previousIndex)  
        }
        else{
          result.prev = requestUrl(req)+"?_index="+result.previousIndex
        }
      }
      if (result.length === 0) 
      {
        throw {
          isDomain: true,
          errorCode: NOT_FOUND,
          message: `user ${id} not found`,
        };
      }
      else 
      {
        
	      res.json(result);
      }
    }
    catch(err) {
      const mapped = mapError(err,"NOT_FOUND");
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}

function sensorType(app){
  return errorWrap(async function(req, res){
    const q = req.query || {};
    try{
      const result = await app.locals.sensors.findSensorTypes(q);
      result.self = requestUrl(req);
      if(result.nextIndex > 0){
        if(req.query._index){
          result.next = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.nextIndex)  
        }
        else{
          result.next = requestUrl(req)+"?_index="+result.nextIndex
        }
      }
      if(result.previousIndex > 0){
        if(req.query._index){
          result.prev = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.previousIndex)  
        }
        else{
          result.prev = requestUrl(req)+"?_index="+result.previousIndex
        }
      }
      res.json(result);
    }
    catch(err){
      const mapped = mapError(err,"NOT_FOUND");
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}

function sensorTypeId(app){
  return errorWrap(async function(req, res) {
    try 
    {
      const id = req.params.id;
      const result = await app.locals.sensors.findSensorTypes({ id: id });
      result.self = requestUrl(req);
      if(result.nextIndex > 0){
        if(req.query._index){
          result.next = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.nextIndex)  
        }
        else{
          result.next = requestUrl(req)+"?_index="+result.nextIndex
        }
      }
      if(result.previousIndex > 0){
        if(req.query._index){
          result.prev = requestUrl(req).replace(/[_index=]+[0-9]+/,"_index="+result.previousIndex)  
        }
        else{
          result.prev = requestUrl(req)+"?_index="+result.previousIndex
        }
      }
      if (result.length === 0) 
      {
        throw {
          isDomain: true,
          errorCode: NOT_FOUND,
          message: `user ${id} not found`,
        };
      }
      else 
      {
        
	      res.json(result);
      }
    }
    catch(err) {
      const mapped = mapError(err,"NOT_FOUND");
      sendError = {"errors" :[mapped]};
      res.status(NOT_FOUND).json(sendError);
    }
  });
}




/** Set up error handling for handler by wrapping it in a 
 *  try-catch with chaining to error handler on error.
 */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}

/*************************** Mapping Errors ****************************/

const ERROR_MAP = {
  EXISTS: CONFLICT,
  NOT_FOUND: NOT_FOUND
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err,codeError) {
  return err.isDomain
    ? { 
	code: codeError,
	message: err.message
      }
    : { 
	code: codeError,
	message: err.toString().replace("NOT_FOUND:","")
      };
} 

/****************************** Utilities ******************************/

/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
  