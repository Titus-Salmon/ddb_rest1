const express = require('express');
const moment = require('moment');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');

const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-2'});

docClient = new AWS.DynamoDB.DocumentClient();

var user_id = 'test_user';
var user_name = 'Test User';

router.post('/api/note', (req, res, next)=>{
    let item = req.body.Item;
    item.user_id = user_id;
    item.user_name = user_name;
    item.note_id = user_id + ':' + uuidv4(); //generates random string ('universally unique id')
    item.timestamp = moment().unix();
    item.expires = moment().add(90, 'days').unix();
})

module.exports = router;