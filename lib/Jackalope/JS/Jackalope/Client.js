if (Jackalope == undefined) var Jackalope = function () {}

// ----------------------------------------------------------------------------
// Jackalope Client
// ----------------------------------------------------------------------------

Jackalope.Client = function () {};

Jackalope.Client.Eventful = function () {
    this._callbacks = {};
}
Jackalope.Client.Eventful.prototype = {
    // event binding ...
    "bind" : function( event_name, callback ) {
        if ( this._callbacks[ event_name ] == undefined ) {
            this._callbacks[ event_name ] = [];
        }
        this._callbacks[ event_name ].push( callback );
        return this;
    },
    // event triggering
    "trigger" : function( event_name, args ) {
        if ( this._callbacks[ event_name ] != undefined ) {
            var callbacks = this._callbacks[ event_name ];
            for ( var i = 0; i < callbacks.length; i++ ) {
                callbacks[i].apply( this, Array.prototype.slice.call( arguments, 1 ) );
            }
        }
        return this;
    }
};

Jackalope.Client.Resource = function (opts) {
    if (opts["id"]      == undefined) throw new Jackalope.Error ("'id' is required");
    if (opts["body"]    == undefined) throw new Jackalope.Error ("'body' is required");
    if (opts["version"] == undefined) throw new Jackalope.Error ("'version' is required");
    if (opts["links"]   == undefined) throw new Jackalope.Error ("'links' are required");

    // public properties ...
    this.id      = opts["id"];
    this.version = opts["version"];
    this.links   = opts["links"];

    // internal properties ...
    this._body   = opts["body"];
};

Jackalope.Client.Resource.prototype = new Jackalope.Client.Eventful ();

Jackalope.Client.Resource.prototype.get = function (name) {
    return this._body[name];
};

Jackalope.Client.Resource.prototype.set = function (attrs) {
    if (Jackalope.Util.Object.key_count(attrs) == 0) return this;
    for (var k in attrs) {
        this._body[ k ] = attrs[ k ];
        this.trigger( 'update:' + k, this, attrs[ k ] );
    }
    this.trigger('update', this, attrs);
    return this;
};








