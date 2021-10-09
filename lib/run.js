let seasonMagnetButton;
const createSeasonMagnetButton = () => {
    seasonMagnetButton = document.createElement('a');
    seasonMagnetButton.classList.add('season-magnet-btn');
    seasonMagnetButton.href = '#';
    seasonMagnetButton.target = '_blank';

    let seasonMagnetImg = document.createElement('img');
    seasonMagnetImg.src = 'https://magnetdl.proxyninja.org/img/m.gif';
    seasonMagnetButton.appendChild(seasonMagnetImg);
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

const onFastForward = async serie => {
    if (serie.querySelector('.ffed')) {
        while (!document.querySelector('.episodes_list')) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
    }

    let list = document.querySelector('.episodes_list');
    if (!list) return;

    let name = serie.querySelector('strong').innerText;
    for (let season of list.querySelectorAll('.green')) {
        let query = `${name} ${formatSeason(season.id)}`;
        seasonMagnetButton.href = `https://magnetdl.proxyninja.org/search/?q=${encodeURI(query)}&m`;
        season.append(seasonMagnetButton.cloneNode(true));
    }
}

(async () => {
    createSeasonMagnetButton();

    for (let serie of document.querySelector('#member_shows').children) {
        serie.querySelector('[class="fastforward actionButton"]').addEventListener('click', () => {
            onFastForward(serie);
        });
    }
})();
