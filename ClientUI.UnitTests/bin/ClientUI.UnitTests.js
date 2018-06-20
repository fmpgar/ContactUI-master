// ClientUI.UnitTests.js
(function(){
Type.registerNamespace('ClientUI.UnitTests');ClientUI.UnitTests.Bootstrap=function(){}
ClientUI.UnitTests.Bootstrap.RunTests=function(){ClientUI.UnitTests.UnitTest1.run();}
ClientUI.UnitTests.UnitTest1=function(){}
ClientUI.UnitTests.UnitTest1.run=function(){var $0={};$0.beforeEach=ClientUI.UnitTests.UnitTest1.setUp;$0.afterEach=ClientUI.UnitTests.UnitTest1.teardown;QUnit.module('Unit Tests',$0);QUnit.test('Test1',ClientUI.UnitTests.UnitTest1.test1);}
ClientUI.UnitTests.UnitTest1.setUp=function(){}
ClientUI.UnitTests.UnitTest1.teardown=function(){}
ClientUI.UnitTests.UnitTest1.test1=function(assert){assert.expect(1);assert.equal(false,false,'Message');}
ClientUI.UnitTests.Bootstrap.registerClass('ClientUI.UnitTests.Bootstrap');ClientUI.UnitTests.UnitTest1.registerClass('ClientUI.UnitTests.UnitTest1');})();// This script was generated using Script# v0.7.4.0
