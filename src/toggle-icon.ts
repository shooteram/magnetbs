let media = window.matchMedia("(prefers-color-scheme: dark)");
media.addEventListener('change', e => { toggle(e.target) });

const toggle = media => {
    chrome.runtime.sendMessage({ accent: media.matches ? 'light' : 'dark' });
}

toggle(media);
