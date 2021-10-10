let seasonMagnetButton, seasonMagnetImg, episodeMagnetButton;

const magnetdl = query => {
    query = encodeURI(query).replace(/%20/g, '+');
    return `https://magnetdl.proxyninja.org/search/?q=${query}&m`;
}

const handleSeasonClick = async (name, list) => {
    if (document.querySelector('.item_season.active')) {
        while (!document.querySelector('.item_episode')) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }

        for (let episode of list.querySelectorAll('.item_episode')) {
            episodeMagnetButton.href = magnetdl(`${name} ${episode.id}`);
            episode.querySelector('.actions').append(episodeMagnetButton.cloneNode(true));
        }
    }
}

const handleFastForward = async serie => {
    if (serie.querySelector('.ffed')) {
        while (!document.querySelector('.episodes_list')) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
    }

    let list = document.querySelector('.episodes_list');
    if (!list) return;

    let name = serie.querySelector('strong').innerText;
    for (let season of list.querySelectorAll('.item_season')) {
        let n = parseInt(season.id.slice(1));
        seasonMagnetButton.href = magnetdl(`${name} ${n < 10 ? `s0${n}` : `s${n}`}`);
        season.append(seasonMagnetButton.cloneNode(true));
        season.querySelector('[onclick]')
            .addEventListener('click', () => { handleSeasonClick(name, list) });
    }

    handleSeasonClick(name, list);
}

(() => {
    seasonMagnetButton = document.createElement('a');
    seasonMagnetImg = document.createElement('img');
    seasonMagnetButton.href = '#';
    seasonMagnetButton.target = '_blank';
    seasonMagnetImg.src = 'https://magnetdl.proxyninja.org/img/m.gif';
    seasonMagnetButton.appendChild(seasonMagnetImg);
    episodeMagnetButton = seasonMagnetButton.cloneNode(true);
    seasonMagnetButton.classList.add('season-magnet-btn');
    episodeMagnetButton.classList.add('episode-magnet-btn');

    let uri = window.location.pathname.split('/');
    if ('shows' !== uri[uri.length - 1]) return;

    for (let serie of document.querySelector('#member_shows').children) {
        serie.querySelector('[class="fastforward actionButton"]')
            .addEventListener('click', () => { handleFastForward(serie) });
    }
})();
