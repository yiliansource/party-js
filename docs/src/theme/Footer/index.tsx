import Link from "@docusaurus/Link";
import isInternalUrl from "@docusaurus/isInternalUrl";
import { useThemeConfig } from "@docusaurus/theme-common";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import IconExternalLink from "@theme/IconExternalLink";
import ThemedImage from "@theme/ThemedImage";
import clsx from "clsx";
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

// function FooterLink({ to, href, label, prependBaseUrlToHref, ...props }) {
//     const toUrl = useBaseUrl(to);
//     const normalizedHref = useBaseUrl(href, {
//         forcePrependBaseUrl: true,
//     });
//     return (
//         <Link
//             className="footer__link-item"
//             {...(href
//                 ? {
//                       href: prependBaseUrlToHref ? normalizedHref : href,
//                   }
//                 : {
//                       to: toUrl,
//                   })}
//             {...props}
//         >
//             {href && !isInternalUrl(href) ? (
//                 <span>
//                     {label}
//                     <IconExternalLink />
//                 </span>
//             ) : (
//                 label
//             )}
//         </Link>
//     );
// }

// const FooterLogo = ({ sources, alt }) => <ThemedImage className="footer__logo" alt={alt} sources={sources} />;

// function Footer() {
//     const { footer } = useThemeConfig();
//     const { copyright, links = [], logo = {} } = footer || {};
//     const sources = {
//         light: useBaseUrl(logo.src),
//         dark: useBaseUrl(logo.srcDark || logo.src),
//     };

//     if (!footer) {
//         return null;
//     }

//     return (
//         <footer
//             className={clsx("footer", {
//                 "footer--dark": footer.style === "dark",
//             })}
//         >
//             <div className="container">
//                 Test
//                 {links && links.length > 0 && (
//                     <div className="row footer__links">
//                         {links.map((linkItem, i) => (
//                             <div key={i} className="col footer__col">
//                                 {linkItem.title != null ? <div className="footer__title">{linkItem.title}</div> : null}
//                                 {linkItem.items != null &&
//                                 Array.isArray(linkItem.items) &&
//                                 linkItem.items.length > 0 ? (
//                                     <ul className="footer__items">
//                                         {linkItem.items.map((item, key) =>
//                                             item.html ? (
//                                                 <li
//                                                     key={key}
//                                                     className="footer__item" // Developer provided the HTML, so assume it's safe.
//                                                     // eslint-disable-next-line react/no-danger
//                                                     dangerouslySetInnerHTML={{
//                                                         __html: item.html,
//                                                     }}
//                                                 />
//                                             ) : (
//                                                 <li key={item.href || item.to} className="footer__item">
//                                                     <FooterLink {...(item as any)} />
//                                                 </li>
//                                             )
//                                         )}
//                                     </ul>
//                                 ) : null}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//                 {(logo || copyright) && (
//                     <div className="footer__bottom text--center">
//                         {logo && (logo.src || logo.srcDark) && (
//                             <div className="margin-bottom--sm">
//                                 {logo.href ? (
//                                     <Link href={logo.href} className={styles.footerLogoLink}>
//                                         <FooterLogo alt={logo.alt} sources={sources} />
//                                     </Link>
//                                 ) : (
//                                     <FooterLogo alt={logo.alt} sources={sources} />
//                                 )}
//                             </div>
//                         )}
//                         {copyright ? (
//                             <div
//                                 className="footer__copyright" // Developer provided the HTML, so assume it's safe.
//                                 // eslint-disable-next-line react/no-danger
//                                 dangerouslySetInnerHTML={{
//                                     __html: copyright,
//                                 }}
//                             />
//                         ) : null}
//                     </div>
//                 )}
//             </div>
//         </footer>
//     );
// }

// export default Footer;
