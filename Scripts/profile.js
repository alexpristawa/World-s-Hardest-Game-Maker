
profileElements.sectionHolder.addEventListener('mousemove', (event) => {
    let type = event.target.dataset.type;
    if(event.target.classList.contains('sectionHolder')) {
        profileElements.listHolder.style.display = 'none';
        profileDiv.dataset.type = 'none';
    }
    if(type == 'Levels' && profileDiv.dataset.type != 'Levels') {
        profileDiv.dataset.type = 'Levels';
        profileElements.listHolder.innerHTML = '';
        profileElements.listHolder.style.display = 'flex';
        for(let i = 0; i < userInformation.levels.length; i++) {
            let div = document.createElement('div');
            div.classList.add('levelName');
            div.innerHTML = userInformation.levels[i].name;

            div.addEventListener('click', () => {
                let obj = userInformation.levels[i];
                info = JSON.parse(obj.info);
                let newGroups = info.groups;
                delete info.groups;
                let newEntities = info;
                restoreBoard(newEntities, newGroups);
                document.querySelector('#profileButton > input').checked = false;
            });

            profileElements.listHolder.appendChild(div);
        }
    }
});

profileDiv.addEventListener('mouseout', (event) => {
    if(event.relatedTarget.closest('#profileDiv') == null && event.relatedTarget.id != 'profileDiv') {
        profileElements.listHolder.style.display = 'none';
        profileDiv.dataset.type = 'none';
    }
});