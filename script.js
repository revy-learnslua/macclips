
const bannedNames = [
    'hitler', 'epstien', 'epstein', 'diddy', 'rape', 'raped', 'rapist',
    'nazi', 'fuckhitler', 'heilhitler', 'adolf', 'pedo', 'pedophile'
];

function containsBannedName(username) {
    const lowerUser = username.toLowerCase();
    return bannedNames.some(banned => lowerUser.includes(banned));
}


let progress = 0;
const loadingInterval = setInterval(() => {
    progress += Math.random() * 5 + 2;
    if (progress >= 100) {
        progress = 100;
        clearInterval(loadingInterval);
        document.getElementById('loadingScreen').style.opacity = '0';
        setTimeout(() => {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
        }, 1000);
    }
    document.getElementById('loadingBar').style.width = progress + '%';
    document.getElementById('loadingPercent').innerText = Math.floor(progress) + '%';
}, Math.random() * 300 + 200);


function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}
createStars();


let currentUser = localStorage.getItem('macclips_user') || null;
let clips = JSON.parse(localStorage.getItem('macclips_clips')) || [];


const botPosts = [
    "🎮 Check out this insane gameplay clip! #gaming",
    "🔥 This TikTok trend is going viral!",
    "😱 Can't believe what happened in this clip!",
    "🎵 Best music moment caught on camera!",
    "🐱 Cute animal clip of the day!",
    "🤣 This funny moment will make your day!",
    "⚡ Epic fail compilation incoming!",
    "💪 Most satisfying clip you'll watch today!"
];

function addBotClip() {
    const randomPost = botPosts[Math.floor(Math.random() * botPosts.length)];
    const newClip = {
        id: Date.now(),
        username: '🤖 Server Bot',
        title: 'Auto-Fetched Clip',
        content: randomPost + ' (Auto-posted from TikTok/YouTube)',
        image: null,
        timestamp: new Date().toISOString(),
        isBot: true
    };
    clips.unshift(newClip);
    localStorage.setItem('macclips_clips', JSON.stringify(clips));
    renderClips();
}


setInterval(addBotClip, 30000);


function signUp() {
    const email = document.getElementById('loginEmail').value;
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !username || !password) {
        alert('Please fill all fields');
        return;
    }
    
    if (username.length < 3 || username.length > 20) {
        alert('Username must be between 3 and 20 characters');
        return;
    }
    
    if (containsBannedName(username)) {
        alert('❌ PERMANENT BAN: This username contains forbidden words. You are permanently banned from MacClips.');
        localStorage.setItem('macclips_banned', username);
        return;
    }
    
    
    if (localStorage.getItem('macclips_banned')) {
        alert('You are permanently banned from MacClips.');
        return;
    }
    
    currentUser = username;
    localStorage.setItem('macclips_user', username);
    
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('userInfo').style.display = 'block';
    document.getElementById('currentUsername').innerText = username;
    
    alert('Welcome to MacClips, ' + username + '!');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('macclips_user');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
}

function uploadClip() {
    if (!currentUser) {
        alert('Please create an account first!');
        showSection('account');
        return;
    }
    
    if (localStorage.getItem('macclips_banned')) {
        alert('You are banned from uploading.');
        return;
    }
    
    const title = document.getElementById('clipTitle').value;
    const content = document.getElementById('clipContent').value;
    const imageFile = document.getElementById('clipImage').files[0];
    
    if (!title || !content) {
        alert('Please add a title and content!');
        return;
    }
    
    
    const harmfulWords = ['kill', 'murder', 'suicide', 'gore', 'blood', 'corpse'];
    const lowerContent = content.toLowerCase();
    if (harmfulWords.some(word => lowerContent.includes(word))) {
        alert('This clip contains harmful content and cannot be posted.');
        return;
    }
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            saveClip(title, content, e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveClip(title, content, null);
    }
}

function saveClip(title, content, imageData) {
    const newClip = {
        id: Date.now(),
        username: currentUser,
        title: title,
        content: content,
        image: imageData,
        timestamp: new Date().toISOString(),
        isBot: false
    };
    
    clips.unshift(newClip);
    localStorage.setItem('macclips_clips', JSON.stringify(clips));
    
    document.getElementById('clipTitle').value = '';
    document.getElementById('clipContent').value = '';
    document.getElementById('clipImage').value = '';
    
    alert('Clip posted!');
    showSection('mainpage');
    renderClips();
}

function renderClips() {
    const container = document.getElementById('clipsContainer');
    if (!container) return;
    
    if (clips.length === 0) {
        container.innerHTML = '<p style="color: white; text-align: center;">No clips yet. Be the first to post!</p>';
        return;
    }
    
    container.innerHTML = clips.map(clip => `
        <div class="clip-card">
            <div class="clip-username">${clip.isBot ? '🤖 ' : '👤 '}${escapeHtml(clip.username)}</div>
            <div class="clip-title">${escapeHtml(clip.title)}</div>
            <div class="clip-content">${escapeHtml(clip.content)}</div>
            ${clip.image ? `<img src="${clip.image}" class="clip-image" alt="Clip image">` : ''}
            <div class="clip-time">${new Date(clip.timestamp).toLocaleString()}</div>
        </div>
    `).join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    if (sectionId === 'mainpage') {
        renderClips();
    }
}


window.onload = function() {
    if (currentUser && !localStorage.getItem('macclips_banned')) {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('currentUsername').innerText = currentUser;
    }
    renderClips();
};
