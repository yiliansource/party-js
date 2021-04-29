import BrowserOnly from "@docusaurus/BrowserOnly";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import React from "react";

import EmitterBuilder from "../components/builder/EmitterBuilder";

export default class Builder extends React.Component {
    render() {
        return (
            <Layout
                title="Builder"
                description="Use the site's integrated effect builder to customize"
            >
                <BrowserOnly fallback={<div>Loading effect builder ...</div>}>
                    {() => <EmitterBuilder />}
                </BrowserOnly>
            </Layout>
        );
    }
}
