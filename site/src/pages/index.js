import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/ice-cream.svg',
    description: (
      <>
        Just include the library in your HTML file and you&apos;re
        ready to go! All of the setup is done internally, without you
        having to break a sweat.
      </>
    ),
  },
  {
    title: 'Highly customizeable',
    imageUrl: 'img/settings.svg',
    description: (
      <>
        We believe that users should be able to decide for themselves
        how the effects should look. That&apos;s why every effect has
        default options, which can easily be overriden by the user.
      </>
    ),
  },
  {
    title: 'As complex as you need it to be',
    imageUrl: 'img/butterfly.svg',
    description: (
      <>
        You can call effects either with a single line of code, or with
        a huge block of options, fine-tuning every effect to your exact
        liking!
      </>
    ),
  },
];

const demos = [
  {
    id: 'buttonConfetti',
    title: 'Confetti clicking!',
    description: (
      <>
        Click the button to let some confetti explode from it!
      </>
    )
  },
  {
    id: 'screenConfetti',
    title: 'Make it rain!',
    description: (
      <>
        Want to cover the entire screen in confetti? That's possible aswell!
      </>
    )
  },
  {
    id: 'shapeConfetti',
    title: 'Tired of rectangles and squares?',
    description: (
      <>
        But just using basic shapes all the time is boring.
        Let's spice it up a little!
      </>
    )
  },
]

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} draggable="false" />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
function Demo({id, title, exampleSlug, description}) {
  return (
    <div className={clsx('col col--4', styles.demo)}>
      <div className="text--center">
        <div className={styles.demoButton} id={id}>
          <img src={useBaseUrl('img/cursor.svg')} draggable="false"/>
        </div>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello!`}
      description="Description will go into a meta tag in <head />">
      <header className={clsx('hero hero--primary', styles.hero_banner)}>
        <div className="container">
          <h1 className={clsx(styles.hero_title)}>{siteConfig.title}</h1>
          <p className={clsx(styles.hero_subtitle)}>{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--lg',
                styles.hero_buttonGetStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
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
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
        {demos && demos.length > 0 && (
          <section className={styles.demos}>
            <h1>Check out the demos!</h1>
            <br/>
            <div className="container">
              <div className="row">
                {demos.map((props, idx) => (
                  <Demo key={idx} {...props} />
                ))}
              </div>
            </div>
            <div className={styles.exampleLink}>
              <a href="/docs/examples">Check out the source code for the examples!</a>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
