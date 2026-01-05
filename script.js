// ==================== GLOBAL STATE & CONFIGURATION ====================
const CONFIG = {
    ALLOWED_EMAIL_DOMAIN: '@iitg.ac.in',
    OTP_LENGTH: 6,
    OTP_EXPIRY_TIME: 300, // 5 minutes in seconds
    MIN_PHOTOS: 3,
    MAX_PHOTOS: 6,
    SUPER_LIKES_PER_DAY: 5,
    MIN_INTERESTS: 3,
    BIO_MAX_LENGTH: 500
};

let currentUser = {
    id: null,
    email: '',
    name: '',
    gender: '',
    dob: '',
    age: 0,
    phone: '',
    discipline: '',
    year: '',
    branch: '',
    bio: '',
    interests: [],
    studyTime: '',
    lookingFor: [],
    photos: [],
    mainPhoto: null,
    verified: false,
    createdAt: null
};

let appState = {
    currentPage: 'loginPage',
    currentView: 'discover',
    generatedOTP: '',
    otpExpiryTime: null,
    filters: {
        distance: 10,
        ageMin: 18,
        ageMax: 30,
        discipline: '',
        branch: '',
        year: '',
        gender: 'Everyone'
    }
};

let students = [
    {
        id: 1,
        name: 'Priya Sharma',
        email: 'p.sharma@iitg.ac.in',
        gender: 'Female',
        age: 20,
        discipline: 'BTech',
        branch: 'CSE',
        year: '3rd Year',
        bio: 'Passionate about AI/ML and competitive coding. Looking for study partners for GATE prep. Love exploring campus and trying new cafeteria food!',
        interests: ['Coding', 'Math', 'GATE', 'Projects', 'Reading'],
        studyTime: 'Evening',
        lookingFor: ['Study Partner', 'Friends'],
        photos: [
            'https://avatar.iran.liara.run/public/girl?username=priya1',
            'https://avatar.iran.liara.run/public/girl?username=priya2',
            'https://avatar.iran.liara.run/public/girl?username=priya3'
        ],
        mainPhoto: 'https://avatar.iran.liara.run/public/girl?username=priya1',
        distance: 0.5,
        online: true,
        verified: true
    },
    {
        id: 2,
        name: 'Rahul Verma',
        email: 'r.verma@iitg.ac.in',
        gender: 'Male',
        age: 21,
        discipline: 'BTech',
        branch: 'ME',
        year: '3rd Year',
        bio: 'Mechanical enthusiast. Love working on robotics projects. Gym freak and photography lover. Let\'s grab coffee sometime!',
        interests: ['Projects', 'Sports', 'Photography', 'Research'],
        studyTime: 'Morning',
        lookingFor: ['Friends', 'Project Team'],
        photos: [
            'https://avatar.iran.liara.run/public/boy?username=rahul1',
            'https://avatar.iran.liara.run/public/boy?username=rahul2',
            'https://avatar.iran.liara.run/public/boy?username=rahul3'
        ],
        mainPhoto: 'https://avatar.iran.liara.run/public/boy?username=rahul1',
        distance: 0.8,
        online: false,
        verified: true
    },
    {
        id: 3,
        name: 'Anjali Singh',
        email: 'a.singh@iitg.ac.in',
        gender: 'Female',
        age: 22,
        discipline: 'MTech',
        branch: 'EEE',
        year: '2nd Year',
        bio: 'MTech student researching in power systems. Classical music enthusiast. Looking for serious study partners and research collaborators.',
        interests: ['Research', 'Music', 'Reading', 'GATE'],
        studyTime: 'Night',
        lookingFor: ['Study Partner', 'Research Partner'],
        photos: [
            'https://avatar.iran.liara.run/public/girl?username=anjali1',
            'https://avatar.iran.liara.run/public/girl?username=anjali2',
            'https://avatar.iran.liara.run/public/girl?username=anjali3'
        ],
        mainPhoto: 'https://avatar.iran.liara.run/public/girl?username=anjali1',
        distance: 1.2,
        online: true,
        verified: true
    },
    {
        id: 4,
        name: 'Vikram Das',
        email: 'v.das@iitg.ac.in',
        gender: 'Male',
        age: 23,
        discipline: 'PhD',
        branch: 'CHE',
        year: '1st Year',
        bio: 'PhD scholar in Chemical Engineering. Love hiking and exploring Guwahati. Weekend coder and tech enthusiast.',
        interests: ['Research', 'Coding', 'Sports', 'Entrepreneurship'],
        studyTime: 'Flexible',
        lookingFor: ['Research Partner', 'Friends', 'Dating'],
        photos: [
            'https://avatar.iran.liara.run/public/boy?username=vikram1',
            'https://avatar.iran.liara.run/public/boy?username=vikram2',
            'https://avatar.iran.liara.run/public/boy?username=vikram3'
        ],
        mainPhoto: 'https://avatar.iran.liara.run/public/boy?username=vikram1',
        distance: 0.3,
        online: true,
        verified: true
    },
    {
        id: 5,
        name: 'Sonia Gill',
        email: 's.gill@iitg.ac.in',
        gender: 'Female',
        age: 19,
        discipline: 'BTech',
        branch: 'CE',
        year: '2nd Year',
        bio: 'Civil engineering student. Love art and design. Active in campus cultural activities. Looking to make new friends and study buddies.',
        interests: ['Art', 'Dance', 'Design', 'Projects'],
        studyTime: 'Afternoon',
        lookingFor: ['Friends', 'Study Partner'],
        photos: [
            'https://avatar.iran.liara.run/public/girl?username=sonia1',
            'https://avatar.iran.liara.run/public/girl?username=sonia2',
            'https://avatar.iran.liara.run/public/girl?username=sonia3'
        ],
        mainPhoto: 'https://avatar.iran.liara.run/public/girl?username=sonia1',
        distance: 0.6,
        online: false,
        verified: true
    }
];

let matches = [];
let likes = [];
let chatMessages = {};
let notifications = [];
let currentChatUserId = null;
let cardIndex = 0;
let swipeHistory = [];
let filteredStudents = [];
let superLikesLeft = CONFIG.SUPER_LIKES_PER_DAY;
let currentCardImageIndex = 0;

let stats = {
    profileViews: 0,
    totalMatches: 0,
    likesReceived: 0,
    swipesLeft: 0,
    swipesRight: 0
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 CampusSoul - IIT Guwahati Edition');
    console.log('📚 Initializing...');
    
    loadFromLocalStorage();
    initializeEventListeners();
    
    if (currentUser.id) {
        console.log('✅ User logged in:', currentUser.email);
        switchPage('mainWebsite');
        initializeMainApp();
    } else {
        console.log('👤 No user logged in');
        switchPage('loginPage');
    }
    
    console.log('✅ Initialization complete!');
});

function initializeEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', sendOTP);
    }
    
    // OTP form
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', verifyOTP);
    }
    
    // Registration form
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', completeRegistration);
        
        // Track all input changes for progress
        const inputs = regForm.querySelectorAll('input:not([type="file"]), select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateRegistrationProgress);
            input.addEventListener('change', updateRegistrationProgress);
        });
    }
    
    // Bio character counter
    const bioInput = document.getElementById('userBio');
    if (bioInput) {
        bioInput.addEventListener('input', function() {
            const count = this.value.length;
            document.getElementById('bioCharCount').textContent = count;
            if (count > CONFIG.BIO_MAX_LENGTH) {
                this.value = this.value.substring(0, CONFIG.BIO_MAX_LENGTH);
            }
        });
    }
    
    // Interest chips
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('interest-chip') ||
            e.target.classList.contains('time-chip') ||
            e.target.classList.contains('looking-chip')) {
            e.target.classList.toggle('selected');
            updateRegistrationProgress();
            
            // Update interest count
            if (e.target.classList.contains('interest-chip')) {
                const selected = document.querySelectorAll('.interest-chip.selected').length;
                document.getElementById('interestCount').textContent = 
                    `${selected} selected (minimum ${CONFIG.MIN_INTERESTS} required)`;
            }
        }
    });
    
    // Global search
    const globalSearch = document.getElementById('globalSearch');
    if (globalSearch) {
        globalSearch.addEventListener('input', function() {
            searchGlobally(this.value);
        });
    }
    
    console.log('✅ Event listeners initialized');
}

// ==================== PAGE MANAGEMENT ====================
function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        appState.currentPage = pageId;
        console.log('📄 Switched to page:', pageId);
    }
}

function switchView(viewName) {
    // Update sidebar menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    const activeMenuItem = document.querySelector(`[data-view="${viewName}"]`);
    if (activeMenuItem) {
        activeMenuItem.classList.add('active');
    }
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(viewName + 'View');
    if (targetView) {
        targetView.classList.add('active');
        appState.currentView = viewName;
        
        // Load view content
        if (viewName === 'discover') {
            loadDiscoverView();
        } else if (viewName === 'matches') {
            loadMatchesView();
        } else if (viewName === 'likes') {
            loadLikesView();
        } else if (viewName === 'profile') {
            loadMyProfile();
        } else if (viewName === 'messages') {
            loadMessagesView();
        }
        
        console.log('📱 Switched to view:', viewName);
    }
}

// ==================== LOGIN & OTP ====================
function sendOTP(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('emailInput');
    const email = emailInput.value.trim().toLowerCase();
    
    console.log('📧 Attempting login with:', email);
    
    // Validate IIT Guwahati email
    if (!email.endsWith(CONFIG.ALLOWED_EMAIL_DOMAIN)) {
        showToast(`Only ${CONFIG.ALLOWED_EMAIL_DOMAIN} emails are allowed!`, 'error');
        emailInput.focus();
        return;
    }
    
    // Generate OTP
    appState.generatedOTP = generateOTP();
    appState.otpExpiryTime = Date.now() + (CONFIG.OTP_EXPIRY_TIME * 1000);
    
    currentUser.email = email;
    
    console.log('🔐 OTP Generated:', appState.generatedOTP);
    console.log('⏰ OTP expires at:', new Date(appState.otpExpiryTime).toLocaleTimeString());
    
    // Update OTP page
    document.getElementById('otpEmailDisplay').textContent = email;
    
    // Switch to OTP page
    switchPage('otpPage');
    
    // Focus first OTP input
    setTimeout(() => {
        document.getElementById('otp1').focus();
    }, 300);
    
    // Start OTP timer
    startOTPTimer();
    
    // Show OTP in console for demo (remove in production)
    showToast(`Demo OTP: ${appState.generatedOTP}`, 'info');
}

function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

function startOTPTimer() {
    const timerElement = document.getElementById('otpTimer');
    if (!timerElement) return;
    
    const interval = setInterval(() => {
        const remaining = Math.max(0, Math.floor((appState.otpExpiryTime - Date.now()) / 1000));
        
        if (remaining <= 0) {
            clearInterval(interval);
            timerElement.textContent = 'OTP Expired! Please request a new one.';
            timerElement.style.color = 'var(--danger-color)';
        } else {
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            timerElement.textContent = `OTP expires in ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function moveToNext(current, nextId) {
    if (current.value.length === 1) {
        const nextInput = document.getElementById(nextId);
        if (nextInput) nextInput.focus();
    }
}

function moveToPrev(event, prevId) {
    if (event.key === 'Backspace' && event.target.value === '') {
        const prevInput = document.getElementById(prevId);
        if (prevInput) prevInput.focus();
    }
}

function verifyOTP(e) {
    e.preventDefault();
    
    const enteredOTP = 
        document.getElementById('otp1').value +
        document.getElementById('otp2').value +
        document.getElementById('otp3').value +
        document.getElementById('otp4').value +
        document.getElementById('otp5').value +
        document.getElementById('otp6').value;
    
    console.log('🔍 Verifying OTP:', enteredOTP);
    
    if (enteredOTP.length !== CONFIG.OTP_LENGTH) {
        showToast('Please enter complete OTP!', 'error');
        return;
    }
    
    // Check OTP expiry
    if (Date.now() > appState.otpExpiryTime) {
        showToast('OTP has expired! Please request a new one.', 'error');
        return;
    }
    
    if (enteredOTP === appState.generatedOTP) {
        console.log('✅ OTP verified successfully!');
        currentUser.verified = true;
        
        // Check if user already exists
        const existingUser = localStorage.getItem('campussoul_user_' + currentUser.email);
        if (existingUser) {
            currentUser = JSON.parse(existingUser);
            switchPage('mainWebsite');
            initializeMainApp();
            showToast('Welcome back! 🎉', 'success');
        } else {
            switchPage('registrationPage');
            showToast('Email verified! Complete your profile 📝', 'success');
        }
    } else {
        console.log('❌ Invalid OTP');
        showToast('Invalid OTP! Please try again.', 'error');
        
        // Clear inputs
        for (let i = 1; i <= 6; i++) {
            document.getElementById('otp' + i).value = '';
        }
        document.getElementById('otp1').focus();
    }
}

function resendOTP() {
    appState.generatedOTP = generateOTP();
    appState.otpExpiryTime = Date.now() + (CONFIG.OTP_EXPIRY_TIME * 1000);
    
    startOTPTimer();
    
    console.log('🔄 OTP Resent:', appState.generatedOTP);
    showToast(`New OTP sent! Demo: ${appState.generatedOTP}`, 'success');
}

function backToLogin() {
    switchPage('loginPage');
    
    // Clear OTP inputs
    for (let i = 1; i <= 6; i++) {
        const input = document.getElementById('otp' + i);
        if (input) input.value = '';
    }
}

// ==================== REGISTRATION ====================
function updateRegistrationProgress() {
    let totalFields = 10;
    let completedFields = 0;
    
    // Basic info (4 fields)
    if (document.getElementById('userName')?.value.trim()) completedFields++;
    if (document.getElementById('userGender')?.value) completedFields++;
    if (document.getElementById('userDOB')?.value) completedFields++;
    
    // Academic info (3 fields)
    if (document.getElementById('userDiscipline')?.value) completedFields++;
    if (document.getElementById('userYear')?.value) completedFields++;
    if (document.getElementById('userBranch')?.value) completedFields++;
    
    // About (1 field)
    if (document.getElementById('userBio')?.value.trim().length >= 20) completedFields++;
    
    // Interests (1 field - min 3)
    const selectedInterests = document.querySelectorAll('.interest-chip.selected').length;
    if (selectedInterests >= CONFIG.MIN_INTERESTS) completedFields++;
    
    // Study time (1 field)
    if (document.querySelector('.time-chip.selected')) completedFields++;
    
    // Looking for (1 field)
    if (document.querySelector('.looking-chip.selected')) completedFields++;
    
    // Photos handled separately in photo count
    
    const progress = Math.round((completedFields / totalFields) * 100);
    
    const progressBar = document.getElementById('regProgressBar');
    const progressText = document.getElementById('regProgressText');
    
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = progress + '% Complete';
}

function previewMainPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('mainPhotoPreview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Main Photo">`;
        preview.classList.add('has-image');
        
        currentUser.mainPhoto = e.target.result;
        if (!currentUser.photos.includes(e.target.result)) {
            currentUser.photos[0] = e.target.result;
        }
        
        updatePhotoCount();
    };
    reader.readAsDataURL(file);
}

function previewPhoto(event, photoNumber) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showToast('Please select an image file!', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const preview = document.getElementById('photo' + photoNumber + 'Preview');
        preview.innerHTML = `<img src="${e.target.result}" alt="Photo ${photoNumber}">`;
        preview.classList.add('has-image');
        
        currentUser.photos[photoNumber - 1] = e.target.result;
        updatePhotoCount();
    };
    reader.readAsDataURL(file);
}

function updatePhotoCount() {
    const uploadedPhotos = currentUser.photos.filter(p => p).length;
    const photoCountElement = document.getElementById('photoCount');
    if (photoCountElement) {
        photoCountElement.textContent = uploadedPhotos;
    }
}

function completeRegistration(e) {
    e.preventDefault();
    
    console.log('📝 Submitting registration...');
    
    // Collect basic info
    currentUser.name = document.getElementById('userName').value.trim();
    currentUser.gender = document.getElementById('userGender').value;
    currentUser.dob = document.getElementById('userDOB').value;
    currentUser.phone = document.getElementById('userPhone').value.trim();
    
    // Calculate age
    const today = new Date();
    const birthDate = new Date(currentUser.dob);
    currentUser.age = today.getFullYear() - birthDate.getFullYear();
    
    // Collect academic info
    currentUser.discipline = document.getElementById('userDiscipline').value;
    currentUser.year = document.getElementById('userYear').value;
    currentUser.branch = document.getElementById('userBranch').value;
    
    // Collect about info
    currentUser.bio = document.getElementById('userBio').value.trim();
    
    // Collect interests
    const selectedInterests = document.querySelectorAll('.interest-chip.selected');
    currentUser.interests = Array.from(selectedInterests).map(chip => chip.dataset.interest);
    
    // Study time
    const selectedTime = document.querySelector('.time-chip.selected');
    currentUser.studyTime = selectedTime ? selectedTime.dataset.time : 'Flexible';
    
    // Looking for
    const selectedLooking = document.querySelectorAll('.looking-chip.selected');
    currentUser.lookingFor = Array.from(selectedLooking).map(chip => chip.dataset.looking);
    
    // Validate
    if (currentUser.interests.length < CONFIG.MIN_INTERESTS) {
        showToast(`Please select at least ${CONFIG.MIN_INTERESTS} interests!`, 'error');
        return;
    }
    
    if (currentUser.lookingFor.length === 0) {
        showToast('Please select what you are looking for!', 'error');
        return;
    }
    
    if (currentUser.bio.length < 20) {
        showToast('Please write a bio with at least 20 characters!', 'error');
        return;
    }
    
    const uploadedPhotos = currentUser.photos.filter(p => p).length;
    if (uploadedPhotos < CONFIG.MIN_PHOTOS) {
        showToast(`Please upload at least ${CONFIG.MIN_PHOTOS} photos!`, 'error');
        return;
    }
    
    if (!currentUser.mainPhoto) {
        showToast('Please upload a main profile photo!', 'error');
        return;
    }
    
    // Generate user ID
    currentUser.id = Date.now();
    currentUser.createdAt = new Date();
    
    console.log('✅ Registration complete:', currentUser);
    
    // Save to localStorage
    saveToLocalStorage();
    
    // Switch to main app
    switchPage('mainWebsite');
    initializeMainApp();
    
    showToast('Profile created successfully! Welcome to CampusSoul! 🎉', 'success');
}

// ==================== MAIN APP INITIALIZATION ====================
function initializeMainApp() {
    // Set profile avatar
    const navAvatar = document.getElementById('navProfileAvatar');
    if (navAvatar && currentUser.mainPhoto) {
        navAvatar.src = currentUser.mainPhoto;
    }
    
    // Filter students (exclude self)
    filteredStudents = students.filter(s => s.email !== currentUser.email);
    
    // Apply filters
    applyCurrentFilters();
    
    // Load discover view
    loadDiscoverView();
    
    // Update stats
    updateStats();
    
    // Load online users
    loadOnlineUsers();
    
    // Update badges
    updateBadges();
    
    console.log('✅ Main app initialized');
}

function loadDiscoverView() {
    cardIndex = 0;
    loadCard();
}

// ==================== CARD SWIPE SYSTEM ====================
function loadCard() {
    const container = document.getElementById('cardStack');
    const matchScoreDisplay = document.getElementById('matchScoreDisplay');
    
    if (!container) return;
    
    container.innerHTML = '';
    if (matchScoreDisplay) matchScoreDisplay.innerHTML = '';
    
    if (cardIndex >= filteredStudents.length) {
        container.innerHTML = `
            <div style="text-align:center; padding:80px 30px; color:var(--text-secondary);">
                <i class="fas fa-check-circle" style="font-size:5rem; color:var(--success-color); margin-bottom:20px;"></i>
                <h3 style="color:var(--text-primary); margin-bottom:15px;">You've seen everyone!</h3>
                <p style="margin-bottom:25px;">Check back later for new students or adjust your filters.</p>
                <button onclick="resetFilters(); cardIndex=0; loadCard();" class="btn btn-primary">
                    <i class="fas fa-redo"></i> Reset Filters
                </button>
            </div>
        `;
        return;
    }
    
    const student = filteredStudents[cardIndex];
    const matchData = calculateMatchScore(student);
    
    console.log(`Loading card: ${student.name} - ${matchData.score}% match`);
    
    // Show match score
    if (matchScoreDisplay) {
        const color = matchData.score > 70 ? 'var(--success-color)' : 
                      matchData.score > 40 ? 'var(--warning-color)' : 'var(--danger-color)';
        matchScoreDisplay.innerHTML = `
            <span style="color: ${color}; text-shadow: 0 0 20px ${color};">
                ${matchData.score}% Match ✨
            </span>
        `;
    }
    
    const card = createCard(student, matchData);
    container.appendChild(card);
    
    currentCardImageIndex = 0;
    
    // Enable swipe
    enableCardSwipe(card, student);
    
    // Simulate profile view
    if (Math.random() > 0.7) {
        stats.profileViews++;
        updateStats();
    }
}

function createCard(student, matchData) {
    const card = document.createElement('div');
    card.className = 'profile-card';
    card.id = `card-${student.id}`;
    
    const verifiedBadge = student.verified ? ' <i class="fas fa-check-circle" style="color:var(--secondary-color);"></i>' : '';
    
    const interestTags = student.interests.slice(0, 5).map(i => 
        `<span class="tag">${i}</span>`
    ).join('');
    
    // Image dots for multiple photos
    const imageDots = student.photos.map((_, index) => 
        `<div class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></div>`
    ).join('');
    
    card.innerHTML = `
        <div class="profile-card-images">
            <img src="${student.photos[0]}" alt="${student.name}" id="cardImage-${student.id}">
            <div class="image-dots" id="imageDots-${student.id}">
                ${imageDots}
            </div>
        </div>
        <div class="card-info">
            <h2>${student.name}, ${student.age}${verifiedBadge}</h2>
            <p class="meta">${student.discipline} • ${student.branch} • ${student.year}</p>
            <p class="bio">${student.bio}</p>
            <div class="card-tags">
                ${interestTags}
                <span class="tag" style="border-color:var(--secondary-color); color:var(--secondary-color);">
                    <i class="fas fa-clock"></i> ${student.studyTime}
                </span>
            </div>
        </div>
    `;
    
    // Add click handlers for image navigation
    const cardImages = card.querySelector('.profile-card-images');
    cardImages.addEventListener('click', (e) => {
        const rect = cardImages.getBoundingClientRect();
        const x = e.clientX - rect.left;
        if (x < rect.width / 2) {
            previousCardImage(student.id, student.photos);
        } else {
            nextCardImage(student.id, student.photos);
        }
    });
    
    return card;
}

function nextCardImage(studentId, photos) {
    currentCardImageIndex = (currentCardImageIndex + 1) % photos.length;
    updateCardImage(studentId, photos);
}

function previousCardImage(studentId, photos) {
    currentCardImageIndex = (currentCardImageIndex - 1 + photos.length) % photos.length;
    updateCardImage(studentId, photos);
}

function updateCardImage(studentId, photos) {
    const img = document.getElementById(`cardImage-${studentId}`);
    const dots = document.querySelectorAll(`#imageDots-${studentId} .dot`);
    
    if (img) {
        img.src = photos[currentCardImageIndex];
    }
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentCardImageIndex);
    });
}

function enableCardSwipe(card, student) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    function handleStart(e) {
        isDragging = true;
        const touch = e.type.includes('mouse') ? e : e.touches[0];
        startX = touch.clientX;
        card.style.transition = 'none';
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        
        const touch = e.type.includes('mouse') ? e : e.touches[0];
        currentX = touch.clientX;
        
        const deltaX = currentX - startX;
        const rotate = deltaX * 0.1;
        
        card.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
        
        // Show visual feedback
        if (deltaX > 50) {
            card.style.borderColor = 'var(--success-color)';
        } else if (deltaX < -50) {
            card.style.borderColor = 'var(--danger-color)';
        } else {
            card.style.borderColor = 'var(--border-color)';
        }
    }
    
    function handleEnd() {
        if (!isDragging) return;
        isDragging = false;
        
        const deltaX = currentX - startX;
        
        if (Math.abs(deltaX) > 120) {
            if (deltaX > 0) {
                completeSwipe(card, student, 'right');
            } else {
                completeSwipe(card, student, 'left');
            }
        } else {
            card.style.transition = 'transform 0.3s ease';
            card.style.transform = '';
            card.style.borderColor = 'var(--border-color)';
        }
    }
    
    card.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    card.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
}

function completeSwipe(card, student, direction) {
    const moveX = direction === 'right' ? '150%' : '-150%';
    const rotate = direction === 'right' ? '30deg' : '-30deg';
    
    card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
    card.style.transform = `translateX(${moveX}) rotate(${rotate})`;
    card.style.opacity = '0';
    
    swipeHistory.push({ student, direction, index: cardIndex });
    
    if (direction === 'right') {
        stats.swipesRight++;
        addMatch(student, false);
    } else {
        stats.swipesLeft++;
    }
    
    cardIndex++;
    updateStats();
    saveToLocalStorage();
    
    setTimeout(() => loadCard(), 400);
}

function swipeLeft() {
    const card = document.querySelector('.profile-card');
    if (card && cardIndex < filteredStudents.length) {
        const student = filteredStudents[cardIndex];
        completeSwipe(card, student, 'left');
    }
}

function swipeRight() {
    const card = document.querySelector('.profile-card');
    if (card && cardIndex < filteredStudents.length) {
        const student = filteredStudents[cardIndex];
        completeSwipe(card, student, 'right');
    }
}

function superLike() {
    if (superLikesLeft <= 0) {
        showToast('No super likes left! Get more tomorrow 🌟', 'error');
        return;
    }
    
    const card = document.querySelector('.profile-card');
    if (!card || cardIndex >= filteredStudents.length) return;
    
    const student = filteredStudents[cardIndex];
    
    card.style.transition = 'transform 0.6s ease, opacity 0.6s ease';
    card.style.transform = 'translateY(-150%) scale(1.2)';
    card.style.opacity = '0';
    
    addMatch(student, true);
    
    swipeHistory.push({ student, direction: 'super', index: cardIndex });
    cardIndex++;
    superLikesLeft--;
    
    document.getElementById('superLikesCount').textContent = superLikesLeft;
    updateStats();
    saveToLocalStorage();
    
    setTimeout(() => loadCard(), 600);
    showToast(`Super Liked ${student.name}! ⭐`, 'success');
}

function undoSwipe() {
    if (swipeHistory.length === 0) {
        showToast('No swipes to undo!', 'info');
        return;
    }
    
    const lastSwipe = swipeHistory.pop();
    
    if (lastSwipe.direction === 'right') {
        matches = matches.filter(m => m.id !== lastSwipe.student.id);
        stats.swipesRight--;
    } else if (lastSwipe.direction === 'super') {
        matches = matches.filter(m => m.id !== lastSwipe.student.id);
        superLikesLeft++;
        document.getElementById('superLikesCount').textContent = superLikesLeft;
    } else {
        stats.swipesLeft--;
    }
    
    cardIndex = lastSwipe.index;
    updateBadges();
    updateStats();
    saveToLocalStorage();
    loadCard();
    showToast('Undo successful! ↩️', 'success');
}

function viewCurrentProfile() {
    if (cardIndex < filteredStudents.length) {
        const student = filteredStudents[cardIndex];
        viewFullProfile(student.id);
    }
}

// ==================== MATCHING ALGORITHM ====================
function calculateMatchScore(student) {
    let score = 0;
    let breakdown = {
        interests: 0,
        studyTime: 0,
        discipline: 0,
        branch: 0,
        lookingFor: 0
    };
    
    // Interest matching (30 points)
    const commonInterests = student.interests.filter(i => currentUser.interests.includes(i));
    breakdown.interests = (commonInterests.length / Math.max(student.interests.length, currentUser.interests.length)) * 30;
    score += breakdown.interests;
    
    // Study time matching (20 points)
    if (student.studyTime === currentUser.studyTime || student.studyTime === 'Flexible' || currentUser.studyTime === 'Flexible') {
        breakdown.studyTime = 20;
        score += 20;
    }
    
    // Same discipline bonus (15 points)
    if (student.discipline === currentUser.discipline) {
        breakdown.discipline = 15;
        score += 15;
    }
    
    // Same branch bonus (20 points)
    if (student.branch === currentUser.branch) {
        breakdown.branch = 20;
        score += 20;
    }
    
    // Looking for compatibility (15 points)
    const commonLooking = student.lookingFor.filter(l => currentUser.lookingFor.includes(l));
    breakdown.lookingFor = (commonLooking.length / Math.max(student.lookingFor.length, currentUser.lookingFor.length)) * 15;
    score += breakdown.lookingFor;
    
    return { score: Math.round(score), breakdown };
}

function applyCurrentFilters() {
    filteredStudents = students.filter(student => {
        // Exclude self
        if (student.email === currentUser.email) return false;
        
        // Exclude matched students
        if (matches.find(m => m.id === student.id)) return false;
        
        // Apply filters
        if (student.distance > appState.filters.distance) return false;
        if (student.age < appState.filters.ageMin || student.age > appState.filters.ageMax) return false;
        if (appState.filters.discipline && student.discipline !== appState.filters.discipline) return false;
        if (appState.filters.branch && student.branch !== appState.filters.branch) return false;
        if (appState.filters.year && student.year !== appState.filters.year) return false;
        if (appState.filters.gender !== 'Everyone' && student.gender !== appState.filters.gender) return false;
        
        return true;
    }).sort((a, b) => {
        // Sort by match score
        return calculateMatchScore(b).score - calculateMatchScore(a).score;
    });
}

// ==================== MATCHES ====================
function addMatch(student, isSuperLike = false) {
    if (matches.find(m => m.id === student.id)) return;
    
    const matchData = {
        ...student,
        isSuperLike,
        matchedAt: new Date(),
        unreadCount: 0,
        lastMessage: null
    };
    
    matches.push(matchData);
    stats.totalMatches++;
    
    // Simulate mutual like (60% chance)
    if (Math.random() > 0.4) {
        likes.push(matchData);
    }
    
    // Initialize chat
    chatMessages[student.id] = [];
    
    updateBadges();
    updateStats();
    saveToLocalStorage();
    
    showToast(`✅ It's a match with ${student.name}!`, 'success');
    
    // Add notification
    addNotification({
        title: 'New Match! 💚',
        message: `You matched with ${student.name}`,
        time: new Date(),
        userId: student.id
    });
}

function loadMatchesView() {
    const grid = document.getElementById('matchesGrid');
    if (!grid) return;
    
    if (matches.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:80px 30px; color:var(--text-secondary);">
                <i class="fas fa-heart" style="font-size:5rem; color:var(--primary-color); margin-bottom:20px;"></i>
                <h3 style="color:var(--text-primary); margin-bottom:15px;">No matches yet!</h3>
                <p>Keep swiping to find your perfect match!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = matches.map(m => `
        <div class="match-card" onclick="openChatFromMatch(${m.id})">
            <img src="${m.mainPhoto}" alt="${m.name}">
            <div class="match-card-info">
                <h4>${m.name} ${m.isSuperLike ? '⭐' : ''} ${m.verified ? '<i class="fas fa-check-circle" style="color:var(--secondary-color);"></i>' : ''}</h4>
                <p>${m.discipline} • ${m.branch} • ${m.year}</p>
                <p style="margin-top:10px; font-size:0.85rem;">${m.lastMessage || 'Say hi! 👋'}</p>
            </div>
        </div>
    `).join('');
}

function loadLikesView() {
    const grid = document.getElementById('likesGrid');
    if (!grid) return;
    
    if (likes.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align:center; padding:80px 30px; color:var(--text-secondary);">
                <i class="fas fa-fire" style="font-size:5rem; color:var(--warning-color); margin-bottom:20px;"></i>
                <h3 style="color:var(--text-primary); margin-bottom:15px;">No likes yet!</h3>
                <p>Keep your profile active to get more visibility!</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = likes.map(l => `
        <div class="match-card" onclick="viewFullProfile(${l.id})">
            <img src="${l.mainPhoto}" alt="${l.name}">
            <div class="match-card-info">
                <h4>${l.name} ${l.isSuperLike ? '⭐' : '💕'}</h4>
                <p>${l.discipline} • ${l.branch} • ${l.year}</p>
            </div>
        </div>
    `).join('');
}

// Continue in next response due to length...
// ==================== CHAT SYSTEM ====================
function openChatFromMatch(userId) {
    const user = matches.find(m => m.id === userId);
    if (!user) return;
    
    openChatModal(user);
}

function openChatModal(user) {
    currentChatUserId = user.id;
    
    // Reset unread count
    const match = matches.find(m => m.id === user.id);
    if (match) {
        match.unreadCount = 0;
        updateBadges();
    }
    
    // Update chat header
    document.getElementById('chatAvatar').src = user.mainPhoto;
    document.getElementById('chatUserName').textContent = user.name;
    document.getElementById('chatUserStatus').textContent = user.online ? 'Online 🟢' : 'Offline';
    
    // Load messages
    loadChatMessages();
    
    // Show modal
    document.getElementById('chatModal').classList.add('active');
    
    // Focus input
    setTimeout(() => {
        document.getElementById('chatInput').focus();
    }, 300);
}

function closeChatModal() {
    document.getElementById('chatModal').classList.remove('active');
    currentChatUserId = null;
}

function loadChatMessages() {
    const container = document.getElementById('chatMessages');
    if (!container || !currentChatUserId) return;
    
    const messages = chatMessages[currentChatUserId] || [];
    
    if (messages.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:60px 20px; color:var(--text-secondary);">
                <i class="fas fa-comment-dots" style="font-size:3rem; margin-bottom:15px;"></i>
                <h4>Start the conversation!</h4>
                <p style="margin-top:10px;">Send a message to break the ice 😊</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = messages.map(msg => {
        const time = new Date(msg.timestamp).toLocaleTimeString('en-IN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        return `
            <div class="message ${msg.type}">
                ${msg.text}
                <small style="opacity:0.7; font-size:0.75rem; display:block; margin-top:5px;">
                    ${time}
                </small>
            </div>
        `;
    }).join('');
    
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    if (!input || !currentChatUserId) return;
    
    const text = input.value.trim();
    if (!text) return;
    
    const message = {
        text: text,
        type: 'sent',
        timestamp: new Date()
    };
    
    if (!chatMessages[currentChatUserId]) {
        chatMessages[currentChatUserId] = [];
    }
    
    chatMessages[currentChatUserId].push(message);
    
    // Update last message in match
    const match = matches.find(m => m.id === currentChatUserId);
    if (match) {
        match.lastMessage = text.substring(0, 40) + (text.length > 40 ? '...' : '');
    }
    
    input.value = '';
    loadChatMessages();
    saveToLocalStorage();
    
    // Simulate auto-reply
    setTimeout(() => {
        const reply = generateAutoReply(text);
        chatMessages[currentChatUserId].push({
            text: reply,
            type: 'received',
            timestamp: new Date()
        });
        
        loadChatMessages();
        saveToLocalStorage();
    }, 1000 + Math.random() * 2000);
}

function generateAutoReply(message) {
    const msg = message.toLowerCase();
    
    const replies = {
        'hi': 'Hey! 👋 Great to match with you!',
        'hello': 'Hello! How are you doing? 😊',
        'hey': 'Hey there! What\'s up?',
        'study': 'Yes! I\'m looking for a study partner too. When are you free? 📚',
        'library': 'Library sounds perfect! Central library or department library?',
        'coffee': 'Coffee break sounds good! Campus cafe? ☕',
        'project': 'Cool! What\'s your project about? I might be able to help! 🚀',
        'exam': 'Exam prep is tough! Let\'s form a study group?',
        'gate': 'GATE prep together would be great! Which subjects?',
        'assignment': 'Which assignment? Maybe we can work together on it!',
        'hostel': 'Which hostel are you in? Maybe we\'re neighbors!',
        'time': 'I\'m usually free in the evenings after 5 PM. How about you?',
        'where': 'How about we meet at the main library or SAC?',
        'tomorrow': 'Tomorrow works for me! What time?',
        'today': 'Today is a bit packed, but I can manage. What time?'
    };
    
    for (let key in replies) {
        if (msg.includes(key)) {
            return replies[key];
        }
    }
    
    const defaultReplies = [
        'That sounds interesting! Tell me more 🤔',
        'I agree! Let\'s discuss this further.',
        'Great idea! When should we start?',
        'Awesome! I\'m excited about this! 🎉',
        'Sure thing! Let me know the details.',
        'Perfect! Looking forward to it! 😊',
        'That works for me! Let\'s do it!',
        'Sounds good! See you then! 👍'
    ];
    
    return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

function handleChatKeypress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

function attachFile() {
    showToast('File sharing coming soon! 📎', 'info');
}

// ==================== AUDIO/VIDEO CALLS ====================
function initiateAudioCall() {
    const user = matches.find(m => m.id === currentChatUserId);
    if (!user) return;
    
    closeChatModal();
    
    const callModal = document.getElementById('callModal');
    const callContent = document.getElementById('callContent');
    
    callContent.innerHTML = `
        <div style="text-align:center; padding:60px 40px; background:var(--bg-secondary); border-radius:var(--border-radius-lg);">
            <img src="${user.mainPhoto}" style="width:150px; height:150px; border-radius:50%; border:5px solid var(--primary-color); box-shadow:var(--shadow-glow); margin-bottom:25px;">
            <h2 style="margin-bottom:10px;">${user.name}</h2>
            <p style="color:var(--secondary-color); font-size:1.2rem; margin-bottom:30px;" id="callStatus">Calling... 📞</p>
            <div style="font-size:2.5rem; color:var(--success-color); margin-bottom:40px; display:none;" id="callTimer">00:00</div>
            <div style="display:flex; justify-content:center; gap:20px;">
                <button onclick="toggleMute()" class="btn-action" id="muteBtn" style="display:none;">
                    <i class="fas fa-microphone"></i>
                </button>
                <button onclick="toggleSpeaker()" class="btn-action" id="speakerBtn" style="display:none;">
                    <i class="fas fa-volume-up"></i>
                </button>
                <button onclick="endCall()" class="btn-action btn-pass">
                    <i class="fas fa-phone-slash"></i>
                </button>
            </div>
        </div>
    `;
    
    callModal.classList.add('active');
    
    // Simulate call connection
    setTimeout(() => {
        document.getElementById('callStatus').textContent = 'Connected 🎧';
        document.getElementById('callTimer').style.display = 'block';
        document.getElementById('muteBtn').style.display = 'flex';
        document.getElementById('speakerBtn').style.display = 'flex';
        
        startCallTimer();
        showToast('Call connected! 📞', 'success');
    }, 3000);
}

function initiateVideoCall() {
    const user = matches.find(m => m.id === currentChatUserId);
    if (!user) return;
    
    closeChatModal();
    
    const callModal = document.getElementById('callModal');
    const callContent = document.getElementById('callContent');
    
    callContent.innerHTML = `
        <div style="text-align:center; padding:40px; background:var(--bg-secondary); border-radius:var(--border-radius-lg); max-width:700px;">
            <div style="position:relative; width:100%; height:400px; background:linear-gradient(135deg, #1a1a2e, #16213e); border-radius:var(--border-radius); overflow:hidden; margin-bottom:25px;">
                <img src="${user.mainPhoto}" style="width:100%; height:100%; object-fit:cover;">
                <div style="position:absolute; top:20px; right:20px; width:150px; height:180px; background:var(--bg-primary); border-radius:var(--border-radius); border:3px solid var(--secondary-color); overflow:hidden; display:flex; align-items:center; justify-content:center;">
                    <img src="${currentUser.mainPhoto}" style="width:100%; height:100%; object-fit:cover;">
                </div>
            </div>
            <h2 style="margin-bottom:10px;">${user.name}</h2>
            <p style="color:var(--secondary-color); font-size:1.2rem; margin-bottom:25px;" id="videoCallStatus">Connecting... 📹</p>
            <div style="font-size:2rem; color:var(--success-color); margin-bottom:30px; display:none;" id="videoCallTimer">00:00</div>
            <div style="display:flex; justify-content:center; gap:15px;">
                <button onclick="toggleVideo()" class="btn-action" id="videoBtn" style="display:none;">
                    <i class="fas fa-video"></i>
                </button>
                <button onclick="toggleMute()" class="btn-action" id="muteBtn" style="display:none;">
                    <i class="fas fa-microphone"></i>
                </button>
                <button onclick="toggleCamera()" class="btn-action" id="cameraBtn" style="display:none;">
                    <i class="fas fa-sync-alt"></i>
                </button>
                <button onclick="endCall()" class="btn-action btn-pass" style="width:70px; height:70px;">
                    <i class="fas fa-phone-slash"></i>
                </button>
            </div>
        </div>
    `;
    
    callModal.classList.add('active');
    
    // Simulate call connection
    setTimeout(() => {
        document.getElementById('videoCallStatus').textContent = 'Connected 🎥';
        document.getElementById('videoCallTimer').style.display = 'block';
        document.getElementById('videoBtn').style.display = 'flex';
        document.getElementById('muteBtn').style.display = 'flex';
        document.getElementById('cameraBtn').style.display = 'flex';
        
        startCallTimer('videoCallTimer');
        showToast('Video call connected! 📹', 'success');
    }, 3000);
}

let callTimerInterval = null;
let isMuted = false;
let isSpeakerOn = false;
let isVideoOn = true;

function startCallTimer(timerId = 'callTimer') {
    let seconds = 0;
    callTimerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        const timerElement = document.getElementById(timerId);
        if (timerElement) {
            timerElement.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

function toggleMute() {
    isMuted = !isMuted;
    const btn = document.getElementById('muteBtn');
    if (btn) {
        btn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
        btn.style.background = isMuted ? 'var(--danger-color)' : '';
    }
    showToast(isMuted ? 'Muted 🔇' : 'Unmuted 🎤', 'info');
}

function toggleSpeaker() {
    isSpeakerOn = !isSpeakerOn;
    const btn = document.getElementById('speakerBtn');
    if (btn) {
        btn.innerHTML = isSpeakerOn ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-down"></i>';
        btn.style.background = isSpeakerOn ? 'var(--success-color)' : '';
    }
    showToast(isSpeakerOn ? 'Speaker On 🔊' : 'Speaker Off 🔉', 'info');
}

function toggleVideo() {
    isVideoOn = !isVideoOn;
    const btn = document.getElementById('videoBtn');
    if (btn) {
        btn.innerHTML = isVideoOn ? '<i class="fas fa-video"></i>' : '<i class="fas fa-video-slash"></i>';
        btn.style.background = isVideoOn ? '' : 'var(--danger-color)';
    }
    showToast(isVideoOn ? 'Video On 📹' : 'Video Off', 'info');
}

function toggleCamera() {
    showToast('Camera switched! 🔄', 'info');
}

function endCall() {
    if (callTimerInterval) {
        clearInterval(callTimerInterval);
        callTimerInterval = null;
    }
    
    document.getElementById('callModal').classList.remove('active');
    
    // Reset states
    isMuted = false;
    isSpeakerOn = false;
    isVideoOn = true;
    
    showToast('Call ended', 'info');
}

// ==================== PROFILE ====================
function viewFullProfile(userId) {
    const student = students.find(s => s.id === userId) || matches.find(m => m.id === userId);
    if (!student) return;
    
    const matchData = calculateMatchScore(student);
    const commonInterests = student.interests.filter(i => currentUser.interests.includes(i));
    const commonLooking = student.lookingFor.filter(l => currentUser.lookingFor.includes(l));
    
    const modal = document.getElementById('profileModal');
    const content = document.getElementById('profileModalContent');
    
    const isMatched = matches.find(m => m.id === student.id);
    
    content.innerHTML = `
        <div style="text-align:center; margin-bottom:30px;">
            <img src="${student.mainPhoto}" style="width:200px; height:200px; border-radius:50%; border:5px solid var(--primary-color); box-shadow:var(--shadow-glow); margin-bottom:20px;">
            <h2>${student.name}, ${student.age} ${student.verified ? '<i class="fas fa-check-circle" style="color:var(--secondary-color);"></i>' : ''}</h2>
            <p style="color:var(--secondary-color); margin-top:8px; font-size:1.1rem;">
                ${student.discipline} • ${student.branch} • ${student.year}
            </p>
        </div>
        
        <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:25px;">
            <h3 style="color:var(--success-color); margin-bottom:20px; display:flex; align-items:center; gap:10px;">
                <i class="fas fa-chart-line"></i> Match Score
            </h3>
            <div style="width:100%; background:#333; border-radius:15px; height:45px; position:relative; overflow:hidden; margin-bottom:20px;">
                <div style="width:${matchData.score}%; background:linear-gradient(90deg, var(--success-color), var(--secondary-color)); height:100%; border-radius:15px; display:flex; align-items:center; justify-content:center; color:black; font-weight:bold; font-size:1.3rem;">
                    ${matchData.score}%
                </div>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; font-size:0.9rem;">
                <div>📚 Interests: ${Math.round(matchData.breakdown.interests)}%</div>
                <div>🕒 Study Time: ${Math.round(matchData.breakdown.studyTime)}%</div>
                <div>🎓 Discipline: ${Math.round(matchData.breakdown.discipline)}%</div>
                <div>📖 Branch: ${Math.round(matchData.breakdown.branch)}%</div>
            </div>
        </div>
        
        <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:25px;">
            <h3 style="color:var(--success-color); margin-bottom:15px;">
                <i class="fas fa-comment-alt"></i> About
            </h3>
            <p style="color:var(--text-secondary); line-height:1.7;">${student.bio}</p>
        </div>
        
        <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:25px;">
            <h3 style="color:var(--success-color); margin-bottom:18px;">
                <i class="fas fa-heart"></i> Interests
            </h3>
            <div style="display:flex; flex-wrap:wrap; gap:10px;">
                ${student.interests.map(i => {
                    const isCommon = commonInterests.includes(i);
                    return `<span style="padding:10px 16px; background:${isCommon ? 'var(--success-color)' : '#333'}; color:${isCommon ? 'black' : 'white'}; border-radius:20px; font-weight:600; font-size:0.9rem;">${i} ${isCommon ? '✓' : ''}</span>`;
                }).join('')}
            </div>
        </div>
        
        <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:25px;">
            <h3 style="color:var(--success-color); margin-bottom:18px;">
                <i class="fas fa-search"></i> Looking For
            </h3>
            <div style="display:flex; flex-wrap:wrap; gap:10px;">
                ${student.lookingFor.map(l => {
                    const isCommon = commonLooking.includes(l);
                    return `<span style="padding:10px 16px; background:${isCommon ? 'var(--secondary-color)' : '#333'}; color:${isCommon ? 'black' : 'white'}; border-radius:20px; font-weight:600; font-size:0.9rem;">${l} ${isCommon ? '✓' : ''}</span>`;
                }).join('')}
            </div>
        </div>
        
        <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:30px;">
            <h3 style="color:var(--success-color); margin-bottom:15px;">
                <i class="fas fa-clock"></i> Study Time
            </h3>
            <p style="color:var(--text-secondary);">Prefers ${student.studyTime} study sessions 
                ${student.studyTime === currentUser.studyTime ? '<span style="color:var(--success-color)">✓ (Matches yours!)</span>' : ''}</p>
        </div>
        
        <div style="display:grid; grid-template-columns:${isMatched ? '1fr' : '1fr 1fr'}; gap:15px;">
            ${!isMatched ? `
            <button onclick="closeProfileModal(); swipeLeft();" class="btn btn-secondary btn-block">
                <i class="fas fa-times"></i> Pass
            </button>
            <button onclick="closeProfileModal(); swipeRight();" class="btn btn-primary btn-block">
                <i class="fas fa-heart"></i> Like
            </button>
            ` : `
            <button onclick="closeProfileModal(); openChatFromMatch(${student.id});" class="btn btn-primary btn-block">
                <i class="fas fa-comment"></i> Send Message
            </button>
            `}
        </div>
    `;
    
    modal.classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profileModal').classList.remove('active');
}

function loadMyProfile() {
    const container = document.getElementById('myProfileContainer');
    if (!container) return;
    
    const profileCompletion = calculateProfileCompletion();
    
    container.innerHTML = `
        <div style="text-align:center; padding:40px 20px;">
            <img src="${currentUser.mainPhoto}" style="width:180px; height:180px; border-radius:50%; border:5px solid var(--primary-color); box-shadow:var(--shadow-glow); margin-bottom:25px;">
            <h2 style="margin-bottom:10px;">${currentUser.name}, ${currentUser.age}</h2>
            <p style="color:var(--secondary-color); font-size:1.1rem; margin-bottom:8px;">
                ${currentUser.discipline} • ${currentUser.branch} • ${currentUser.year}
            </p>
            <p style="color:var(--text-secondary); font-size:0.9rem;">${currentUser.email}</p>
            
            <div style="margin:30px auto; padding:25px; background:var(--bg-tertiary); border-radius:var(--border-radius); max-width:500px;">
                <p style="color:var(--success-color); font-size:0.95rem; margin-bottom:12px;">
                    Profile Strength: ${profileCompletion}%
                </p>
                <div style="width:100%; height:10px; background:#333; border-radius:10px; overflow:hidden;">
                    <div style="width:${profileCompletion}%; height:100%; background:linear-gradient(90deg, var(--success-color), var(--secondary-color)); border-radius:10px;"></div>
                </div>
            </div>
        </div>
        
        <div style="padding:0 30px; max-width:800px; margin:0 auto;">
            <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:20px;">
                <h3 style="color:var(--success-color); margin-bottom:15px;">
                    <i class="fas fa-comment-alt"></i> Bio
                </h3>
                <p style="color:var(--text-secondary); line-height:1.7;">${currentUser.bio}</p>
            </div>
            
            <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:20px;">
                <h3 style="color:var(--success-color); margin-bottom:18px;">
                    <i class="fas fa-heart"></i> Interests
                </h3>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">
                    ${currentUser.interests.map(i => 
                        `<span style="padding:10px 16px; background:var(--success-color); color:black; border-radius:20px; font-weight:600;">${i}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:20px;">
                <h3 style="color:var(--success-color); margin-bottom:18px;">
                    <i class="fas fa-search"></i> Looking For
                </h3>
                <div style="display:flex; flex-wrap:wrap; gap:10px;">
                    ${currentUser.lookingFor.map(l => 
                        `<span style="padding:10px 16px; background:var(--secondary-color); color:black; border-radius:20px; font-weight:600;">${l}</span>`
                    ).join('')}
                </div>
            </div>
            
            <div style="background:var(--bg-tertiary); padding:25px; border-radius:var(--border-radius); margin-bottom:30px;">
                <h3 style="color:var(--success-color); margin-bottom:20px;">
                    <i class="fas fa-chart-bar"></i> My Stats
                </h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:20px;">
                    <div style="text-align:center;">
                        <div style="font-size:2.5rem; color:var(--success-color); font-weight:800;">${stats.profileViews}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">Profile Views</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:2.5rem; color:var(--primary-color); font-weight:800;">${stats.totalMatches}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">Total Matches</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:2.5rem; color:var(--secondary-color); font-weight:800;">${stats.swipesRight}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">Likes Given</div>
                    </div>
                    <div style="text-align:center;">
                        <div style="font-size:2.5rem; color:var(--warning-color); font-weight:800;">${likes.length}</div>
                        <div style="font-size:0.85rem; color:var(--text-secondary);">Likes Received</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function calculateProfileCompletion() {
    let score = 0;
    if (currentUser.name) score += 10;
    if (currentUser.bio && currentUser.bio.length > 20) score += 15;
    if (currentUser.interests.length >= CONFIG.MIN_INTERESTS) score += 20;
    if (currentUser.lookingFor.length > 0) score += 15;
    if (currentUser.mainPhoto) score += 15;
    if (currentUser.photos.filter(p => p).length >= CONFIG.MIN_PHOTOS) score += 15;
    if (currentUser.phone) score += 5;
    if (currentUser.verified) score += 5;
    return score;
}

// ==================== FILTERS ====================
function openFilters() {
    document.getElementById('filtersModal').classList.add('active');
}

function closeFilters() {
    document.getElementById('filtersModal').classList.remove('active');
}

function updateDistanceValue(value) {
    document.getElementById('distanceValue').textContent = value;
}

function applyFilters() {
    appState.filters.distance = parseInt(document.getElementById('filterDistance').value);
    appState.filters.ageMin = parseInt(document.getElementById('filterAgeMin').value);
    appState.filters.ageMax = parseInt(document.getElementById('filterAgeMax').value);
    appState.filters.discipline = document.getElementById('filterDiscipline').value;
    appState.filters.branch = document.getElementById('filterBranch').value;
    appState.filters.year = document.getElementById('filterYear').value;
    
    if (appState.filters.ageMin > appState.filters.ageMax) {
        showToast('Invalid age range!', 'error');
        return;
    }
    
    applyCurrentFilters();
    cardIndex = 0;
    swipeHistory = [];
    
    closeFilters();
    loadCard();
    
    saveToLocalStorage();
    showToast(`Filters applied! ${filteredStudents.length} students found 🔍`, 'success');
}

function resetFilters() {
    appState.filters = {
        distance: 10,
        ageMin: 18,
        ageMax: 30,
        discipline: '',
        branch: '',
        year: '',
        gender: 'Everyone'
    };
    
    document.getElementById('filterDistance').value = 10;
    document.getElementById('distanceValue').textContent = '10';
    document.getElementById('filterAgeMin').value = 18;
    document.getElementById('filterAgeMax').value = 30;
    document.getElementById('filterDiscipline').value = '';
    document.getElementById('filterBranch').value = '';
    document.getElementById('filterYear').value = '';
    
    applyCurrentFilters();
    cardIndex = 0;
    swipeHistory = [];
    
    if (document.getElementById('filtersModal').classList.contains('active')) {
        closeFilters();
    }
    
    loadCard();
    saveToLocalStorage();
    
    showToast('Filters reset! ♻️', 'success');
}

// ==================== SETTINGS & UTILS ====================
function openSettings() {
    showToast('Settings coming soon! ⚙️', 'info');
}

function openNotifications() {
    showToast(`You have ${notifications.length} notifications`, 'info');
}

function openMessages() {
    switchView('messages');
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profileDropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function openHelp() {
    showToast('Help center coming soon! 💡', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        switchPage('loginPage');
        showToast('Logged out successfully! 👋', 'info');
    }
}

function searchGlobally(query) {
    console.log('Searching for:', query);
    // Implement global search
}

function filterMatchesBy(type) {
    console.log('Filter matches by:', type);
    // Implement match filtering
}

function loadOnlineUsers() {
    const container = document.getElementById('onlineUsersList');
    if (!container) return;
    
    const onlineStudents = students.filter(s => s.online && s.email !== currentUser.email).slice(0, 10);
    
    if (onlineStudents.length === 0) {
        container.innerHTML = '<p style="color:var(--text-secondary); font-size:0.9rem;">No users online</p>';
        return;
    }
    
    container.innerHTML = onlineStudents.map(s => `
        <div class="online-user-item" onclick="viewFullProfile(${s.id})">
            <div style="position:relative;">
                <img src="${s.mainPhoto}" alt="${s.name}">
                <div class="online-dot"></div>
            </div>
            <div style="flex:1; min-width:0;">
                <h5 style="font-size:0.9rem; margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.name}</h5>
                <small style="color:var(--text-secondary); font-size:0.8rem;">${s.branch}</small>
            </div>
        </div>
    `).join('');
}

function showSafetyTips() {
    showToast('Always meet in public places on campus! 🛡️', 'info');
}

function showSuccessStories() {
    showToast('Success stories coming soon! 💑', 'info');
}

function reportBug() {
    showToast('Bug report feature coming soon! 🐛', 'info');
}

function updateStats() {
    const viewsEl = document.getElementById('profileViewsStat');
    const matchesEl = document.getElementById('matchesStat');
    const likesEl = document.getElementById('likesStat');
    
    if (viewsEl) viewsEl.textContent = stats.profileViews;
    if (matchesEl) matchesEl.textContent = stats.totalMatches;
    if (likesEl) likesEl.textContent = likes.length;
}

function updateBadges() {
    const matchesBadge = document.getElementById('matchesBadge');
    const likesBadge = document.getElementById('likesBadge');
    const notifBadge = document.getElementById('notifBadge');
    const msgBadge = document.getElementById('msgBadge');
    
    const totalUnread = matches.reduce((sum, m) => sum + (m.unreadCount || 0), 0);
    
    if (matchesBadge) {
        matchesBadge.textContent = matches.length;
        matchesBadge.style.display = matches.length > 0 ? 'block' : 'none';
    }
    
    if (likesBadge) {
        likesBadge.textContent = likes.length;
        likesBadge.style.display = likes.length > 0 ? 'block' : 'none';
    }
    
    if (notifBadge) {
        notifBadge.textContent = notifications.length;
        notifBadge.style.display = notifications.length > 0 ? 'block' : 'none';
    }
    
    if (msgBadge) {
        msgBadge.textContent = totalUnread;
        msgBadge.style.display = totalUnread > 0 ? 'block' : 'none';
    }
}

function addNotification(notification) {
    notifications.unshift(notification);
    if (notifications.length > 50) {
        notifications = notifications.slice(0, 50);
    }
    updateBadges();
    saveToLocalStorage();
}

// ==================== LOCAL STORAGE ====================
function saveToLocalStorage() {
    try {
        localStorage.setItem('campussoul_user_' + currentUser.email, JSON.stringify(currentUser));
        localStorage.setItem('campussoul_matches', JSON.stringify(matches));
        localStorage.setItem('campussoul_likes', JSON.stringify(likes));
        localStorage.setItem('campussoul_chats', JSON.stringify(chatMessages));
        localStorage.setItem('campussoul_stats', JSON.stringify(stats));
        localStorage.setItem('campussoul_state', JSON.stringify(appState));
        localStorage.setItem('campussoul_notifications', JSON.stringify(notifications));
        localStorage.setItem('campussoul_superLikes', superLikesLeft);
        console.log('💾 Data saved');
    } catch (e) {
        console.error('Failed to save:', e);
    }
}

function loadFromLocalStorage() {
    try {
        const savedState = localStorage.getItem('campussoul_state');
        const savedMatches = localStorage.getItem('campussoul_matches');
        const savedLikes = localStorage.getItem('campussoul_likes');
        const savedChats = localStorage.getItem('campussoul_chats');
        const savedStats = localStorage.getItem('campussoul_stats');
        const savedNotifications = localStorage.getItem('campussoul_notifications');
        const savedSuperLikes = localStorage.getItem('campussoul_superLikes');
        
        if (savedState) appState = JSON.parse(savedState);
        if (savedMatches) matches = JSON.parse(savedMatches);
        if (savedLikes) likes = JSON.parse(savedLikes);
        if (savedChats) chatMessages = JSON.parse(savedChats);
        if (savedStats) stats = JSON.parse(savedStats);
        if (savedNotifications) notifications = JSON.parse(savedNotifications);
        if (savedSuperLikes) superLikesLeft = parseInt(savedSuperLikes);
        
        // Check if returning user
        if (appState.currentPage && document.getElementById('emailInput')) {
            const lastEmail = document.getElementById('emailInput').value;
            if (lastEmail) {
                const savedUser = localStorage.getItem('campussoul_user_' + lastEmail);
                if (savedUser) {
                    currentUser = JSON.parse(savedUser);
                }
            }
        }
        
        console.log('📂 Data loaded');
    } catch (e) {
        console.error('Failed to load:', e);
    }
}

// ==================== TOAST NOTIFICATIONS ====================
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    document.body.appendChild(container);
    return container;
}

// ==================== SIMULATIONS ====================
// Simulate online status changes
setInterval(() => {
    students.forEach(student => {
        if (Math.random() > 0.9) {
            student.online = !student.online;
        }
    });
    loadOnlineUsers();
}, 30000);

// Auto-save
setInterval(() => {
    if (currentUser.id) {
        saveToLocalStorage();
    }
}, 60000);

// Reset super likes daily (simulated)
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        superLikesLeft = CONFIG.SUPER_LIKES_PER_DAY;
        document.getElementById('superLikesCount').textContent = superLikesLeft;
        showToast('Super Likes refilled! ⭐', 'success');
    }
}, 60000);

console.log('✅ CampusSoul - IIT Guwahati Edition Ready!');
console.log('🎓 All features loaded!');
