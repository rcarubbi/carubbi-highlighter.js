import { highlight } from './highlighter.js';

document.getElementById("buttonLabel1").addEventListener("click", () => { onClick('label1') })
document.getElementById("buttonLabel2").addEventListener("click", () => { onClick('label2') })
document.getElementById("buttonLabel3").addEventListener("click", () => { onClick('label3') })
document.getElementById("buttonCell1").addEventListener("click", () => { onClick('cell1') })
document.getElementById("buttonCell2").addEventListener("click", () => { onClick('cell2') })

async function onClick(target) {
    switch (target) {
        case "label1":
            await highlight(target, [
                { duration: 2, backgroundColor: 'red' },
                { duration: 1, backgroundColor: 'orange', inTime: 1 },
                { duration: .5, backgroundColor: 'green', inTime: 99 },
            ]);
            break;
        case "label2":
            await highlight(target, [{ duration: 2, backgroundColor: 'red' }]);
            break;
        case "label3":
            await highlight(target, [{ duration: 2, backgroundColor: 'green', inTime: 90 }]);
            break;
        case "cell1":
            await highlight(target, [{ duration: 2, backgroundColor: 'orange', inTime: 10 }]);
            break;
        case "cell2":
            await highlight(target, [{ duration: .5, backgroundColor: 'blue' }, { duration: .5, backgroundColor: 'blue' }]);
            break;
    }
}
