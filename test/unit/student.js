/* jshint expr:true */
/* global describe, it, before, beforeEach */ 

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var s1, s2, s3;

describe('Student', function(){
  before(function(done){
    dbConnect('student-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      var o1 = {name:'Sara Jones', color:'pink'};
      var o2 = {name:'Mac Brown', color: 'brown'}; 
      var o3 = {name:'Olive Oil', color: 'green'};

      s1 = new Student(o1);
      s2 = new Student(o2);
      s3 = new Student(o3);

      s1.save(function(){
        s2.save(function(){
          s3.save(function(){
            done();
          });
        });
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Student object', function(){
      expect(s1).to.be.instanceof(Student);
      expect(s1.color).to.equal('pink');
      expect(s1.name).to.equal('Sara Jones');
      expect(s1.tests.length).to.equal(0);
      expect(s1._isSuspended).to.be.False;
      expect(s1._honorRoll).to.be.False;
      expect(s1._avg).to.equal(0);
    });
  });

  describe('#calcAvg', function(){
    it('should find average of students test scores ', function(){
      s2.addTest(100);
      s2.addTest(99);
      s2.addTest(96);
      s2.calcAvg();
      expect(s2._avg).to.be.closeTo(98, 1);
    });
  });

  describe('#addTest', function(){
    it('should save a new test score to students tests array', function(done){
      s1.addTest(77);
      expect(s1.tests.length).to.equal(1);
      done();
    });

    it('should change honorRoll to true if average >= 95', function(done){
      s2.addTest(100);
      expect(s2._honorRoll).to.be.true;
      done();
    });

    it('should change honorRoll to false if average < 95', function(done){
      expect(s1._honorRoll).to.be.false;
      done();
    });

    it('should save updated student record to database', function(done){
      s1.addTest(33);
      s1.addTest(44);
console.log(s1.tests);
console.log(s1._id);
      Student.findById(s1._id.toString(), function(ss) {
        expect(ss.tests.length).to.equal(2);
        done();
      });
    });

  });

  describe('.findById', function(){
    it('should find a student by their ._id ', function(done){
      Student.findById(s1._id.toString(), function(ss){
        expect(ss.name).to.equal('Sara Jones');
        done();
      });
    });
  });

  describe('#save', function(){
    it('should insert a student into the database', function(){
      expect(s1._id).to.be.instanceof(Mongo.ObjectID);
    });

    it('should update an existing student record from the database', function(done){
      s1.honorRoll === true;
      s1.save(function(){
        Student.findById(s1._id, function(err, ss){
          expect(ss.honorRoll).to.equal.TRUE;
          done();
        });
      });
    });
  });
});
