const storiesContainer = document.getElementById('stories');
const fileInput = document.getElementById('fileInput');
const viewer = document.getElementById('viewer');
const viewerImg = document.getElementById('viewerImg');

const DAY = 24 * 60 * 60 * 1000;

function getStories() {
    return JSON.parse(localStorage.getItem('stories')) || [];
}

function saveStories(stories) {
    localStorage.setItem('stories', JSON.stringify(stories));
}

function cleanExpiredStories() {
    const now = Date.now();
    const validStories = getStories().filter(s => now - s.time < DAY);
    saveStories(validStories);
}

function renderStories() {
    cleanExpiredStories();
    storiesContainer.innerHTML = '';

    const addBtn = document.createElement('div');
    addBtn.className = 'add-story';
    addBtn.textContent = '+';
    addBtn.onclick = () => fileInput.click();
    storiesContainer.appendChild(addBtn);

    const stories = getStories();

    stories.forEach((story, index) => {
        const div = document.createElement('div');
        div.className = 'story';
        const img = document.createElement('img');
        img.src = story.image;
        div.appendChild(img);

        div.onclick = () => openStory(index);
        storiesContainer.appendChild(div);
    });
}

function openStory(index) {
    const stories = getStories();
    viewerImg.src = stories[index].image;
    viewer.style.display = 'flex';
}

viewer.onclick = () => viewer.style.display = 'none';

fileInput.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const stories = getStories();
        stories.push({
            image: reader.result,
            time: Date.now()
        });
        saveStories(stories);
        renderStories();
    };
    reader.readAsDataURL(file);
    fileInput.value = '';
};

renderStories();