function demoConfetti(id) {
    const element = document.getElementById(id);
    party.confetti(element, {
        size: party.variation.range(0.6, 1),
    });
}

function demoSparkles(id) {
    const element = document.getElementById(id);
    party.sparkles(element);
}

function demoHearts(id) {
    const element = document.getElementById(id);
    const rect = party.util.sourceToRect(element);

    if (!party.resolvableShapes.heart) {
        party.resolvableShapes.heart = `<svg viewBox="0 0 512 512" height="20" width="20"><path d="M316.722,29.761c66.852,0,121.053,54.202,121.053,121.041c0,110.478-218.893,257.212-218.893,257.212S0,266.569,0,150.801 C0,67.584,54.202,29.761,121.041,29.761c40.262,0,75.827,19.745,97.841,49.976C240.899,49.506,276.47,29.761,316.722,29.761z"/></svg>`;
    }

    const emitter = party.scene.createEmitter({
        emitterOptions: {
            loops: 1,
            useGravity: false,
            initialSpeed: 400,
            initialColor: party.variation.gradientSample(
                party.Gradient.simple(party.Color.fromHex("#ffa68d"), party.Color.fromHex("#fd3a84"))
            ),
        },
        emissionOptions: {
            rate: 0,
            bursts: [{ time: 0, count: party.variation.skew(20, 10) }],
        },
        shapeOptions: {
            angle: party.variation.range(0, 360),
            source: rect,
        },
        rendererOptions: {
            shapeFactory: "heart",
            applyLighting: undefined,
        },
    });

    const rotationModule = emitter.addModule(party.modules.RotationModifier);
    rotationModule.rotation = (p) => new party.Vector(0, 0, 100).scale(p.initialLifetime - p.lifetime);

    const sizeModule = emitter.addModule(party.modules.SizeModifier);
    sizeModule.size = (p) => 0.5 + 0.3 * (Math.cos((p.initialLifetime - p.lifetime) * 10) + 1);
}
