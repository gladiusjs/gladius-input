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
        ok( mockScheduler.verify(), "service tasks are scheduled" );
      });

      test( "construct a dispatcher without a DOM element", function() {
        expect( 2 );

        var dispatcher;

        dispatcher = new Dispatcher( null, null );
        equal( dispatcher.element, document, 
          "default element is document when options are missing" );

        dispatcher = new Dispatcher( null, {} );
        equal( dispatcher.element, document, 
          "defualt element is document when element option is missing" );
      });

      test( "keyboard events are buffered by dipatcher", function() {
        expect( 0 );
      });
      
    // events dispatched directly to DOM element associated with service
    // received by dispatcher 
    
    // test the events are buffered by Dispatcher (test ALL key events)
    
    // test that buffered events are re-dispatched during run cycle
    };
  }
);