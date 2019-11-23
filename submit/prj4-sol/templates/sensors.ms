<!DOCTYPE html>
<html>
  <head>
    <title>Search Sensors</title>
    <h1> Search Sensors </h1>
    <link rel="stylesheet" href="/css/style.css">
  </head>
  <body>
  {{#fields}}
    <span class="error">{{error}}</span>
  {{/fields}}  
  {{#errors}}
    <span class="error">{{_}}</span>
  {{/errors}}
  <div>
    <form method ="GET">
    {{{form_1}}}
    {{{form_2}}}
    {{{form_3}}}
    <input name="submit" type="submit" value="search" class="control">
    </form>
  </div>
    <h2>Results Summary</h2>
    <table class="summary">
    <thead>
    <tr>
             <th>Sensor ID</th>
             <th>Model</th>
             <th>Period</th>
             <th colspan="2">Expected Range</th>
    </tr>
    <tr>
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
    <tr> <td class="tst-sensor-id"> {{{id}}} </td>
          <td class="tst-model"> {{{model}}} </td>
          <td class="tst-period numeric"> {{{period}}} </td>
          <td class="numeric interval tst-expected-min"> {{{expected.min}}}</td>
          <td class="numeric interval tst-expected-max">{{{expected.max}}} </td>
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