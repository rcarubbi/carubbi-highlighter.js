import {ensureAnimations, ensureKeyFrames, getAnimationKey } from './cssGenerator.js';
 
const timeoutRefs = {};

const defaultConfig = {
    duration: 3,
    backgroundColor: 'yellow',
    cancellationToken: null,
    color: 'black',
    inTime: 50,
    outTime: 100
};

let executionContext = {};

export async function highlight(elementId, transitions) {

    executionContext[elementId] ||= {};

    if (executionContext[elementId].cancellationToken) {
        executionContext[elementId].cancellationToken.abort();

    }

    executionContext[elementId].cancellationToken = new AbortController();

    try {
        for (const transition of transitions) {
            await run(elementId, {
                ...transition,
                cancellationToken: executionContext[elementId].cancellationToken
            });

        }
    } catch (e) { console.error(e) }
}

async function run(elementId, transition) {
    if (transition.cancellationToken.signal.aborted)
        return;

    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Element with the provided ID does not exist");
        return;
    }
    const computedStyles = window.getComputedStyle(element);

    const currentConfig = {
        ...defaultConfig,
        originalBackgroundColor: computedStyles.backgroundColor,
        originalColor: computedStyles.color,
        ...transition
    };

    await ensureKeyFrames(currentConfig);
    await ensureAnimations(currentConfig);

    const animationKey = await getAnimationKey(currentConfig);

    return new Promise((resolve, reject) => {

        const handleAbort = () => {
            if (timeoutRefs[elementId]) {
                clearTimeout(timeoutRefs[elementId]);
            }
            requestAnimationFrame(() => {
                element.classList.remove(`refresh-${animationKey}`);
            });
            reject();
        };

        const handleAnimationEnd = () => {
            element.classList.remove(`refresh-${animationKey}`);
            resolve();
        };

        currentConfig.cancellationToken.signal.addEventListener('abort', handleAbort)

        element.classList.remove(`refresh-${animationKey}`);

        requestAnimationFrame(() => {
            element.classList.add(`refresh-${animationKey}`);
        });

        timeoutRefs[elementId] = setTimeout(handleAnimationEnd, (currentConfig.duration * 1000));
    });
}

