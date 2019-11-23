<!DOCTYPE html>
<html>
  <head>
    <title>Create/ Update Sensors</title>
    <h1 class="tst-sensors-add-page"> Create/ Update Sensors </h1>
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
  <input name="submit" type="submit" value="add" >
  </form>
</div>
{{>footer}}
  </body>
</html>
