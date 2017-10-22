const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { dbConstants } = require('./src/config/config');
const cassandra = require('cassandra-driver');

const client = new cassandra.Client({ 
    contactPoints: dbConstants.endpoint, 
    keyspace: dbConstants.keyspace
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/get-weight-class/:weight_class', (req, res) => {
    client.execute(`SELECT * FROM ${req.params.weight_class}`, (err, response) => {
        if (err) {
            console.log(`Failed to execute query: ${err}`);
            res.send(`There was an error trying to execute the query..`)
        } else {
            const weight_class = response.rows;
            res.send(weight_class);
        }
    });
});

app.get('/health', (req, res) => {
    res.send({
        data: 'OK.'
    })
})

app.listen(4000, function () {
    console.log('Example app listening on port 4000!')
  });