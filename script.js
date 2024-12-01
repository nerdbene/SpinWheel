// The wheel of destiny awaits your command!
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('wheel');
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('spinButton');
    const addOptionBtn = document.getElementById('addOption');
    const newOptionInput = document.getElementById('newOption');
    const optionsList = document.getElementById('optionsList');

    // Making sure our wheel isn't tiny (that would be wheely disappointing)
    canvas.width = 500;
    canvas.height = 500;

    // The contestants waiting for their chance at glory
    let options = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
    let isSpinning = false;
    let currentRotation = 0;
    let spinTimeout;
    let lastTickTime = 0;
    const ticker = document.querySelector('.wheel-ticker');

    // The satisfying click that makes you feel like a game show host
    function playTickSound(volume = 1) {
        const tickSound = new Audio('data:audio/wav;base64,UklGRnQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YU8GAACBgIF/gn6Dfn+AgH+Af4B+gH5/fX99f31+fn9+f35/fn9+f35+fn1+fX18fX19fn1+fn9+f39/gICAgIGBgoGCgoKCg4ODg4SEhISFhIWFhYWFhYaGhoWGhYWFhYSEhIODgoKBgYCAfn17eXd0cnBtamhjYV5bWVZTUE1LSUZEQkA+PDo5NzY2NTQ0NDQ1NTY3ODk7PD4/QUNFRkhKTU5QUlRWWFpcXmBiZGZoam1ucXN0d3h6e31+gIGCg4SFhYaHh4iIiImJiYmJiYmJiYiIh4eGhYWEg4KBgH99fHp5d3Z1c3JxcG5ta2ppaGdmZWVkY2NjYmJiYmJiYmNjY2RkZWVkZWVkZWVkZWVlZmZmZ2doaGlqa2xtbm9wcXJ0dXZ3eHp7fH1+f4CBgoOEhIWGhoeHiIiJiYmKioqKioqKiomJiYiIh4eGhYSEg4KBgH9+fXt6eXh2dXRzcXBvbm1sa2ppaGdnZmVlZGRjY2NjYmJjY2NjZGRlZWZmZ2hpamtsbW5vcHFydHV2d3h5e3x9fn+AgYKDhISFhoaHh4iIiYmJiYmKioqKioqJiYmIiIeHhoWFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbWxrbGxrbGxsbGxsbGxtbW1ubm9vcHBxcXJzdHR1dnd4eXp7fH1+f3+AgYKDg4SFhYaGh4eHiIiIiImJiYmJiYmJiIiIiIeHh4aGhYWEg4OCgYCAfn18e3p5eHd2dXRzcnFwb25tbGtqaWhoZ2ZmZWRkY2NiYmJiYmJiYmJjY2NkZGVlZmZnaGhpamtsbW5vcHFydHV2d3h5ent8fX5/gIGCg4SFhYaHh4iIiYmJioqKioqKioqJiYiIh4eGhYSDgoGAfn17eXZ0cW9saWZjYF1aV1RRT01KR0RCPz07ODY0MjEwLy4uLS0tLS4uLzAxMjM1Njg5Ozw+QEJERkhJTE5QUlVXWVxeYGJkZmlrbW9xc3V3eXt9f4CCg4WGiImKi4yNjo+QkJGRkpKSkpKSkZGQkI+OjYyLiomIhoWDgn9+fHp4dnRycG5sa2loZmVkY2JhYGBfX19fX19fX2BgYWFiYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4OEhYWGhoeHh4iIiIiIiIiIiIiIh4eHhoaFhYSEg4KCgYCAf359fHt6eXh3dnV0c3JxcG9ubWxsa2ppaWhoZ2dmZmZlZWVkZWVkZWVkZWVlZmZmZ2doaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/f4CBgoKDhISFhYWGhoaGhoaGhoaGhoaGhoWFhYSEg4OCgYGAgH9+fXx7');
        tickSound.volume = volume;
        tickSound.play();
    }

    // Make that ticker bounce like it's having the time of its life
    function triggerTicker() {
        ticker.classList.add('bounce');
        playTickSound(0.3);
        setTimeout(() => ticker.classList.remove('bounce'), 150);
    }

    // Our wheel's fashion choices - because bland colors are so last season
    const colors = [
        '#FF6B6B', // Coral Red - Hot like your winning chances
        '#4ECDC4', // Turquoise - Cool as a cucumber
        '#45B7D1', // Sky Blue - High as your hopes
        '#96CEB4', // Sage Green - Wise choice!
        '#FFEEAD', // Cream Yellow - Smooth like butter
        '#D4A5A5', // Dusty Rose - Classy and sassy
        '#9B59B6', // Purple - Royalty vibes
        '#3498DB', // Blue - Ocean of possibilities
        '#E67E22', // Orange - Zesty fresh
        '#27AE60', // Green - Money moves
        '#F1C40F', // Yellow - Sunny side up
        '#E74C3C'  // Red - Hot hot hot!
    ];

    // Creating our victory announcement stage
    const popup = document.createElement('div');
    popup.className = 'result-popup';
    popup.innerHTML = `
        <button class="popup-close">×</button>
        <div class="popup-content"></div>
    `;
    document.body.appendChild(popup);

    // Bye-bye popup (until we meet again)
    popup.querySelector('.popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
    });

    // Time to announce our lucky winner!
    function showPopup(text) {
        popup.querySelector('.popup-content').textContent = text;
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 3000);
    }

    // The artist formerly known as drawWheel
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw segments
        const segmentAngle = (2 * Math.PI) / options.length;
        options.forEach((option, index) => {
            // Calculate angles
            const startAngle = index * segmentAngle + currentRotation;
            const endAngle = (index + 1) * segmentAngle + currentRotation;

            // Draw segment
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();

            // Fill with color from palette
            ctx.fillStyle = colors[index % colors.length];
            ctx.fill();
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Add text
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + segmentAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 20px Comic Neue';
            ctx.fillText(option, radius - 20, 6);
            ctx.restore();
        });

        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw arrow
        ctx.beginPath();
        ctx.moveTo(centerX + 30, centerY);
        ctx.lineTo(centerX - 10, centerY - 20);
        ctx.lineTo(centerX - 10, centerY + 20);
        ctx.closePath();
        ctx.fillStyle = '#FF5722';
        ctx.fill();
    }

    // Let it rip! Time to make someone's day
    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        spinBtn.disabled = true;
        lastTickTime = performance.now();

        // Random number of spins (4-6 full rotations)
        const spins = 4 + Math.random() * 2;
        const targetRotation = currentRotation + (spins * 2 * Math.PI);
        const duration = 5000; // 5 seconds
        const startTime = performance.now();
        const startRotation = currentRotation;

        function animate(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Custom easing function for realistic deceleration
            const easeOut = function(t) {
                return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
            }
            
            currentRotation = startRotation + (targetRotation - startRotation) * easeOut(progress);

            // Calculate current speed (rotations per second)
            const currentSpeed = ((targetRotation - startRotation) / duration) * 
                               (1 - easeOut(progress)) * 1000; // in radians per second
            
            // Trigger ticker based on speed and time since last tick
            const timeSinceLastTick = currentTime - lastTickTime;
            // Faster ticks at high speed, slower at low speed
            const tickInterval = Math.max(30, 300 - (currentSpeed * 50));
            
            if (timeSinceLastTick >= tickInterval) {
                triggerTicker();
                lastTickTime = currentTime;
            }

            drawWheel();

            if (progress < 1) {
                spinTimeout = requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                spinBtn.disabled = false;
                currentRotation = currentRotation % (2 * Math.PI);
                
                // Calculate winner
                const segmentAngle = (2 * Math.PI) / options.length;
                const normalizedRotation = (2 * Math.PI - (currentRotation % (2 * Math.PI))) % (2 * Math.PI);
                const winningIndex = Math.floor(normalizedRotation / segmentAngle);
                const winner = options[winningIndex];

                // Final tick for emphasis
                setTimeout(() => {
                    triggerTicker();
                    // Show winner after a short delay
                    setTimeout(() => {
                        showPopup(`The wheel has chosen: ${winner}!`);
                    }, 300);
                }, 100);
            }
        }

        requestAnimationFrame(animate);
    }

    // Adding more choices to spice up the competition
    function addOption(text) {
        if (!text.trim()) return;
        options.push(text.trim());
        updateOptionsList();
        drawWheel();
        newOptionInput.value = '';
    }

    // Sometimes choices need to go (it's not you, it's me)
    function deleteOption(index) {
        if (options.length <= 2) {
            alert('You need at least 2 options!');
            return;
        }
        options.splice(index, 1);
        updateOptionsList();
        drawWheel();
    }

    // Keeping our list fresh and organized
    function updateOptionsList() {
        optionsList.innerHTML = '';
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option-item';
            optionElement.innerHTML = `
                <span>${option}</span>
                <button class="delete-option" data-index="${index}">×</button>
            `;
            optionsList.appendChild(optionElement);
        });
    }

    // Listening for your commands, captain!
    spinBtn.addEventListener('click', spin);
    
    addOptionBtn.addEventListener('click', () => {
        addOption(newOptionInput.value);
    });

    newOptionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addOption(newOptionInput.value);
        }
    });

    optionsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-option')) {
            const index = parseInt(e.target.dataset.index);
            deleteOption(index);
        }
    });

    // Initialize
    updateOptionsList();
    drawWheel();
});
