window.addEventListener("load", function () {
    let siteColors = ['#ffa68d', '#fd3a84'];

    party.registerShape('star', '<polygon points="512,197.816 325.961,185.585 255.898,9.569 185.835,185.585 0,197.816 142.534,318.842 95.762,502.431 255.898,401.21 416.035,502.431 369.263,318.842"/>');
    party.registerShape('heart', '<path d="M316.722,29.761c66.852,0,121.053,54.202,121.053,121.041c0,110.478-218.893,257.212-218.893,257.212S0,266.569,0,150.801 C0,67.584,54.202,29.761,121.041,29.761c40.262,0,75.827,19.745,97.841,49.976C240.899,49.506,276.47,29.761,316.722,29.761z"/>');

    let clickHandlers = {
        buttonConfetti: function (e) {
            e.preventDefault();
            party.element(this, {
                color: siteColors,
                count: party.variation(25, 0.5),
                size: party.minmax(6, 10),
                velocity: party.minmax(-300, -600),
                angularVelocity: party.minmax(6, 9)
            });
        },
        screenConfetti: function (e) {
            e.preventDefault();
            party.screen({
                color: siteColors,
                size: party.minmax(6, 12),
                count: party.variation(300 * (window.innerWidth / 1980), 0.4),
                angle: -180,
                spread: 80,
                angularVelocity: party.minmax(6, 9)
            });
        },
        shapeConfetti: function (e) {
            e.preventDefault();
            party.element(this, {
                shape: ['star', 'heart'],
                count: 20,
                color: siteColors,
                spread: 360,
                gravity: false,
                size: party.minmax(14, 22),
                velocity: party.minmax(-300, -600),
                angularVelocity: party.minmax(2, 4)
            });
        }
    }

    for (let id in clickHandlers) {
        let element = document.getElementById(id);
        if (element) {
            element.addEventListener("mousedown", clickHandlers[id]);
        }
    }
});