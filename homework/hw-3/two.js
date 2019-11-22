const mustache = require('mustache')
const flatten = require('flat')

var o = {
    bob : 'For sure',
    roger: 'Unknown',
    donkey: 'What an ass'
  },
  mustacheFormattedData = { 'people' : [] };
  
  function temp(o){
    for (var prop in o){
        if (o.hasOwnProperty(prop)){
          mustacheFormattedData['people'].push({
            'key' : prop,
            'value' : o[prop]
           });
        }
      }
    
      const view = `{{#people}}
      {{key}} : {{value}}
        {{/people}}
      `;
    return (mustache.render(view, o)) 
  }
  
console.log(temp(o));