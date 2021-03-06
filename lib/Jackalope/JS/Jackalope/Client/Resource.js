if (Jackalope        == undefined) var Jackalope        = function () {}
if (Jackalope.Client == undefined)     Jackalope.Client = function () {}

// ----------------------------------------------------------------------------
// Jackalope Client Resource
// ----------------------------------------------------------------------------
// This object serves as a wrapper around an body and obsorbs all the other
// properties as well. It matches the resources we use on the server side.
// The only property that is treated special is the 'body', which has the
// get and set accessors.
//
// We also support deep get/set accessor behavior as well using dot separated
// paths to access them. This not only works for embedded objects, but also
// for embedded arrays as well.
//
// EVENTS:
// update:{prop} => fired when a property is updated       => (self, attr)
// update        => fired after all properties are updated => (self, attrs)
// ----------------------------------------------------------------------------

Jackalope.Client.Resource = function (opts) { this.init( opts ) };

Jackalope.Client.Resource.prototype = Jackalope.Util.Object.merge(
    Jackalope.Client.Observable.prototype,
    Jackalope.Client.Traversable.prototype
);

Jackalope.Client.Resource.prototype.init = function ( opts ) {
    if (opts == undefined) return; // we are being subclassed
    this.id      = opts["id"];
    this.version = opts["version"];
    this.links   = opts["links"] || [];
    this.body    = opts['body']  || {};
};

Jackalope.Client.Resource.prototype.pack = function () {
    return {
        id      : this.id,
        version : this.version,
        body    : this.body
    };
};

Jackalope.Client.Resource.prototype.serialize = function ( serializer ) {
    return serializer.serialize( this.pack() );
};

Jackalope.Client.Resource.prototype.get = function ( name ) {
    return this.traverse_path_and_get( name, this.body );
};

Jackalope.Client.Resource.prototype.set = function ( attrs, options ) {
    // allow both the { k : v } form
    // and the (k, v) form of arguments
    if ( typeof attrs == 'string' ) {
        var tmp = {};
        tmp[ attrs ] = options;
        attrs   = tmp;
        if (arguments.length == 2) {
            options = arguments[2];
        }
        else {
            options = {}
        }
    }

    if (Jackalope.Util.Object.key_count(attrs) == 0) return this;
    if (options == undefined) options = {};

    for (var k in attrs) {
        this.traverse_path_and_set( k, this.body, attrs[ k ], k );
        if (!options.silent) {
            this.trigger( 'update:' + k, this, attrs[ k ] );
        }
    }
    if (!options.silent) {
        this.trigger('update', this, attrs);
    }
    return this;
};

// ----------------------------------------------------------------------------
// Jackalope Client Resource Collection
// ----------------------------------------------------------------------------
// EVENTS:
// add          => fired when a resource is added   => ( self, idx, resource )
// update:{idx} => fired when a resource is updated => ( self, idx, resource )
// ----------------------------------------------------------------------------

Jackalope.Client.Resource.Collection = function ( opts ) { this.init( opts ) }

Jackalope.Client.Resource.Collection.prototype = new Jackalope.Client.Observable ();
Jackalope.Client.Resource.Collection.prototype.init = function ( opts ) {
    if (opts              == undefined) return; // we are likely being subclassed
    if (opts["resources"] == undefined) throw new Jackalope.Error ("You must supply a set of resources");
    this.resources = opts["resources"];
}

Jackalope.Client.Resource.Collection.prototype.length = function () {
    return this.resources.length;
}

Jackalope.Client.Resource.Collection.prototype.add = function ( resource ) {
    this.resources.push( resource );
    this.trigger("add", this, (this.resources.length - 1), resource );
};

Jackalope.Client.Resource.Collection.prototype.get = function ( index ) {
    return this.resources[ index ];
};

Jackalope.Client.Resource.Collection.prototype.set = function ( index, resource ) {
    this.resources[ index ] = resource;
    this.trigger("update:" + index, this, index, resource );
};

Jackalope.Client.Resource.Collection.prototype.add_or_update = function ( new_resource ) {
    for (var i = 0; i < this.resources.length; i++) {
        if ( this.resources[i].id === new_resource.id ) {
            this.set( i, new_resource );
            return;
        }
    }
    this.add( new_resource );
    return;
};

// ----------------------------------------------------------------------------
// Jackalope Client Resource Repository
// ----------------------------------------------------------------------------
// You must create a repository for each schema you wish to handle.
// ----------------------------------------------------------------------------

Jackalope.Client.Resource.Repository = function ( opts ) { this.init( opts ) }

Jackalope.Client.Resource.Repository.prototype = {
    "init" : function ( opts ) {
        if (opts                      == undefined) return; // we are likely being subclassed
        if (opts["base_url"]          == undefined) throw new Jackalope.Error ("You must supply a url for the resource repository");
        if (opts["schema"]            == undefined) throw new Jackalope.Error ("You must supply a schema for the resource repository");
        if (opts["schema_repository"] == undefined) throw new Jackalope.Error ("You must supply a schema repository for the resource repository");

        this.base_url          = opts["base_url"];
        this.schema            = opts["schema"];
        this.schema_repository = opts["schema_repository"];
        this.serializer        = new Jackalope.Serializer.JSON ();
    },
    "list" : function ( options, success, error ) {
        var self      = this;
        var hyperlink = this.schema.links.list;
        this._call_ajax({
            "url"     : this._build_url( hyperlink, {} ),
            "type"    : hyperlink.method,
            "data"    : options,
            "success" : function (data) {
                var resources = new Jackalope.Client.Resource.Collection ({
                    resources : Jackalope.Util.Array.map(
                        function ( d ) { return self._inflate_resource( d ) },
                        self._inflate_data( data )
                    )
                });
                success( resources )
            },
            "error"   : error,
        });
    },
    "create" : function ( data, success, error ) {
        var hyperlink = this.schema.links.create;
        this._call_ajax({
            "url"     : this._build_url( hyperlink, {} ),
            "type"    : hyperlink.method,
            "data"    : this.serializer.serialize( data ),
            "success" : this._wrap_callback( success ),
            "error"   : error,
        });
    },
    "read" : function ( id, success, error ) {
        var hyperlink = this.schema.links.read;
        this._call_ajax({
            "url"     : this._build_url( hyperlink, { 'id' : id } ),
            "type"    : hyperlink.method,
            "success" : this._wrap_callback( success ),
            "error"   : error,
        })
    },
    "edit" : function ( resource, success, error ) {
        var hyperlink = this.schema.links.edit;
        this._call_ajax({
            "url"     : this._build_url( hyperlink, { 'id' : resource.id } ),
            "type"    : hyperlink.method,
            "data"    : resource.serialize( this.serializer ),
            "success" : this._wrap_callback( success ),
            "error"   : error,
        })
    },
    "destroy" : function ( resource, success, error ) {
        var hyperlink = this.schema.links['delete'];
        this._call_ajax({
            "url"     : this._build_url( hyperlink, { 'id' : resource.id } ),
            "type"    : hyperlink.method,
            "headers" : { 'If-Matches' : resource.version },
            "success" : success,
            "error"   : error,
        })
    },
    "create_or_edit" : function ( resource, success, error ) {
        if (resource.id == undefined) {
            this.create( resource.body, success, error );
        }
        else {
            this.edit( resource, success, error );
        }
    },
    // private methods ...
    "_wrap_callback" : function ( callback ) {
        var self = this;
        return function ( data ) { callback( self._inflate_resource( data ) ) }
    },
    "_inflate_data" : function ( data ) {
        if (typeof data == 'string') {
            try {
                data = this.serializer.deserialize(data);
            } catch (e) {
                throw new Jackalope.Error ("Could not parse spec JSON");
            }
        }
        return data;
    },
    "_inflate_resource" : function ( data ) {
        return new Jackalope.Client.Resource( this._inflate_data( data ) );
    },
    "_call_ajax" : function ( opts ) {
        Jackalope.Util.Web.ajax( opts );
    },
    "_build_url" : function ( hyperlink, params ) {
        var url  = this.base_url;
        var href = hyperlink.href;
        for ( var param in params ) {
            href = href.replace( ':' + param, params[ param ] );
        }
        return url + href;
    }
};
