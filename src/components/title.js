import React from 'react';
import { withLDConsumer } from "launchdarkly-react-client-sdk";

function HeroText({ flags, ldClient }) {
    // Get the conference title from LaunchDarkly flag
    const getTitleContent = () => {
        try {
            const titleConfig = ldClient.variation("config-conference-title");
            return titleConfig;
        } catch (error) {
            console.warn('Error getting conference-title variation:', error);
            // Fallback to default values
            return {
                main: "LaunchDarkly",
                subtitle: "I'm glad you're here :)"
            };
        }
    };

    const titleContent = getTitleContent();

    return (
        <div className="titleContainer">
            <div className="heroText">
                {titleContent?.main || "RKO 2023"}
            </div>
            <div className="subtitle">
                {titleContent?.subtitle || "Formula for Success"}
            </div>
        </div>
    );
}

export default withLDConsumer()(HeroText);