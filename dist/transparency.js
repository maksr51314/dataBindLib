'use strict';

//     Transparency.js 1.0.0
//     ( c ) 2014 Romaniv Maksym, DocumentCloud and Investigative Reporters & Editors
//     Transparency may be freely distributed under the MIT license.

( function(  ) {
    /** Definition **/
    var _ = {},
        helpers = {}, expando, html5Clone, _getElements, __extends,
        Transparency = {},
        Context,
        ElementFactory = {}, Checkbox, Element, Input, Radio, Select, TextArea, VoidElement, _ref, _ref1, _ref2, _ref3, _ref4,
        AttributeFactory, Attribute, BooleanAttribute, Class, Html, Text,
        Instance
        ;

    /** ---------------------------------- Underscore ---------------------------------- **/
    _.toString = Object.prototype.toString;

    _.toArray = function ( obj ) {
        var i,
            arr = new Array( obj.length );

        for ( i = 0; i < obj.length; i++ ) {
            arr[i] = obj[i];
        }
        return arr;
    };

    _.isString = function ( obj ) {
        return _.toString.call( obj ) === '[object String]';
    };

    _.isNumber = function ( obj ) {
        return _.toString.call( obj ) === '[object Number]';
    };

    _.isArray = Array.isArray ||
        function ( obj ) {
            return _.toString.call( obj ) === '[object Array]';
        };

    _.isDate = function ( obj ) {
        return _.toString.call( obj ) === '[object Date]';
    };

    _.isElement = function ( obj ) {
        return !!( obj && obj.nodeType === 1 );
    };

    _.isPlainValue = function ( obj ) {
        var type;
        type = typeof obj;
        return ( type !== 'object' && type !== 'function' ) || _.isDate( obj );
    };

    _.isBoolean = function ( obj ) {
        return obj === true || obj === false;
    };
    /** ---------------------------------- Underscore ---------------------------------- **/


    /** ---------------------------------- Helpers ---------------------------------- **/

    helpers.ELEMENT_NODE = 1;
    helpers.TEXT_NODE = 3;

    helpers.before = function ( decorator ) {
        return function ( method ) {
            return function (  ) {
                decorator.apply( this, arguments );
                return method.apply( this, arguments );
            };
        };
    };

    helpers.after = function ( decorator ) {
        return function ( method ) {
            return function (  ) {
                method.apply( this, arguments );
                return decorator.apply( this, arguments );
            };
        };
    };

    helpers.chainable = helpers.after( function (  ) {
        return this;
    } );

    helpers.getElements = function ( el ) {
        var elements = [];

        _getElements( el, elements );
        return elements;
    };

    _getElements = function ( template, elements ) {
        var child, _results;

        child = template.firstChild;
        _results = [];
        while ( child ) {
            if ( child.nodeType === helpers.ELEMENT_NODE ) {
                elements.push( new ElementFactory.createElement( child ) );
                _getElements( child, elements );
            }
            _results.push( child = child.nextSibling );
        }
        return _results;
    };

    html5Clone = function (  ) {
        return document.createElement( 'nav' ).cloneNode( true ).outerHTML !== '<:nav></:nav>';
    };

    helpers.cloneNode = (function() {
        if (( document === undefined || document === null ) || html5Clone() ) {
           return function ( node ) {
               return node.cloneNode( true );
           };
        } else {
           return function ( node ) {
               var cloned, element, _i, _len, _ref;

               cloned = Transparency.clone( node );
               if ( cloned.nodeType === helpers.ELEMENT_NODE ) {
                   cloned.removeAttribute( expando );
                   _ref = cloned.getElementsByTagName( '*' );
                   for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                       element = _ref[_i];
                       element.removeAttribute( expando );
                   }
               }
               return cloned;
           };
        }
    }) ();

    expando = 'transparency';

    helpers.data = function ( element ) {
        return element[expando] || ( element[expando] = {} );
    };

    __extends = function ( child, parent ) {
        var key;
        for ( key in parent ) {
            if ( parent.hasOwnProperty( key ) ) {
                child[key] = parent[key];
            }
        }

        function Ctor(  ) {
            this.constructor = child;
        }

        Ctor.prototype = parent.prototype;


        child.prototype = new Ctor(  );
        child.__super__ = parent.prototype;

        return child;
    };

    /** ---------------------------------- Helpers ---------------------------------- **/


    /** ---------------------------------- Transparency ---------------------------------- **/
    /**
     * @param context
     * @param models
     * @param directives
     * @param options
     * @returns {el}
     */
    Transparency.render = function ( context, models, directives, options ) {
        var _base;

        if ( !models ) {
            models = [];
        }
        if ( !directives ) {
            directives = {};
        }
        if ( !options ) {
            options = {};
        }

        console.log( "Transparency.render:", context, models, directives, options );

        if ( !context ) {
            return;
        }

        if ( !_.isArray( models ) ) {
            models = [models];
        }

        context = ( _base = helpers.data( context ) ).context || ( _base.context = new Context( context, Transparency ) );
        return context.render( models, directives, options ).el;
    };

    /**
     * @param element
     * @param key
     * @returns {boolean}
     */
    Transparency.matcher = function ( element, key ) {
        return element.el.id === key || [].indexOf.call( element.classNames, key ) >= 0 || element.el.name === key || element.el.getAttribute( 'data-bind' ) === key;
    };

    //add method 'render' to jquery
    if ( typeof jQuery !== "undefined" && jQuery !== null ) {
        if ( jQuery ) {
            jQuery.fn.render = helpers.chainable( function ( models, directives, options ) {
                var context, _i, _len, _results;

                _results = [];
                for ( _i = 0, _len = this.length; _i < _len; _i++ ) {
                    context = this[_i];
                    _results.push( Transparency.render( context, models, directives, options ) );
                }
                return _results;
            } );
        }
    }

    //init Transparency in general scope
    if ( typeof window !== "undefined" && window !== null ) {
        window.Transparency = Transparency;
    }

    /** ---------------------------------- Transparency ---------------------------------- **/

    /** ---------------------------------- Context ---------------------------------- **/
    Context = ( function () {
        var attach, detach;

        detach = helpers.chainable( function (  ) {
            this.parent = this.el.parentNode;
            if ( this.parent ) {
                this.nextSibling = this.el.nextSibling;
                return this.parent.removeChild( this.el );
            }
        } );

        attach = helpers.chainable( function (  ) {
            if ( this.parent ) {
                if ( this.nextSibling ) {
                    return this.parent.insertBefore( this.el, this.nextSibling );
                } else {
                    return this.parent.appendChild( this.el );
                }
            }
        } );

        function Context( el, Transparency ) {
            this.el = el;
            this.Transparency = Transparency;
            this.template = helpers.cloneNode( this.el );
            this.instances = [new Instance( this.el, this.Transparency )];
            this.instanceCache = [];
        }

        Context.prototype.render = helpers.before( detach )( helpers.after( attach )( helpers.chainable( function ( models, directives, options ) {
            var children, index, instance, model, _i, _len, _results;

            while ( models.length < this.instances.length ) {
                this.instanceCache.push( this.instances.pop(  ).remove(  ) );
            }
            while ( models.length > this.instances.length ) {
                instance = this.instanceCache.pop(  ) || new Instance( helpers.cloneNode( this.template ), this.Transparency );
                this.instances.push( instance.appendTo( this.el ) );
            }
            _results = [];
            for ( index = _i = 0, _len = models.length; _i < _len; index = ++_i ) {
                model = models[index];
                instance = this.instances[index];
                children = [];
                _results.push( instance.prepare( model, children ).renderValues( model, children ).renderDirectives( model, index, directives ).renderChildren( model, children, directives, options ) );
            }
            return _results;
        })));

        return Context;

    })();
   /** ---------------------------------- Context ---------------------------------- **/


   /** ---------------------------------- ElementFactory ---------------------------------- **/
    ElementFactory = {
        Elements: {
            input: {}
        },
        createElement: function ( el ) {
            var El, name;

            if ( 'input' === ( name = el.nodeName.toLowerCase(  ) ) ) {
                El = ElementFactory.Elements[name][el.type.toLowerCase(  )] || Input;
            } else {
                El = ElementFactory.Elements[name] || Element;
            }
            return new El( el );
        }
    };

    Element = ( function (  ) {
        /**
         * @param el
         * @constructor
         */
        function Element( el ) {
            this.el = el;
            this.attributes = {};
            this.childNodes = _.toArray( this.el.childNodes );
            this.nodeName = this.el.nodeName.toLowerCase(  );
            this.classNames = this.el.className.split( ' ' );
        }

        Element.prototype.empty = function (  ) {
            var child;

            while ( child = this.el.firstChild ) {
                this.el.removeChild( child );
            }
            return this;
        };

        Element.prototype.reset = function (  ) {
            var attribute, name, _ref, _results;

            _ref = this.attributes;
            _results = [];
            for ( name in _ref ) {
                attribute = _ref[name];
                _results.push( attribute.set( attribute.templateValue ) );
            }
            return _results;
        };

        Element.prototype.render = function ( value ) {
            return this.attr( 'text', value );
        };

        Element.prototype.attr = function ( name, value ) {
            var attribute, _base;

            attribute = ( _base = this.attributes )[name] || ( _base[name] = AttributeFactory.createAttribute( this.el, name, value ) );
            if ( value != null ) {
                attribute.set( value );
            }
            return attribute;
        };

        Element.prototype.renderDirectives = function ( model, index, attributes ) {
            var directive, name, value, _results;

            _results = [];
            for ( name in attributes ) {

                if ( !attributes.hasOwnProperty( name ) ) {
                    continue;
                }

                directive = attributes[name];

                if ( !( typeof directive === 'function' ) ) {
                    continue;
                }

                value = directive.call( model, {
                    element: this.el,
                    index: index,
                    value: this.attr( name ).templateValue
                } );

                if ( value != null ) {
                    _results.push( this.attr( name, value ) );
                } else {
                    _results.push( void 0 );
                }
            }
            return _results;
        };

        return Element;
    })();

    Select = ( function ( _super ) {
        __extends( Select, _super );

        ElementFactory.Elements['select'] = Select;

        /**
         * @param el
         * @constructor
         */
        function Select( el ) {
            Select.__super__.constructor.call( this, el );
            this.elements = helpers.getElements( el );
        }

        Select.prototype.render = function ( value ) {
            var option, _i, _len, _ref, _results;

            value = value.toString(  );
            _ref = this.elements;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                option = _ref[_i];
                if ( option.nodeName === 'option' ) {
                    _results.push( option.attr( 'selected', option.el.value === value ) );
                }
            }
            return _results;
        };

        return Select;

    })( Element );

    VoidElement = ( function ( _super ) {
        var VOID_ELEMENTS, nodeName, _i, _len;

        __extends( VoidElement, _super );

        /**
         * @return {Object}
         * @constructor
         */
        function VoidElement() {
            _ref = VoidElement.__super__.constructor.apply( this, arguments );
            return _ref;
        }

        VOID_ELEMENTS = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];

        for ( _i = 0, _len = VOID_ELEMENTS.length; _i < _len; _i++ ) {
            nodeName = VOID_ELEMENTS[_i];
            ElementFactory.Elements[nodeName] = VoidElement;
        }

        VoidElement.prototype.attr = function ( name, value ) {
            if ( name !== 'text' && name !== 'html' ) {
                return VoidElement.__super__.attr.call( this, name, value );
            }
        };

        return VoidElement;

    })( Element );

    Input = ( function ( _super ) {
        __extends( Input, _super );

        function Input() {
            _ref1 = Input.__super__.constructor.apply( this, arguments );
            return _ref1;
        }

        Input.prototype.render = function ( value ) {
            return this.attr( 'value', value );
        };

        return Input;

    })( VoidElement );

    TextArea = ( function ( _super ) {
        __extends( TextArea, _super );

        function TextArea() {
            _ref2 = TextArea.__super__.constructor.apply( this, arguments );
            return _ref2;
        }

        ElementFactory.Elements['textarea'] = TextArea;

        return TextArea;

    })( Input );

    Checkbox = ( function ( _super ) {
        __extends( Checkbox, _super );

        function Checkbox() {
            _ref3 = Checkbox.__super__.constructor.apply( this, arguments );
            return _ref3;
        }

        ElementFactory.Elements['input']['checkbox'] = Checkbox;

        Checkbox.prototype.render = function ( value ) {
            return this.attr( 'checked', Boolean( value ) );
        };

        return Checkbox;

    })( Input );

    Radio = ( function ( _super ) {
        __extends( Radio, _super );

        function Radio() {
            _ref4 = Radio.__super__.constructor.apply( this, arguments );
            return _ref4;
        }

        ElementFactory.Elements['input']['radio'] = Radio;

        return Radio;

    })( Checkbox );
    /** ---------------------------------- ElementFactory ---------------------------------- **/


    /** ---------------------------------- Instance ---------------------------------- **/
     Instance = (function () {
        /**
         * @param template
         * @param Transparency
         * @constructor
         */
        function Instance( template, Transparency ) {
            this.Transparency = Transparency;
            this.queryCache = {};
            this.childNodes = _.toArray( template.childNodes );
            this.elements = helpers.getElements( template );
        }

        Instance.prototype.remove = helpers.chainable( function (  ) {
            var node, _i, _len, _ref, _results;

            _ref = this.childNodes;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                node = _ref[_i];
                _results.push( node.parentNode.removeChild( node ) );
            }
            return _results;
        } );

        Instance.prototype.appendTo = helpers.chainable( function ( parent ) {
            var node, _i, _len, _ref, _results;

            _ref = this.childNodes;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                node = _ref[_i];
                _results.push( parent.appendChild( node ) );
            }
            return _results;
        } );

        Instance.prototype.prepare = helpers.chainable( function ( model ) {
            var element, _i, _len, _ref, _results;

            _ref = this.elements;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                element = _ref[_i];
                element.reset(  );
                _results.push( helpers.data( element.el ).model = model );
            }
            return _results;
        } );

        Instance.prototype.renderValues = helpers.chainable( function ( model, children ) {
            var element, key, value, _results;

            if ( _.isElement( model ) && ( element = this.elements[0] ) ) {
                return element.empty(  ).el.appendChild( model );
            } else if ( typeof model === 'object' ) {
                _results = [];
                for ( key in model ) {
                    if ( !model.hasOwnProperty( key ) ) {
                        continue;
                    }

                    value = model[key];

                    if ( value != null ) {
                        if ( _.isString( value ) || _.isNumber( value ) || _.isBoolean( value ) || _.isDate( value ) ) {
                            _results.push( ( function (  ) {
                                var _i, _len, _ref, _results1;

                                _ref = this.matchingElements( key );
                                _results1 = [];
                                for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                                    element = _ref[_i];
                                    _results1.push( element.render( value ) );
                                }
                                return _results1;
                            } ).call( this ) );
                        } else if ( typeof value === 'object' ) {
                            _results.push( children.push( key ) );
                        } else {
                            _results.push( void 0 );
                        }
                    }
                }
                return _results;
            }
        } );

        Instance.prototype.renderDirectives = helpers.chainable( function ( model, index, directives ) {
            var attributes, element, key, _results;

            _results = [];
            for ( key in directives ) {

                if ( !directives.hasOwnProperty( key ) ) {
                    continue;
                }

                attributes = directives[key];
                if ( !( typeof attributes === 'object' ) ) {
                    continue;
                }
                if ( typeof model !== 'object' ) {
                    model = {
                        value: model
                    };
                }
                _results.push( ( function (  ) {
                    var _i, _len, _ref, _results1;

                    _ref = this.matchingElements( key );
                    _results1 = [];
                    for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                        element = _ref[_i];
                        _results1.push( element.renderDirectives( model, index, attributes ) );
                    }
                    return _results1;
                } ).call( this ) );
            }
            return _results;
        } );

        Instance.prototype.renderChildren = helpers.chainable( function ( model, children, directives, options ) {
            var element, key, _i, _len, _results;

            _results = [];
            for ( _i = 0, _len = children.length; _i < _len; _i++ ) {
                key = children[_i];
                _results.push( ( function (  ) {
                    var _j, _len1, _ref, _results1;

                    _ref = this.matchingElements( key );
                    _results1 = [];
                    for ( _j = 0, _len1 = _ref.length; _j < _len1; _j++ ) {
                        element = _ref[_j];
                        _results1.push( this.Transparency.render( element.el, model[key], directives[key], options ) );
                    }
                    return _results1;
                } ).call( this ) );
            }
            return _results;
        } );

        Instance.prototype.matchingElements = function ( key ) {
            var el, elements, _base;

            elements = ( _base = this.queryCache )[key] || ( _base[key] = ( function (  ) {
                var _i, _len, _ref, _results;

                _ref = this.elements;
                _results = [];
                for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                    el = _ref[_i];
                    if ( this.Transparency.matcher( el, key ) ) {
                        _results.push( el );
                    }
                }
                return _results;
            } ).call( this ) );

            console.log( "Matching elements for '" + key + "':", elements );

            return elements;
        };

        return Instance;

    })();
    /** ---------------------------------- Instance ---------------------------------- **/

    /** -------------------------------------- Attribute Factory -------------------------------------- **/
    AttributeFactory = {
        Attributes: {},
        createAttribute: function ( element, name ) {
            var Attr;

            Attr = AttributeFactory.Attributes[name] || Attribute;
            return new Attr( element, name );
        }
    };

    Attribute = ( function () {
        function Attribute( el, name ) {
            this.el = el;
            this.name = name;
            this.templateValue = this.el.getAttribute( this.name ) || '';
        }

        Attribute.prototype.set = function ( value ) {
            this.el[this.name] = value;
            return this.el.setAttribute( this.name, value.toString(  ) );
        };

        return Attribute;
    })();

    BooleanAttribute = ( function ( _super ) {
        var BOOLEAN_ATTRIBUTES, name, _i, _len;

        __extends( BooleanAttribute, _super );

        BOOLEAN_ATTRIBUTES = ['hidden', 'async', 'defer', 'autofocus', 'formnovalidate', 'disabled', 'autofocus', 'formnovalidate', 'multiple', 'readonly', 'required', 'checked', 'scoped', 'reversed', 'selected', 'loop', 'muted', 'autoplay', 'controls', 'seamless', 'default', 'ismap', 'novalidate', 'open', 'typemustmatch', 'truespeed'];

        for ( _i = 0, _len = BOOLEAN_ATTRIBUTES.length; _i < _len; _i++ ) {
            name = BOOLEAN_ATTRIBUTES[_i];
            AttributeFactory.Attributes[name] = BooleanAttribute;
        }

        function BooleanAttribute( el, name ) {
            this.el = el;
            this.name = name;
            this.templateValue = this.el.getAttribute( this.name ) || false;
        }

        BooleanAttribute.prototype.set = function ( value ) {
            this.el[this.name] = value;
            if ( value ) {
                return this.el.setAttribute( this.name, this.name );
            } else {
                return this.el.removeAttribute( this.name );
            }
        };

        return BooleanAttribute;

    } )( Attribute );

    Text = ( function ( _super ) {
        __extends( Text, _super );

        AttributeFactory.Attributes[ 'text' ] = Text;

        function Text( el, name ) {
            var child;

            this.el = el;
            this.name = name;
            this.templateValue = ( ( function (  ) {
                var _i, _len, _ref, _results;

                _ref = this.el.childNodes;
                _results = [];
                for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                    child = _ref[_i];
                    if ( child.nodeType === helpers.TEXT_NODE ) {
                        _results.push( child.nodeValue );
                    }
                }
                return _results;
            } ).call( this ) ).join( '' );
            this.children = _.toArray( this.el.children );
            if ( !( this.textNode = this.el.firstChild ) ) {
                this.el.appendChild( this.textNode = this.el.ownerDocument.createTextNode( '' ) );
            } else if ( this.textNode.nodeType !== helpers.TEXT_NODE ) {
                this.textNode = this.el.insertBefore( this.el.ownerDocument.createTextNode( '' ), this.textNode );
            }
        }

        Text.prototype.set = function ( text ) {
            var child, _i, _len, _ref, _results;

            while ( child = this.el.firstChild ) {
                this.el.removeChild( child );
            }
            this.textNode.nodeValue = text;
            this.el.appendChild( this.textNode );
            _ref = this.children;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                child = _ref[_i];
                _results.push( this.el.appendChild( child ) );
            }
            return _results;
        };

        return Text;

    })( Attribute );

    Html = ( function ( _super ) {
        __extends( Html, _super );

        AttributeFactory.Attributes['html'] = Html;

        function Html( el ) {
            this.el = el;
            this.templateValue = '';
            this.children = _.toArray( this.el.children );
        }

        Html.prototype.set = function ( html ) {
            var child, _i, _len, _ref, _results;

            while ( child = this.el.firstChild ) {
                this.el.removeChild( child );
            }
            this.el.innerHTML = html + this.templateValue;
            _ref = this.children;
            _results = [];
            for ( _i = 0, _len = _ref.length; _i < _len; _i++ ) {
                child = _ref[_i];
                _results.push( this.el.appendChild( child ) );
            }
            return _results;
        };

        return Html;

    })( Attribute );

    Class = ( function ( _super ) {
        __extends( Class, _super );

        AttributeFactory.Attributes['class'] = Class;

        function Class( el ) {
            Class.__super__.constructor.call( this, el, 'class' );
        }

        return Class;

    })( Attribute );
    /** -------------------------------------- Attribute Factory -------------------------------------- **/

})();

