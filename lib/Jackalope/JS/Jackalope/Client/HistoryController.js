if (Jackalope        == undefined) var Jackalope        = function () {}
if (Jackalope.Client == undefined)     Jackalope.Client = function () {}

// ----------------------------------------------------------------------------
// Jackalope Client History Controller
// ----------------------------------------------------------------------------
// This controller can be used to manage browser history and to dispatch on
// any location hash it finds.
//
// The constructor will take uri_templates which should be in the form of
// key(name) and value(function to generate path uri).
//
// The main method will register with the window.hashchange event (I
// recommend that you use the jquery hashchange plugin found here:
// http://benalman.com/projects/jquery-hashchange-plugin/). When it finds
// a location hash that is not the current one, it will dispatch using the
// following logic:
// - split the location.hash on the / character
// - grab the first element
// - trigger the 'route:<first-element>' event
//   - passing the remaining path elements as the trigger arguments
//
// This basically means that if you want to have things dispatch based
// on the location.hash, you simply need to register them as events.
// So, for example, you would register the following event:
//
//     history_controller.bind('route:foo', function (x) { aler( x ) });
//
// and given the following URL
//
//     /#/foo/bar
//
// this would show an alert with the word "bar" in it.
//
// EVENTS:
// route:<route>  => fired when the dispatch_on_hash is called (which is the
//                   handler for window.hashchange) it is passed the first
//                   element in the path in the location.hash
// ----------------------------------------------------------------------------

Jackalope.Client.HistoryController = function ( opts ) { this.init( opts ) }

Jackalope.Client.HistoryController.prototype = new Jackalope.Client.Observable ();

Jackalope.Client.HistoryController.prototype.init = function ( opts ) {
    if ( opts == undefined ) return;
    this.current_hash  = '';
    this.uri_templates = opts['uri_templates'];
}

Jackalope.Client.HistoryController.prototype.main = function () {
    var self = this;
    $(window).hashchange(function () { self.dispatch_on_hash() });
    $(window).hashchange();
}

Jackalope.Client.HistoryController.prototype.get_hash = function () {
    return decodeURIComponent( window.location.hash.replace( /^#*/, '' ) );
}

Jackalope.Client.HistoryController.prototype.set_hash = function ( hash ) {
    this.current_hash    = hash;
    window.location.hash = hash;
}

Jackalope.Client.HistoryController.prototype.dispatch_on_hash = function () {
    var hash = this.get_hash();
    if ( this.current_hash == hash ) return false;
    this.current_hash = hash;
    var parts = hash.split('/');
    parts.shift();
    this.trigger.apply( this, [ 'route:' + parts.shift() ].concat( parts ) );
}

Jackalope.Client.HistoryController.prototype.set_hash_via_template = function ( template, args ) {
    this.set_hash( this.uri_templates[ template ].apply( this, args ) );
}
