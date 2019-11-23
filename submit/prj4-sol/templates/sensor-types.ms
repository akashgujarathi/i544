<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensor Types</title>
    <h1> Search Sensor Types </h1>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
  {{#fields}}
    <span class="error">{{errorMessage}}</span>
  {{/fields}}  
  {{#errors}}
    <span class="error">{{_}}</span>
  {{/errors}}
  <div>
    <form method ="GET">
    {{{form_1}}}
    {{{form_2}}}
    {{{form_3}}}
    {{{form_4}}}
    <input name="submit" type="submit" value="search" class="control">
    </form>
  </div>
    <h2>Results Summary</h2>
    <table class="summary">
    <thead>
    <tr>
             <th>Manufacturer</th>
             <th>Sensor Type ID</th>
             <th>Model Number</th>
             <th>Measure</th>
             <th colspan="2">Limits</th>
    </tr>
    <tr>
             <th></th>
             <th></th>
             <th></th>
             <th></th>
             <th>Min</th>
             <th>Max</th>
    </tr>
    </thead>
    <tbody>
    {{#result}}
    {{#data}}
    <tr> <td class="tst-manufacturer"> {{{manufacturer}}} </td>
          <td class="tst-sensor-type-id"> {{{id}}} </td>
          <td class="tst-model-number"> {{{modelNumber}}} </td>
          <td class="tst-quantity"> {{{quantity}}} </td>
          <td class="numeric interval tst-limits-min"> {{{limits.min}}}</td>
          <td class="numeric interval tst-limits-max">{{{limits.max}}} </td>
    </tr>
    {{/data}}
    </tbody>
    </table>
    <div class="scroll">
  
    {{#prev}}
      <a class="tst-prev" href={{prev}} rel="prev">&lt;&lt;</a>
    {{/prev}}
    {{#next}}
      <a class="tst-next" href={{next}} rel="next">&gt;&gt;</a>
    {{/next}}
  
    </div>
    {{/result}}
  {{>footer}}
    </body>

</html>