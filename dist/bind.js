(function() {
    var Context;

    var root = window;

    var Bind = {};

    root.Bind = Bind;

    if (!bonzo) {console.error('Bonzo module/library doesn\'t exists')};


    Bind.render = function(context, models, directives, options) {
        var base;

        if ( !models ) {
            models = [];
        }
        if ( !directives ) {
            directives = {};
        }
        if ( !options ) {
            options = {};
        }

        if (options.debug) {
            console.log( "Transparency.render:", context, models, directives, options );
        }

        if ( !context ) {
            return;
        }

        if ( !Array.isArray( models ) ) {
            models = [models];
        }

        var context = new Context(context, Transparency);

        return context.render ( models, directives, options).el;

    };

    /**
     * @param element
     * @param key
     * @returns {boolean}
     */
    Bind.matcher = function ( element, key ) {
        return element.id === key ||
            [].indexOf.call( element.classList, key ) >= 0 ||
            element.name === key ||
            element.getAttribute( 'data-bind' ) === key;
    };

    Context  = function (el, Transparency) {
        this.el = el;
        this.bind = Transparency;
        this.bEl = bonzo(el);
    };

    Context.prototype.render = function ( models, directives, options ) {
        var self = this;

        models.forEach(function(modelObject) {
            var keys = Object.keys(modelObject);



//            keys.forEach(function(key) {
//                self.el.children.forEach(function(child) {
//                    if ( Bind.matcher(child, key) ) {
//                        child.text()
//                    }
//                });
//            });


        });
    };











})();