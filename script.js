
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
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                const mainContent = document.getElementById('mainContent');
                if (mainContent) {
                    mainContent.style.display = 'block';
                }
                renderClips(); 
            }, 1000);
        }
    }
    const loadingBar = document.getElementById('loadingBar');
    const loadingPercent = document.getElementById('loadingPercent');
    if (loadingBar) loadingBar.style.width = progress + '%';
    if (loadingPercent) loadingPercent.innerText = Math.floor(progress) + '%';
}, Math.random() * 300 + 200);


function createStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.backgroundColor = 'white';
        star.style.position = 'absolute';
        star.style.borderRadius = '50%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
    }
}
createStars();


let currentUser = localStorage.getItem('macclips_user') || null;
let clips = JSON.parse(localStorage.getItem('macclips_clips')) || [];


if (clips.length === 0) {
    clips = [
        {
            id: Date.now(),
            username: '🤖 Server Bot',
            title: 'Welcome to MacClips! 🎉',
            content: 'This is your first clip! Create an account and share your moments. Remember: SFW images only, no gore or harmful content.',
            image: null,
            timestamp: new Date().toISOString(),
            isBot: true
        },
        {
            id: Date.now() + 1,
            username: '🤖 Server Bot',
            title: 'How to Use MacClips',
            content: '1. Create an account\n2. Upload your clips\n3. Share with the world!\n\nBanned usernames will be permanently banned.',
            image: null,
            timestamp: new Date(Date.now() - 60000).toISOString(),
            isBot: true
        }
    ];
    localStorage.setItem('macclips_clips', JSON.stringify(clips));
}


const botPosts = [
    "🎮 Check out this insane gameplay clip from TikTok! #gaming",
    "🔥 This YouTube clip is going viral right now!",
    "😱 Can't believe what happened in this Twitch stream!",
    "🎵 Best music moment caught on camera from TikTok!",
    "🐱 Cute animal clip of the day! 🥰",
    "🤣 This funny moment will make your day!",
    "⚡ Epic fail compilation from YouTube!",
    "💪 Most satisfying clip you'll watch today!",
    "🎬 New movie trailer just dropped!",
    "🏆 Pro player highlights - insane skills!"
];

function addBotClip() {
    const randomPost = botPosts[Math.floor(Math.random() * botPosts.length)];
    const newClip = {
        id: Date.now(),
        username: '🤖 Server Bot',
        title: '🎥 Auto-Fetched Clip',
        content: randomPost + ' (Auto-posted from social media)',
        image: null,
        timestamp: new Date().toISOString(),
        isBot: true
    };
    clips.unshift(newClip);
    
    if (clips.length > 50) clips = clips.slice(0, 50);
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
    
    alert('Welcome to MacClips, ' + username + '! You can now post clips.');
    showSection('mainpage');
    renderClips();
}

function logout() {
    currentUser = null;
    localStorage.removeItem('macclips_user');
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginUsername').value = '';
    document.getElementById('loginPassword').value = '';
    alert('Logged out successfully!');
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
    
    const title = document.getElementById('clipTitle').value.trim();
    const content = document.getElementById('clipContent').value.trim();
    const imageFile = document.getElementById('clipImage').files[0];
    
    if (!title || !content) {
        alert('Please add a title and content!');
        return;
    }
    
    if (title.length > 100) {
        alert('Title is too long! Max 100 characters.');
        return;
    }
    
    if (content.length > 2000) {
        alert('Content is too long! Max 2000 characters.');
        return;
    }
    
    
    const harmfulWords = ['kill', 'murder', 'suicide', 'gore', 'blood', 'corpse', 'snuff', 'death threat'];
    const lowerContent = content.toLowerCase();
    if (harmfulWords.some(word => lowerContent.includes(word))) {
        alert('❌ This clip contains harmful content and cannot be posted.');
        return;
    }
    
    if (imageFile) {
        if (!imageFile.type.startsWith('image/')) {
            alert('Only image files are allowed!');
            return;
        }
        if (imageFile.size > 5 * 1024 * 1024) {
            alert('Image too large! Max 5MB.');
            return;
        }
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
    
    if (clips.length > 50) clips = clips.slice(0, 50);
    localStorage.setItem('macclips_clips', JSON.stringify(clips));
    
    document.getElementById('clipTitle').value = '';
    document.getElementById('clipContent').value = '';
    document.getElementById('clipImage').value = '';
    
    alert('✅ Clip posted successfully!');
    showSection('mainpage');
    renderClips();
}

function renderClips() {
    const container = document.getElementById('clipsContainer');
    if (!container) {
        console.log('Container not found!');
        return;
    }
    
    
    clips = JSON.parse(localStorage.getItem('macclips_clips')) || [];
    
    if (clips.length === 0) {
        container.innerHTML = '<div style="background: rgba(20,20,50,0.7); backdrop-filter: blur(10px); border-radius: 16px; padding: 40px; text-align: center;"><p style="color: white;">No clips yet. Be the first to post!</p></div>';
        return;
    }
    
    container.innerHTML = clips.map(clip => `
        <div style="background: rgba(20,20,50,0.7); backdrop-filter: blur(10px); border-radius: 16px; padding: 20px; border-left: 4px solid #ff6644; transition: transform 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div style="color: #ff8844; font-weight: bold;">${clip.isBot ? '🤖 ' : '👤 '}${escapeHtml(clip.username)}</div>
                <div style="color: #666; font-size: 12px;">${new Date(clip.timestamp).toLocaleString()}</div>
            </div>
            <div style="color: white; font-size: 18px; font-weight: 600; margin: 10px 0;">${escapeHtml(clip.title)}</div>
            <div style="color: #ccc; margin: 10px 0; white-space: pre-wrap;">${escapeHtml(clip.content)}</div>
            ${clip.image ? `<img src="${clip.image}" style="max-width: 100%; border-radius: 8px; margin-top: 10px; max-height: 400px; object-fit: contain;" alt="Clip image">` : ''}
        </div>
    `).join('');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
    if (sectionId === 'mainpage') {
        renderClips();
    }
}


window.onload = function() {
    console.log('Page loaded!');
    
    
    if (currentUser && !localStorage.getItem('macclips_banned')) {
        const loginForm = document.getElementById('loginForm');
        const userInfo = document.getElementById('userInfo');
        const currentUsernameSpan = document.getElementById('currentUsername');
        if (loginForm) loginForm.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (currentUsernameSpan) currentUsernameSpan.innerText = currentUser;
    }
    
    
    setTimeout(() => {
        renderClips();
    }, 100);
};

// Add CSS for animations if not in style.css
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.05); opacity: 1; }
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    @keyframes glow {
        0%, 100% { text-shadow: 0 0 20px #ff4400, 0 0 40px #ff6600; }
        50% { text-shadow: 0 0 40px #ff6600, 0 0 60px #ff8800; }
    }
    @keyframes twinkle {
        0%, 100% { opacity: 0.3; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);
