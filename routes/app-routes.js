const express = require('express');
const moment = require('moment');
const _ = require('underscore');
const uuidv4 = require('uuid/v4');

const router = express.Router();

const AWS = require('aws-sdk');
AWS.config.update({
    region: 'us-east-2'
});

docClient = new AWS.DynamoDB.DocumentClient();

const tableName = 'td_notes';
var user_id = 'test_user';
var user_name = 'Test User';

router.post('/api/note', (req, res, next) => {
    let item = req.body.Item;
    console.log('req.body.Item==>', req.body.Item);
    item.user_id = user_id;
    item.user_name = user_name;
    item.note_id = user_id + ':' + uuidv4(); //generates random string ('universally unique id')
    item.timestamp = moment().unix();
    item.expires = moment().add(90, 'days').unix();

    docClient.put({
        TableName: tableName,
        Item: item
    }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            })
        } else {
            return res.status(200).send(item);
        }

    });
});

router.patch('/api/note', (req, res, next) => {
    let item = req.body.Item;
    console.log('req.body.Item==>', req.body.Item);
    item.user_id = user_id;
    item.user_name = user_name;
    item.expires = moment().add(90, 'days').unix();

    docClient.put({
        TableName: tableName,
        Item: item,
        ConditionExpression: '#t = :t',
        ExpressionAttributeNames: {
            '#t': 'timestamp'
        },
        ExpressionAttributeValues: {
            ':t': item.timestamp
        }
    }, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            })
        } else {
            return res.status(200).send(item);
        }

    });
});

router.get('/api/notes', (req, res, next) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 5;
    let params = {
        TableName: tableName,
        KeyConditionExpression: "user_id = :uid",
        ExpressionAttributeValues: {
            ":uid": user_id
        },
        Limit: limit,
        ScanIndexForward: false
    };

    let startTimestamp = req.query.start ? parseInt(req.query.start) : 0;

    if (startTimestamp > 0) {
        params.ExclusiveStartKey = {
            user_id: user_id,
            timestamp: startTimestamp
        }
    }

    docClient.query(params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            })
        } else {
            return res.status(200).send(data);
        }
    })
});

router.get('/api/note/:note_id', (req, res, next) => {
    let note_id = req.params.note_id;
    let params = {
        TableName: tableName,
        IndexName: "note_id-index",
        KeyConditionExpression: "note_id = :note_id",
        ExpressionAttributeValues: {
            ":note_id": note_id
        },
        Limit: 1
    };

    docClient.query(params, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            })
        } else {
            if (!_.isEmpty(data.Items)) //underscore "object function" (isEmpty())
            //checks if data.Items is empty or not
            {
                return res.status(200).send(data.Items[0]); //return 1st item of array
            } else {
                return res.status(404).send();
            }
        }
    });
});

router.delete('/api/note/:timestamp', (req, res, next)=>{
    let timestamp = parseInt(req.params.timestamp);
    let params = {
        TableName: tableName,
        Key: {
            user_id: user_id,
            timestamp: timestamp
        }
    };

    docClient.delete(params, (err, data)=>{
        if(err) {
            console.log(err);
            return res.status(err.statusCode).send({
                message: err.message,
                status: err.statusCode
            });
        } else {
            return res.status(200).send();
        }
    })
})

module.exports = router;