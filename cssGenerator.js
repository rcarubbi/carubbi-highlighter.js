import { getObjectHash } from './sha256.js';

let mainStyle = document.createElement("style");
document.head.appendChild(mainStyle);

const keyFramesElements = {};
const animationElements = {};

export async function ensureKeyFrames(config) {
    const keyFramesKey = await getKeyFramesKey(config);
    let keyFramesElement = keyFramesElements[keyFramesKey];
    if (!keyFramesElement) {
        keyFramesElement = `
        @keyframes highlight-${keyFramesKey} {
            ${config.inTime}% {
                background-color: ${config.backgroundColor};
                color: ${config.color};
            }
            
            ${config.outTime}% {
                background-color: ${config.originalBackgroundColor};
                color: ${config.originalColor};
            }
        }`;
        mainStyle.innerHTML += keyFramesElement;
        keyFramesElements[keyFramesKey] = keyFramesElement;
    }
}


async function getKeyFramesKey(config) {
    const configObj = {
        backgroundColor: config.backgroundColor.replace(/\#/g, ""),
        color: config.color.replace(/\#/g, ""),
        inTime: config.inTime,
        outTime: config.outTime
    };

    return await getObjectHash(configObj);
}

export async function getAnimationKey(config) {
    const configObj = {
        backgroundColor: config.backgroundColor.replace(/\#/g, ""),
        color: config.color.replace(/\#/g, ""),
        inTime: config.inTime,
        outTime: config.outTime,
        duration: config.duration
    }
    return await getObjectHash(configObj);
}

export async function ensureAnimations(config) {
    const animationKey = await getAnimationKey(config);
    const keyFramesKey = await getKeyFramesKey(config);
    let animationElement = animationElements[animationKey];
    if (!animationElement) {
        animationElement = `
            .refresh-${animationKey} {
                animation: highlight-${keyFramesKey} ${config.duration}s;
            }`;
        mainStyle.innerHTML += animationElement;
        animationElements[animationKey] = animationElement;
    }
}