import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import clsx from "clsx";
import { Source } from "party-js/dist/util";
import React from "react";

import PartyJSLogo from "../../static/img/logo.svg";
import DemoButton from "../components/DemoButton";
import * as demoMethods from "../util/demos";
import styles from "./styles.module.css";

interface Feature {
    title: string;
    imageUrl: string;
    description: JSX.Element;
}

interface Demo {
    title: string;
    demoMethod: (source: Source) => void;
    description: JSX.Element;
}

const features: Feature[] = [
    {
        title: "Easy to Use",
        imageUrl: "img/ice-cream.svg",
        description: (
            <>
                Just include the library in your HTML file and you&apos;re ready
                to go! All of the setup is done internally, without you having
                to break a sweat.
            </>
        ),
    },
    {
        title: "Highly customizeable",
        imageUrl: "img/settings.svg",
        description: (
            <>
                We believe that users should be able to decide for themselves
                how the effects should look. That&apos;s why every effect has
                default options, which can easily be overriden by the user.
            </>
        ),
    },
    {
        title: "As complex as you need it to be",
        imageUrl: "img/butterfly.svg",
        description: (
            <>
                You can call effects either with a single line of code, or with
                a huge block of options, fine-tuning every effect to your exact
                liking!
            </>
        ),
    },
];

const demos: Demo[] = [
    {
        title: "Confetti clicking!",
        demoMethod: demoMethods.confetti,
        description: (
            <>Click the button to let some confetti explode from it!</>
        ),
    },
    {
        title: "Sparkly!",
        demoMethod: demoMethods.sparkles,
        description: (
            <>Want to add some sparkles to something? That's possible aswell!</>
        ),
    },
    {
        title: "Spread the love!",
        demoMethod: demoMethods.hearts,
        description: (
            <>Want to fill the screens of your users with hearts? Go for it!</>
        ),
    },
];

const FeatureElement: React.FunctionComponent<Feature> = function ({
    title,
    imageUrl,
    description,
}: Feature) {
    const imgUrl = useBaseUrl(imageUrl);
    return (
        <div className={clsx("col col--4", styles.feature)}>
            {imgUrl && (
                <div className="text--center">
                    <img
                        className={styles.featureImage}
                        src={imgUrl}
                        alt={title}
                        draggable="false"
                    />
                </div>
            )}
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};

const DemoElement: React.FunctionComponent<Demo> = function ({
    title,
    demoMethod,
    description,
}: Demo) {
    return (
        <div className={clsx("demo col col--4", styles.demo)}>
            <h3>{title}</h3>
            <p>{description}</p>
            <DemoButton demoMethod={demoMethod} />
        </div>
    );
};

export default function () {
    const context = useDocusaurusContext();
    const { siteConfig = {} } = context;
    return (
        <Layout title={`Hello!`} description={siteConfig.tagline}>
            <header className={clsx("hero hero--primary", styles.heroBanner)}>
                <div className="container">
                    <h1 className={clsx(styles.heroTitle)}>
                        <span>
                            <PartyJSLogo className={clsx(styles.heroLogo)} />
                            {siteConfig.title}
                        </span>
                    </h1>
                    <h2 className={clsx(styles.heroSubtitle)}>
                        {siteConfig.tagline}
                    </h2>
                    <div className={styles.buttons}>
                        <Link
                            className={clsx(
                                "button button--outline button--lg",
                                styles.heroButtonGetStarted
                            )}
                            to={useBaseUrl("docs/")}
                        >
                            Quick Start
                        </Link>
                    </div>
                </div>
            </header>
            <main>
                {features && features.length > 0 && (
                    <section className={styles.features}>
                        <div className="container">
                            <div className="row">
                                {features.map((props, idx) => (
                                    <FeatureElement key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {demos && demos.length > 0 && (
                    <section className={styles.demos}>
                        <h1>Check out the demos!</h1>
                        <div className="container">
                            <div className="row">
                                {demos.map((props, idx) => (
                                    <DemoElement key={idx} {...props} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.exampleLink}>
                            <Link to="/docs/examples/simple">
                                Check out the source code for the examples!
                            </Link>
                        </div>
                    </section>
                )}
            </main>
        </Layout>
    );
}
