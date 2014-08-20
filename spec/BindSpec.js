describe("Bind", function() {

    it("should contain public API", function() {
        expect(Bind.render).toBeDefined();
        expect(Bind.matcher).toBeDefined();
    });

    describe('as macher', function() {
        var iDiv;
        var someKey = 'SOME_KEY_SOME_KEY';

        beforeEach(function() {
            iDiv = document.createElement('div');
        });

        it("should match id", function() {
            iDiv.id = someKey;
            expect(Bind.matcher( iDiv, someKey )).toBe(true);
        });

        it("should match class", function() {
            iDiv.className  = someKey;
            expect(Bind.matcher( iDiv, someKey )).toBeTruthy();
        });

        it("should match name", function() {
            iDiv.name = someKey;
            expect(Bind.matcher( iDiv, someKey )).toBeTruthy();
        });

        it("should match data-bind", function() {
            iDiv.setAttribute('data-bind', someKey);
            expect(Bind.matcher( iDiv, someKey )).toBeTruthy();
        });
    });

    describe('as render', function() {

        var iEl;

        beforeEach(function() {
            iEl = bonzo(
                    '<div id="template" style="color: green">'+
                    '<span class="greeting"></span>'+
                    '<span class="name"></span>'+
                    '</div>'
            );

            bonzo( document.body ).append( iEl[0] );
        });

        afterEach(function() {
            bonzo( document.getElementById('template') ).remove();
        });

        it("should render simple object", function() {
            var hello = {
                greeting: 'Hello',
                name:     'world!'
            };

            Bind.render(document.getElementById('template'), hello);

            var keys = Object.keys(hello);

            for ( var i = 0; i < keys.length; i++) {
                expect( bonzo(document.getElementsByClassName( keys[i] )[0]).text()).toBe( hello[ keys[i] ] );
            }
        });

    });

});
