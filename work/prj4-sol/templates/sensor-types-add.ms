<!DOCTYPE html>
<html>
  <head>
    <title>Create/ Update Sensor Types</title>
    <h1 class="tst-sensor-types-add-page"> Create/ Update Sensor Types </h1>
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
  <form method ="POST">
  {{{form_1}}}
  {{{form_2}}}
  {{{form_3}}}
  {{{form_4}}}
  {{{form_5}}}
  <input name="submit" type="submit" value="add" >
  </form>
</div>
{{>footer}}
  </body>
</html>
