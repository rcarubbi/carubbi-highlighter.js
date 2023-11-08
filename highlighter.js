
let mainStyle = document.querySelector('style');
if (!mainStyle) {
    mainStyle = document.createElement("style");
    document.head.appendChild(mainStyle);
}

const cssElements = {};
const timeoutRefs = {};
const defaultConfig = {
    duration: 3,
    highLightColor: 'yellow',
    bgColor: 'white',
    cancellationToken: null
}

let context = {};
export async function highlight(elementId, configs) {
    context[elementId] ||= {};

    if (context[elementId].ac) {
        context[elementId].ac.abort();
    }

    context[elementId].ac = new AbortController();

    for (const config of configs) {
        try {
            await run(elementId, { ...config, cancellationToken: context[elementId].ac.signal })
        } catch (e) {
            break;
        }
    }
}


function run(elementId, config) {
    const currentConfig = { ...defaultConfig, ...config };

    if (currentConfig.cancellationToken && currentConfig.cancellationToken.aborted)
        return;

    const element = document.getElementById(elementId);

    if (!element) {
        console.error("Element with the provided ID does not exist");
        return;
    }

    const key = `${elementId}-${currentConfig.bgColor}-${currentConfig.highLightColor}-${currentConfig.duration.toString().replace(/\./g, '0')}`;

    let elementStyle = cssElements[key];

    if (!elementStyle) {

        const elementCss = `
        @keyframes highlight-${key} {
            0% {
                background-color: ${currentConfig.highLightColor};
            }
    
            100% {
                background-color: ${currentConfig.bgColor};
            }
        }
    
        .refresh-${key} {
            animation: highlight-${key} ${currentConfig.duration}s;
        }

        #${elementId} {
            background-color: ${currentConfig.bgColor};
            transition: background-color 1s ease;
        }`
        mainStyle.innerHTML += elementCss;
        cssElements[key] = true;
    }



    return new Promise((resolve, reject) => {

        if (currentConfig.cancellationToken) {
            currentConfig.cancellationToken.addEventListener('abort', () => {
                if (timeoutRefs[key]) {
                    clearTimeout(timeoutRefs[key]);
                }
                element.classList.remove(`refresh-${key}`);
                reject();
            })
        }

        element.classList.remove(`refresh-${key}`);
        // Adiciona a classe em um próximo ciclo de renderização
        setTimeout(() => {
            element.classList.add(`refresh-${key}`);
        });

        // Remove a classe após 3 segundos
        timeoutRefs[key] = setTimeout(() => {
            element.classList.remove(`refresh-${key}`);
            resolve();
        }, currentConfig.duration * 1000);


    });
}