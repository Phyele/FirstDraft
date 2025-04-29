const draft = document.getElementById('draft');
const currentParagraph = document.getElementById('current-paragraph');
const input = document.getElementById('input');

window.onload = function() {
    // Check font
    const preferredFont = localStorage.getItem('font');
    if (preferredFont) {
        document.querySelector("html").setAttribute("data-font", preferredFont);
    } else {
        localStorage.setItem('font', 'serif');
    }
    // Check theme
    const preferredTheme = localStorage.getItem('theme');
    if (preferredTheme) {
        document.querySelector("html").setAttribute("data-theme", preferredTheme);
    } else {
        localStorage.setItem('theme', 'light');
    }
    // Check saved paragraphs
    const savedParagraphs = localStorage.getItem('savedParagraphs');
    if (savedParagraphs) {
        const oldParagraphs = savedParagraphs.split('|');
        oldParagraphs.forEach(paragraph => {
            const oldParagraph = document.createElement("p");
            oldParagraph.textContent = paragraph;
            draft.insertBefore(oldParagraph, currentParagraph); 
        });
    }
    // Check current paragraph
    const savedCurrentParagraph = localStorage.getItem('savedCurrentParagraph');
    if (savedCurrentParagraph) {
        currentParagraph.prepend(savedCurrentParagraph);
    }
};

/*
------------------------------------------------------------
Menu
------------------------------------------------------------
*/

function toggleFont() {
    const currentFont = document.querySelector("html").getAttribute("data-font");
    switch (currentFont) {
        case "serif":
            setHtmlAttributeAndLocalStorage('font', 'sans');
            break;
        case "sans":
            setHtmlAttributeAndLocalStorage('font', 'serif');
            break;
    }
}

function toggleTheme() {
    const currentTheme = document.querySelector("html").getAttribute("data-theme");
    switch (currentTheme) {
        case "light":
            setHtmlAttributeAndLocalStorage('theme', 'dark');
            break;
        case "dark":
            setHtmlAttributeAndLocalStorage('theme', 'light');
            break;
    }
}

function setHtmlAttributeAndLocalStorage(key, value) {
    document.documentElement.setAttribute('data-' + key, value);
    localStorage.setItem(key, value);
}

function clearPage() {
    if (confirm("Are you sure you want to clear the page? You'll lose your current draft.")) {
        localStorage.removeItem('savedParagraphs');
        localStorage.removeItem('savedCurrentParagraph');
        location.reload();
    }
  }

function downloadContent() {
    var content = '';
    const savedParagraphs = localStorage.getItem('savedParagraphs');
    if (savedParagraphs) {
        const oldParagraphs = savedParagraphs.split('|');
        oldParagraphs.forEach(paragraph => {
            content += paragraph + "\n";
        });
    }
    const savedCurrentParagraph = localStorage.getItem('savedCurrentParagraph');
    if (savedCurrentParagraph) {
        content += savedCurrentParagraph;
    }
    var blob = new Blob([content], { type: 'text/plain' });
    var link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "draft.txt";
    link.click();
}

/*
------------------------------------------------------------
Editor
------------------------------------------------------------
*/

// Space
input.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        event.preventDefault();
        freezeWord();
    }
});

// Enter
input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        freezeWord();
        if (localStorage.getItem('savedParagraphs') == null) {
            localStorage.setItem('savedParagraphs', localStorage.getItem('savedCurrentParagraph').trim() + '|');
        } else {
            localStorage.setItem('savedParagraphs', localStorage.getItem('savedParagraphs') + localStorage.getItem('savedCurrentParagraph').trim() + '|');
        }
        const newParagraph = document.createElement("p");
        newParagraph.textContent = localStorage.getItem('savedCurrentParagraph').trim();
        draft.insertBefore(newParagraph, currentParagraph);
        cleanCurrentParagraph();
    }
});

function freezeWord() {
    const bufferParagraph = currentParagraph.textContent;
    cleanCurrentParagraph();
    localStorage.setItem('savedCurrentParagraph', bufferParagraph);
    currentParagraph.prepend(localStorage.getItem('savedCurrentParagraph') + ' ');
}

function cleanCurrentParagraph() {
    currentParagraph.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.remove();
        }
    });
    localStorage.setItem('savedCurrentParagraph', '');
    input.textContent = '';
    input.focus();
}

// Keep focus on input
input.addEventListener('blur', (e) => {
    setTimeout(() => {
        input.focus();
    }, 0);
});