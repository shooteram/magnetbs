let seasonMagnetButton, episodeMagnetButton;
const createMagnetButtons = () => {
    seasonMagnetButton = document.createElement('a');
    seasonMagnetButton.href = '#';
    seasonMagnetButton.target = '_blank';

    let seasonMagnetImg = document.createElement('img');
    seasonMagnetImg.src = 'https://magnetdl.proxyninja.org/img/m.gif';
    seasonMagnetButton.appendChild(seasonMagnetImg);

    episodeMagnetButton = seasonMagnetButton.cloneNode(true);
    seasonMagnetButton.classList.add('season-magnet-btn');
    episodeMagnetButton.classList.add('episode-magnet-btn');
}

const seasonIdRegex = new RegExp(/^s[0-9]+$/);
const formatSeason = id => {
    if (!seasonIdRegex.test(id)) {
        throw new Error(`season id "${id}" is not written in a handled format`);
    }

    let seasonNumber;
    try {
        seasonNumber = parseInt(id.slice(1));
    } catch (e) {
        throw new Error(`could not parse season number from season id "${id}"`);
    }

    return seasonNumber < 10 ? `s0${seasonNumber}` : `s${seasonNumber}`;
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
        let query = `${name} ${formatSeason(season.id)}`;
        seasonMagnetButton.href = `https://magnetdl.proxyninja.org/search/?q=${encodeURI(query).replace(/%20/g, '+')}&m`;
        season.append(seasonMagnetButton.cloneNode(true));
        season.querySelector('[onclick]').addEventListener('click', () => { handleSeasonClick(name, list) });
    }

    handleSeasonClick(name, list);
}

const handleSeasonClick = async (name, list) => {
    if (document.querySelector('.item_season.active')) {
        while (!document.querySelector('.item_episode')) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }

        for (let episode of list.querySelectorAll('.item_episode')) {
            let query = `${name} ${episode.id}`;
            episodeMagnetButton.href = `https://magnetdl.proxyninja.org/search/?q=${encodeURI(query).replace(/%20/g, '+')}&m`;
            episode.querySelector('.actions').append(episodeMagnetButton.cloneNode(true));
        }
    }
}

(async () => {
    createMagnetButtons();

    for (let serie of document.querySelector('#member_shows').children) {
        serie.querySelector('[class="fastforward actionButton"]').addEventListener('click', () => {
            handleFastForward(serie);
        });
    }
})();
