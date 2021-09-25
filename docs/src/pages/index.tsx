import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import clsx from "clsx";
import React from "react";

import ComplexSVG from "../../static/img/butterfly.svg";
import IceCreamSVG from "../../static/img/ice-cream.svg";
import LogoSVG from "../../static/img/logo.svg";
import SettingsSVG from "../../static/img/settings.svg";
import DemoWidget from "../components/DemoWidget";
import LiveCodeblock from "../components/LiveCodeblock";
import styles from "./index.module.scss";

interface Feature {
    title: string;
    image: any;
    description: JSX.Element;
}

const features: Feature[] = [
    {
        title: "Easy to Use",
        image: <IceCreamSVG className="easy" />,
        description: (
            <>
                <p>
                    Just include the library in your HTML file, or install it via npm, and you&apos;re ready to go! All
                    of the setup is done internally, without you having to break a sweat.
                </p>
                <CodeBlock className="html">{`<script src="https://cdn.jsdelivr.net/npm/party-js@latest/bundle/party.min.js"></script>`}</CodeBlock>
                <CodeBlock className="bash">{`npm install party-js --save`}</CodeBlock>
            </>
        ),
    },
    {
        title: "Highly customizeable",
        image: <SettingsSVG className="settings" />,
        description: (
            <>
                <p>
                    We believe that users should be able to decide for themselves how the effects should look.
                    That&apos;s why every effect has default options, which can easily be overriden by the user.
                </p>
                <CodeBlock className="javascript">{`party.confetti(this, {
    count: party.variation.range(20, 40),
    size: party.variation.range(0.8, 1.2),
    // ... and more!
});`}</CodeBlock>
            </>
        ),
    },
    {
        title: "As complex as you need it to be",
        image: <ComplexSVG className="complex" />,
        description: (
            <>
                <p>
                    You can call effects either with a single line of code, or with a huge block of options, fine-tuning
                    every effect to your exact liking!
                </p>
                <CodeBlock className="javascript">{`party.scene.current.createEmitter({
    emitterOptions: {
        // Customize the emitter behaviour, ...
    },
    emissionOptions: {
        // ... the emission of the particles, ...
    },
    rendererOptions: {
        // ... and the appearance!
    }
});`}</CodeBlock>
            </>
        ),
    },
];

const FeatureElement: React.FunctionComponent<Feature> = function ({ title, image, description }: Feature) {
    return (
        <div className={styles.feature}>
            {typeof image === "string" ? (
                <img className="icon" src={useBaseUrl(image)} alt={title} draggable={false} />
            ) : (
                <div className="icon">{image}</div>
            )}
            <div className="description">
                <h3>{title}</h3>
                <div>{description}</div>
            </div>
        </div>
    );
};

export default function () {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context as any;
    return (
        <Layout title={`Hello!`} description={siteConfig.tagline}>
            <header className={clsx("hero hero--primary", styles.hero)}>
                <div className="container">
                    <div className="row">
                        <div className="col col--6 infos">
                            <div className="logo">
                                <LogoSVG className="logo" />
                            </div>
                            <div>
                                <h1>party.js</h1>
                                <h2>
                                    A JavaScript library to brighten up your user's site experience with visual effects!
                                </h2>
                                <div className="buttons">
                                    <Link to={useBaseUrl("/docs")} className="button button--lg button--docs">
                                        Quick Start
                                    </Link>
                                    <a
                                        href="https://github.com/yiliansource/party-js"
                                        target="_blank"
                                        className="button button--lg button--github"
                                    >
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="col live-demo">
                            <LiveCodeblock
                                code={`party.confetti(runButton, {
    count: party.variation.range(20, 40)
});`}
                            />
                        </div>
                    </div>
                </div>
            </header>
            <main className={styles.frontBody}>
                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            {features.map((props, idx) => (
                                <FeatureElement key={idx} {...props} />
                            ))}
                        </div>
                    </section>
                )}

                <section className={styles.demos}>
                    <div className="container">
                        <div className="header">
                            <h1>Try it out!</h1>
                        </div>
                        <DemoWidget />
                    </div>
                </section>
            </main>
        </Layout>
    );
}
