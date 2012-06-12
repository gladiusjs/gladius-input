define(
  [ "src/services/dispatcher" ],
  function( Dispatcher ) {
    return function() {

      module( "Dispatcher", {
        setup: function() {
          this.testCanvas = document.getElementById("test-canvas");            
        },
        teardown: function() {}
      });

      test("contructing the dispatcher service", function () {
        expect(2);
        var schedulerAPI = { insert: function() {} };
        var mockScheduler = sinon.mock(schedulerAPI);
        mockScheduler.expects( "insert" ).once();
        
        var dispatcher = new Dispatcher(mockScheduler, 
          {element: this.testCanvas});
        ok(dispatcher instanceof Dispatcher, "dispatcher is the right instance");
        mockScheduler.verify();
      });
      
    // constructing dispatcher without DOM element throws
        
    // events dispatched directly to DOM element associated with service
    // received by dispatcher 
    
    // test the events are buffered by Dispatcher (test ALL key events)
    
    // test that buffered events are re-dispatched during run cycle
    
    // test that scheduler passed to the dispatcher is actually used
    };
  }
);