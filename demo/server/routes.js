import {app} from './consts';
import * as path from 'path';


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/html/index.html'));
});

app.get('/js/main.js', (req, res) => {
  res.sendFile(path.join(__dirname + '/js/main.js'));
});

app.get('/js/main.js.map', (req, res) => {
  res.sendFile(path.join(__dirname + '/js/main.js.map'));
});

app.get('/assets/cengen_mean_celltype_expression.csv', (req, res) => {
  res.sendFile(path.join(__dirname + '/assets/cengen_mean_celltype_expression.csv'));
});
