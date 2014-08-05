'use strict';
var Mongo = require('mongodb');
var _ = require('lodash');

function Student(o){
  this.name           = o.name;
  this.color          = o.color;
  this.tests          = [];
  this._isSusupended  = false;
  this._honorRoll     = false;
  this._avg           = 0;
}

Object.defineProperty(Student, 'collection', {
  get: function(){
    return global.mongodb.collection('students');
  }
});

Student.prototype.save = function(cb){
  Student.collection.save(this, cb);
};

Student.prototype.addTest = function(score, cb){
  score = score * 1;
  this.tests.push(score);

  this.calcAvg();

  this._honorRoll = this._avg >= 95 ? true : false;
  this.save(function(){
    cb();
  });
};

Student.prototype.calcAvg = function(){
  var sum = 0;
  for(var i = 0; i < this.tests.length; i++){
    sum += this.tests[i];
  }
console.log(sum);
  this._avg = sum/this.tests.length;
  console.log(this.tests.length);
};

Student.all = function(cb){
  Student.collection.find().toArray(function(err, objects){
    var items = objects.map(function(o){
      return changePrototype(o);
    });

    cb(items);
  });
};

Student.findById = function(id, cb){
console.log(id);
  id = (typeof id === 'string') ? Mongo.ObjectID(id) : id;
console.log(id);
  Student.collection.findOne({_id:id}, function(err, student){
    cb(err, changePrototype(student));
  });
};

Student.deleteById = function(id, cb){
  var _id = Mongo.ObjectID(id);

  Student.collection.findAndRemove({_id:_id}, cb);
};

module.exports = Student;


// PRIVATE FUNCTIONS //

function changePrototype(obj){
  var object = _.create(Student.prototype, obj);

  return object;
}
