const { Console, table } = require('console');
const cons = require('consolidate');
const { resolveSoa } = require('dns');
var express = require('express');
const path=require('path');
const { response } = require('../app');
var router = express.Router();
var db=require('../dbconnector/connection')
const bcrypt=require('bcrypt');
const { create } = require('domain');
const { createDecipher } = require('crypto');
const fs=require('fs')





module.exports=router