'use strict';

/**
 * Transparency.js 1.6.0
 * ( c ) 2014 Romaniv Maksym, DocumentCloud and Investigative Reporters & Editors
 * Transparency may be freely distributed under the MIT license.
 *
 *    Template:
 *    //
 *    //  <ul id="todos">
 *    //    <li class="todo"></li>
 *    //  </ul>
 *
 *    template = document.querySelector('#todos');
 *
 *     models = [
 *       {todo: "Eat"},
 *       {todo: "Do some programming"},
 *       {todo: "Sleep"}
 *     ];
 *
 *     Bind.render(template, models);
 *
 *     //  Result:
 *     //  <ul id="todos">
 *     //    <li class="todo">Eat</li>
 *     //    <li class="todo">Do some programming</li>
 *     //    <li class="todo">Sleep</li>
 *     //   </ul>
 *
 * ----------------------------------------------------------------------------------
 *
 *      In general:
 *      Bind.render = function ( context, models, directives, options)
 *
 *      context
 *      models
 *      directives
 *      options: {
 *          debug : false
 *      }
 *
 *
 */

(function() {
    var render_,
        addModelToCtx_,
        renderListOfItems_;

    var root = window;

    var Bind = {};

    root.Bind = Bind;

    if (!bonzo) { console.error('Bonzo module/library doesn\'t exists') };

    /**
     * @param context
     * @param models
     * @param directives
     * @param options
     * @returns {Element}
     */
    Bind.render = function(context, models, directives, options) {
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
            console.log( "Bind.render:", context, models, directives, options );
        }

        if ( !context ) {
            return;
        }

        return render_ ( context, models, directives, options );
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

    /**
     * @param context
     * @param model
     * @param directives
     * @param options
     * @returns {Element}
     * @private
     */
    render_ = function( context, model, directives, options ) {
        if ( Array.isArray( model ) ) {
            renderListOfItems_( context, model );
        } else {
            addModelToCtx_( context, model );
        }

        return context;
    };

    /**
     * @param ctx
     * @param model
     * @returns {Element}
     * @private
     */
    addModelToCtx_ = function ( ctx, model ) {
        var keys, child,
            i, j;

        keys = Object.keys(model);

        for (i = 0; i < keys.length; i++) {
            for (j = 0; j < ctx.children.length; j++) {
                child = ctx.children[j];
                if (Bind.matcher( child, keys[i] )) {
                    if (child.children.length) {
                        addModelToCtx_( child, model[keys[i]]);
                    }

                    if ( Array.isArray( model[keys[i]] ) ) {
                        renderListOfItems_( child, model[keys[i]] );
                    }

                    if ((typeof model[ keys[i] ] != "object") || (model[ keys[i] ] == null)) {
                        bonzo(child).text( model[ keys[i] ] );
                    }

                }
            }
        }

        return ctx;
    };


    /**
     * @param context
     * @param model
     * @private
     */
    renderListOfItems_ = function( context, model ) {
        var i, childEl, ctx, childs = [], cloneChildEl ;

        ctx = bonzo( context );
        childEl = context.children[0];

        for (i = 0; i < model.length; i++ ) {
            cloneChildEl = childEl.cloneNode(true);
            bonzo( cloneChildEl ).text( model[i] ).addClass( model[i] );

            childs.push( cloneChildEl );
        }
        //delete first element example
        bonzo(childEl).remove();

        //render list of elements
        ctx.append( childs );
    };

})();