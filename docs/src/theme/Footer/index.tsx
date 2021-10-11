import Link from "@docusaurus/Link";
import { useThemeConfig } from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import React from "react";

import LogoSVG from "../../../static/img/logo.svg";
import styles from "./styles.module.scss";

export default function Footer(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    const { title, tagline } = siteConfig as any;

    const { footer } = useThemeConfig();
    const { links = [] } = footer || {};

    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className="footer-row">
                    <div className="footer-col">
                        <p className="title">
                            <LogoSVG className="logo" />
                            <span>{title}</span>
                        </p>
                        <p className="tagline">{tagline}</p>
                        <p className="copyright">Copyright &copy; {new Date().getFullYear()} Ian Hornik</p>
                    </div>
                    <div className="footer-col">
                        <div className="footer-row">
                            {links.map((cat, i) => (
                                <div className="footer-col" key={i}>
                                    <h3 className="category-title">{cat.title}</h3>
                                    <ul className="category-links">
                                        {cat.items.map((link, i) => (
                                            <li key={i}>
                                                <Link
                                                    {...(link.href ? { href: link.href } : { to: useBaseUrl(link.to) })}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
