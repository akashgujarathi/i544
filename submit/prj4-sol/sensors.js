'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const Mustache = require('./mustache');
const mustache = new Mustache();
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates'

function serve(port, model, base = '') {
  //@TODO
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
 
  //console.log(Object.keys(app))
  process.chdir(__dirname);
  
  app.use(base, express.static(STATIC_DIR));

  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}

module.exports = serve;

//@TODO
function setupRoutes(app) {
  const base = app.locals.base;
  
  app.get(`/sensor-types.html`, searchAll(app, 'sensor-types'));
  app.get(`/sensor-types/add.html`, addAll(app, 'sensor-types-add'));
  app.post(`/sensor-types/add.html`, bodyParser.urlencoded({extended: true}), updateAll(app, 'sensor-types'));

  app.get(`/sensors.html`, searchAll(app, 'sensors'));
  app.get(`/sensors/add.html`, addAll(app, 'sensors-add'));
  app.post(`/sensors/add.html`, bodyParser.urlencoded({extended: true}), updateAll(app, 'sensors'));

}
/***********************Field Definitions*************************** */
const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type ID',
    isSearch: true,
    isId: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },
  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    regex: /^\w+$/,
    error: "Model Number field can only contain alphanumerics",
  },
  manufacturer: {
    friendlyName: 'Manufacturer',
    isSearch: true,
    regex:  /^[a-zA-Z\-\' ]+$/,
    error: "Manufacturer can only contain alphabet",
  },
  quantity: {
    friendlyName: 'Quantity',
    isSearch: true,
    regex:  /Temperature|Pressure|Flow Rate|Relative Humidity/,
    error: "Measure error",
  },
  model: {
    friendlyName: 'Model',
    isSearch: true,
    regex:  /^[a-zA-Z\-\' ]+$/,
    error: "model error",
  },
  period: {
    friendlyName: 'Period',
    isSearch: true,
    regex:  /^[a-zA-Z\-\' ]+$/,
    error: "period error",
  }
};
const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));


/***********************Routing*************************** */
function addAll(app, type){
  return async function(req, res){

    const WIDGET = [
      {
        name: 'id',
        label: 'Sensor Type ID',
        isRequired: true,
        classes: ['tst-sensor-type-id'],
        errors: {input1: 'error'},   
      },
      {
        name: 'modelNumber',
        label: 'Model Number',
        isRequired: true,
        classes: ['tst-model-number'],
        errors: {input1: 'error'}, 
      },
      {
        name: 'manufacturer',
        label: 'Manufacturer',
        isRequired: true,
        classes: ['tst-maufacturer'],
        errors: {input1: 'error'}, 
      },
      {
        name: 'quantity',
        label: 'Quantity',
        isRequired: true,
        classes: ['tst-quantity'],
        type: 'select',
        choices:{
          '': 'Select',
          temperature: 'Temperature',
          pressure: 'Pressure',
          flow: 'Flow Rate',
          humidity: 'Relative Humidity',
        },
        errors: {input1: 'error'},
      },
      {
        name: 'limits',
        label: 'Limits',
        type: 'interval',
        isRequired: true,
        attr: [ { name: 'id', value: 'interval1-id', }, ],
        val: { min: 100.2, max: 127, },
        classes: ['numeric interval'],
        errors: {input1: 'error'},    
      },
      {
        name: 'unit',
        label: 'Sensor Type Unit',
        classes: ['tst-sensor-type-unit'],
        errors: {input1: 'error'},
      },
      {
        name: 'id',
        label: 'Sensor ID',
        classes: ['tst-sensor-id'],
        errors: {input1: 'error'},    
      },
      {
        name: 'model',
        label: 'Model',
        classes: ['tst-model'],
        errors: {input1: 'error'},    
      },
      {
        name: 'period',
        label: 'Period',
        classes: ['tst-period'],
        errors: {input1: 'error'},    
      },
      {
        name: 'expected',
        label: 'Expected Range',
        type: 'interval',
        isRequired: true,
        attr: [ { name: 'id', value: 'interval1-id', }, ],
        val: { min: 100.2, max: 127, },
        classes: ['numeric interval'],
        errors: {input1: 'error'},    
      },

    ];
    let model, model_2;
      let list = [];
      let listCount = 0;

      for(const widget of WIDGET){
        const view = widgetView(widget, widget.val, widget.errors);
        list[listCount++] = mustache.render('widget', view);
      }
      model = {
        form_1:list[0], 
        form_2:list[1], 
        form_3:list[2],
        form_4:list[3],
        form_5:list[4], 
        form_6:list[5],
      };
      model_2 = {
        form_1:list[6], 
        form_2:list[7], 
        form_3:list[8],
        form_4:list[9],
      };

    if(type === 'sensors-add') model = model_2;
    const html = mustache.render(type, model);
    res.send(html);
  };
};

function searchAll(app, type) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let result = [];
    let errors = undefined;
    const search = getNonEmptyValues(req.query);
    if (isSubmit) 
    {
      errors = validate(search);
      if (Object.keys(search).length === 0) 
      {
	      const msg = 'at least one search parameter must be specified';
	      errors = Object.assign(errors || {}, { _: msg });
      }
      if (!errors) 
      {
        const q = search;
        try 
        {
          result = await app.locals.model.list(type,q);
        }
        catch (err) 
        {
          console.error(err);
          errors = wsErrors(err);
        } 
        if(result.next){
          if(type === 'sensors'){
              result.next = type+".html?_index="+result.nextIndex+'&id='+req.query.id+'&model='+req.query.model+'&period='+req.query.period;
          }
          else{
              result.next = type+".html?_index="+result.nextIndex+'&id='+req.query.id+'&modelNumber='+req.query.modelNumber+'&manufacturer='+req.query.manufacturer+'&quantity='+req.query.quantity;  
          }
            
        }
        if(result.prev){
          if(type === 'sensors'){
            result.prev = type+".html?_index="+'&id='+req.query.id+'&model='+req.query.model+'&period='+req.query.period;
          }
          else{
            result.prev = type+".html?_index="+result.previousIndex+'&id='+req.query.id+'&modelNumber='+req.query.modelNumber+'&manufacturer='+req.query.manufacturer+'&quantity='+req.query.quantity;
          }    
        }
        if (result.length === 0) {
          errors = {_: 'no users found for specified criteria; please retry'};
        } 
      }
    }
    else
    {
      const q = req.query;
      try{
        result = await app.locals.model.list(type,q);
        console.log(result);
        if(result.next){
          result.next = type+".html?_index="+result.nextIndex;
        }
        if(result.prev){
          result.prev = type+".html?_index="+result.previousIndex;
        }
        if (result.length === 0) {
          errors = {_: 'no users found for specified criteria; please retry'};
        } 
      }
      catch(err){
        console.error(err);
        errors = wsErrors(err);
      }
    }
      const WIDGET = [
        {
          name: 'id',
          label: 'Sensor Type ID',
          classes: ['tst-sensor-type-id'],
          errors: {input1: 'error'},    
        },
        {
          name: 'modelNumber',
          label: 'Model Number',
          classes: ['tst-model-number'],
          errors: {input1: 'error'}, 
        },
        {
          name: 'maufacturer',
          label: 'Manufacturer',
          classes: ['tst-maufacturer'],
          errors: {input1: 'error'}, 
        },
        {
          name: 'quantity',
          label: 'Quantity',
          classes: ['tst-quantity'],
          type: 'select',
          choices:{
            '': 'Select',
            temperature: 'Temperature',
            pressure: 'Pressure',
            flow: 'Flow Rate',
            humidity: 'Relative Humidity',
          },
          errors: {input1: 'error'},
        },
        
        {
          name: 'id',
          label: 'Sensor ID',
          classes: ['tst-sensor-id'],
          errors: {input1: 'error'},    
        },
        {
          name: 'model',
          label: 'Model',
          classes: ['tst-model'],
          errors: {input1: 'error'},    
        },
        {
          name: 'period',
          label: 'Period',
          classes: ['tst-period'],
          errors: {input1: 'error'},    
        },
      ];

      let model, model_2;
      if(!errors){

        let list = [];
        let listCount = 0;
        
        for(const widget of WIDGET){
          const view = widgetView(widget, widget.val, widget.errors);
          list[listCount++] = mustache.render('widget', view);
        }

        model = {
          form_1:list[0], 
          form_2:list[1], 
          form_3:list[2], 
          form_4:list[3],
          result: result,
        };
        model_2 = {
          form_1:list[4], 
          form_2:list[5], 
          form_3:list[6], 
          result: result,
        };
      }

      else model = errorModel(app, result, errors);

      if(type === 'sensors') model = model_2;

      const html = mustache.render(type, model);
      res.send(html);

  };
};

function updateAll(app, type){
  return async function(req, res){
  const result = req.body
    try
    {
      await app.locals.model.update(type,result);
      /*Todo add*/
      if(type=== 'sensors'){
        res.redirect('http://localhost:2346/sensors.html?id='+result.id);
      }
      else{
        res.redirect('http://localhost:2346/sensor-types.html?id='+result.id);
      }
    }
    catch(err){
      console.log(err)
      let errors = wsErrors(err)
    }
  };
};
/***********************Field Utilities*************************** */


function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] = `A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

function errorModel(app, values={}, errors ={}){
  return{
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

/***********************General Utilities*************************** */
function wsErrors(err){
  const msg = (err.message) ? err.message : 'web service error';
  console.log(msg);
  return {_:[msg]};
}


function isNonEmpty(v){
  return (v !== undefined) && v.trim().length > 0;
}

function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

