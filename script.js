let posts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadTheme();
    if (posts.length === 0) {
        addSamplePost();
    }
    renderPosts();
});

// Theme
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.querySelector('.theme-icon').textContent = newTheme === 'dark' ? '☀️' : '🌙';
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.querySelector('.theme-icon').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

// Sample post
function addSamplePost() {
    const samplePost = {
        id: Date.now(),
        title: 'Welcome to My Blog',
        content: `# Welcome to My Blog

Hey there! I'm @nitinya9av and this is my personal blog where I share my thoughts, projects, and development journey.

## What You'll Find Here

- **Development Projects**: Updates on games and apps I'm building
- **Learning Notes**: Things I discover while coding
- **Random Thoughts**: Whatever's on my mind

## Current Project: Stickman Archer Game

I'm currently working on a physics-based archery game using HTML5 Canvas and JavaScript.

### Features I've Built:
- **Arrow Physics**: Realistic gravity and air resistance
- **Multiple Game Modes**: Classic, Moving Targets, Windy Day
- **Mobile Support**: Touch controls with haptic feedback
- **Responsive Design**: Works on all devices

### Code Example

\`\`\`javascript
function shootArrow(velocity, angle) {
    const arrow = new Arrow(x, y, velocity, angle);
    arrows.push(arrow);
    
    // Apply physics
    arrow.vx = velocity * Math.cos(angle);
    arrow.vy = velocity * Math.sin(angle);
}
\`\`\`

## What's Next

Planning to add:
- Sound effects and music
- Particle systems for visual polish
- Achievement system
- Leaderboards

Thanks for stopping by! Feel free to follow my journey as I build cool stuff. 🚀`,
        date: new Date().toISOString()
    };
    
    posts.push(samplePost);
    savePosts();
}

// Navigation
function showPostsList() {
    document.getElementById('post-view').classList.add('hidden');
    document.getElementById('posts-list').classList.remove('hidden');
}

function showPost(postId) {
    const post = posts.find(p => p.id == postId);
    if (!post) return;
    
    document.getElementById('posts-list').classList.add('hidden');
    document.getElementById('post-view').classList.remove('hidden');
    
    document.getElementById('post-display').innerHTML = `
        <div class="post-content">
            <h1>${escapeHtml(post.title)}</h1>
            <div class="post-date" style="margin-bottom: 40px; color: var(--text-tertiary); font-size: 14px;">
                ${formatDate(post.date)}
            </div>
            ${parseMarkdown(post.content)}
        </div>
    `;
}

// Render posts
function renderPosts() {
    const postsList = document.getElementById('posts-list');
    
    if (posts.length === 0) {
        postsList.innerHTML = `
            <div class="empty-state">
                <h3>No posts yet</h3>
                <p>Nothing to see here yet</p>
            </div>
        `;
        return;
    }
    
    postsList.innerHTML = posts.map(post => `
        <div class="post-item" onclick="showPost(${post.id})">
            <div class="post-title">${escapeHtml(post.title)}</div>
            <div class="post-preview">${getPreview(post.content)}</div>
            <div class="post-date">${formatDate(post.date)}</div>
        </div>
    `).join('');
}

// Utilities
function getPreview(content, maxLength = 120) {
    const plainText = content
        .replace(/#{1,6}\s+/g, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/```[\s\S]*?```/g, '[code]')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\n+/g, ' ')
        .trim();
    
    return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + '...';
}

function parseMarkdown(text) {
    return text
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
        .replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/^(?!<[hul])/gm, '<p>')
        .replace(/(?<!>)$/gm, '</p>')
        .replace(/<p><\/p>/g, '')
        .replace(/<p>(<[hul])/g, '$1')
        .replace(/(<\/[hul]>)<\/p>/g, '$1');
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Storage
function savePosts() {
    localStorage.setItem('blog-posts', JSON.stringify(posts));
}

function loadPosts() {
    const saved = localStorage.getItem('blog-posts');
    if (saved) {
        posts = JSON.parse(saved);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !document.getElementById('post-view').classList.contains('hidden')) {
        showPostsList();
    }
});
