// Terminal Interactive System
(function() {
    'use strict';

    // Terminal State
    const state = {
        currentSection: 'home',
        commandHistory: [],
        historyIndex: -1,
        typingInProgress: false
    };

    // DOM Elements
    const elements = {
        sections: document.querySelectorAll('.terminal-section'),
        navLinks: document.querySelectorAll('.nav-link'),
        menuToggle: document.querySelector('.menu-toggle'),
        navMenu: document.querySelector('.nav-menu'),
        terminalInput: document.getElementById('terminal-input'),
        typingText: document.querySelector('.typing-text'),
        outputLines: document.querySelectorAll('.output-line'),
        clock: document.getElementById('clock'),
        quickButtons: document.querySelectorAll('.terminal-btn[data-action]'),
        matrixCanvas: document.getElementById('matrix-bg')
    };

    // Initialize
    function init() {
        setupEventListeners();
        startClock();
        initTypingAnimation();
        initMatrixRain();
        setupTerminalCommands();
        animateBootSequence();
        setupMobileMenu();
        setupQuickAccess();
        setupNavigation();
        setupKeyboardShortcuts();
    }

    // Event Listeners
    function setupEventListeners() {
        // Navigation
        elements.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href').substring(1);
                navigateToSection(target);
            });
        });

        // Terminal Input
        if (elements.terminalInput) {
            elements.terminalInput.addEventListener('keydown', handleTerminalInput);
        }
    }

    // Navigation System
    function navigateToSection(sectionId) {
        // Hide all sections
        elements.sections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            state.currentSection = sectionId;

            // Update nav links
            elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });

            // Play navigation sound effect (optional)
            playSound('nav');
        }
    }

    // Terminal Commands
    function setupTerminalCommands() {
        const commands = {
            help: () => {
                return `
Available commands:
  help     - Show this help message
  ls       - List available sections
  cd       - Navigate to section (e.g., cd about)
  clear    - Clear terminal output (also: cls, Ctrl+L)
  whoami   - Display user information
  skills   - Show technical skills
  contact  - Display contact information
  matrix   - Toggle matrix effect
  theme    - Change terminal theme
  hack     - Initiate hacking sequence (easter egg)
                `.trim();
            },
            ls: () => {
                return 'home/  about/  projects/  blog/  contact/';
            },
            cd: (args) => {
                const section = args[0];
                if (['home', 'about', 'projects', 'blog', 'contact'].includes(section)) {
                    navigateToSection(section);
                    return `Navigating to ${section}...`;
                }
                return `Error: ${section}: No such directory`;
            },
            clear: () => {
                const output = document.getElementById('output');
                if (output) {
                    // Keep initial boot sequence output, only clear command outputs
                    const commandOutputs = output.querySelectorAll('.terminal-output-line');
                    commandOutputs.forEach(line => line.remove());
                }
                return ''; // Return empty string so no new line is added
            },
            cls: () => {
                // Alias for Windows users
                return commands.clear();
            },
            whoami: () => {
                return 'Lev Kozhokaru - Software Engineer | Dev Tools Creator | AI Integration Specialist';
            },
            skills: () => {
                return `
Languages: JavaScript, Python, TypeScript
AI/ML: Claude, GPT, Custom LLM Orchestration
Tools: React, Node.js, Docker, AWS
Focus: Building dev tools that actually work
                `.trim();
            },
            contact: () => {
                return `
GitHub: https://github.com/kozhokaru
LinkedIn: https://linkedin.com/in/levkoz
                `.trim();
            },
            matrix: () => {
                toggleMatrixEffect();
                return 'Matrix effect toggled';
            },
            theme: (args) => {
                const theme = args[0] || 'default';
                changeTheme(theme);
                return `Theme changed to: ${theme}`;
            },
            hack: () => {
                initiateHackingSequence();
                return 'INITIATING HACK SEQUENCE...';
            }
        };

        window.executeCommand = (input) => {
            const [cmd, ...args] = input.trim().toLowerCase().split(' ');
            if (commands[cmd]) {
                return commands[cmd](args);
            }
            return `Command not found: ${cmd}. Type 'help' for available commands.`;
        };
    }

    // Terminal Input Handler
    function handleTerminalInput(e) {
        if (e.key === 'Enter') {
            const input = e.target.value.trim();
            if (input) {
                const output = window.executeCommand(input);
                displayOutput(output);
                state.commandHistory.push(input);
                state.historyIndex = state.commandHistory.length;
                e.target.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (state.historyIndex > 0) {
                state.historyIndex--;
                e.target.value = state.commandHistory[state.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (state.historyIndex < state.commandHistory.length - 1) {
                state.historyIndex++;
                e.target.value = state.commandHistory[state.historyIndex];
            } else {
                state.historyIndex = state.commandHistory.length;
                e.target.value = '';
            }
        }
    }

    // Display Output
    function displayOutput(text) {
        const outputPre = document.createElement('pre');
        outputPre.className = 'terminal-output-line';
        outputPre.style.cssText = 'color: var(--text-primary); margin: 0.5rem 0; font-family: var(--font-mono); white-space: pre-wrap; word-wrap: break-word;';
        outputPre.textContent = text;
        
        const outputContainer = document.getElementById('output');
        if (outputContainer) {
            outputContainer.appendChild(outputPre);
            outputContainer.scrollTop = outputContainer.scrollHeight;
        }
    }

    // Typing Animation
    function initTypingAnimation() {
        if (!elements.typingText) return;

        const text = elements.typingText.dataset.text;
        let index = 0;

        function type() {
            if (index < text.length) {
                elements.typingText.textContent = text.substring(0, index + 1);
                index++;
                setTimeout(type, 100);
            } else {
                // Wait a bit after typing completes before showing output
                setTimeout(() => {
                    elements.outputLines.forEach((line, i) => {
                        setTimeout(() => {
                            line.classList.remove('hidden');
                        }, i * 500);
                    });
                }, 200);  // Reduced from 500ms since CSS now handles the main delay
            }
        }

        setTimeout(type, 1000);
    }

    // Boot Sequence Animation
    function animateBootSequence() {
        const bootMessages = [
            'INITIALIZING SYSTEM...',
            'LOADING KERNEL MODULES...',
            'MOUNTING FILE SYSTEMS...',
            'STARTING NETWORK SERVICES...',
            'LOADING USER PROFILE...',
            'SYSTEM READY'
        ];

        // You can implement a boot sequence animation here
    }

    // Clock
    function startClock() {
        function updateClock() {
            const now = new Date();
            const time = now.toTimeString().split(' ')[0];
            if (elements.clock) {
                elements.clock.textContent = time;
            }
        }

        updateClock();
        setInterval(updateClock, 1000);
    }

    // Matrix Rain Effect
    function initMatrixRain() {
        const canvas = elements.matrixCanvas;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const matrix = '01';
        const matrixArray = matrix.split('');
        const fontSize = 10;
        const columns = canvas.width / fontSize;
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        function drawMatrix() {
            ctx.fillStyle = 'rgba(10, 14, 39, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff41';
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < drops.length; i++) {
                const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        }

        setInterval(drawMatrix, 35);

        // Resize handler
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    // Mobile Menu
    function setupMobileMenu() {
        if (elements.menuToggle && elements.navMenu) {
            elements.menuToggle.addEventListener('click', () => {
                elements.navMenu.classList.toggle('active');
                const isOpen = elements.navMenu.classList.contains('active');
                elements.menuToggle.setAttribute('aria-expanded', isOpen);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!elements.menuToggle.contains(e.target) && !elements.navMenu.contains(e.target)) {
                    elements.navMenu.classList.remove('active');
                    elements.menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Quick Access Buttons
    function setupQuickAccess() {
        elements.quickButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                navigateToSection(action);
            });
        });
    }

    // Setup Navigation
    function setupNavigation() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href').substring(1);
                if (target) {
                    navigateToSection(target);
                }
            });
        });
    }

    // Keyboard Shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC key to go home
            if (e.key === 'Escape') {
                navigateToSection('home');
            }

            // Ctrl/Cmd + K to focus terminal input
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (elements.terminalInput) {
                    elements.terminalInput.focus();
                }
            }

            // Ctrl + L to clear terminal (standard terminal shortcut)
            if (e.ctrlKey && e.key === 'l') {
                e.preventDefault();
                const output = document.getElementById('output');
                if (output) {
                    const commandOutputs = output.querySelectorAll('.terminal-output-line');
                    commandOutputs.forEach(line => line.remove());
                }
            }

            // Number keys for quick navigation
            if (!e.ctrlKey && !e.metaKey && !e.altKey) {
                switch(e.key) {
                    case '1': navigateToSection('home'); break;
                    case '2': navigateToSection('about'); break;
                    case '3': navigateToSection('projects'); break;
                    case '4': navigateToSection('blog'); break;
                    case '5': navigateToSection('contact'); break;
                }
            }
        });
    }

    // Toggle Matrix Effect
    function toggleMatrixEffect() {
        const canvas = elements.matrixCanvas;
        if (canvas) {
            canvas.style.display = canvas.style.display === 'none' ? 'block' : 'none';
        }
    }

    // Change Theme
    function changeTheme(theme) {
        const themes = {
            default: {
                '--text-primary': '#00ff41',
                '--accent-cyan': '#00d9ff',
                '--bg-primary': '#0a0e27'
            },
            amber: {
                '--text-primary': '#ffb000',
                '--accent-cyan': '#ff6b00',
                '--bg-primary': '#1a0f00'
            },
            ice: {
                '--text-primary': '#00ffff',
                '--accent-cyan': '#0080ff',
                '--bg-primary': '#000033'
            }
        };

        const selectedTheme = themes[theme] || themes.default;
        Object.entries(selectedTheme).forEach(([property, value]) => {
            document.documentElement.style.setProperty(property, value);
        });
    }

    // Hacking Sequence Easter Egg
    function initiateHackingSequence() {
        const messages = [
            'ACCESSING MAINFRAME...',
            'BYPASSING FIREWALL...',
            'INJECTING PAYLOAD...',
            'EXTRACTING DATA...',
            'HACK COMPLETE! Just kidding :)'
        ];

        messages.forEach((msg, index) => {
            setTimeout(() => {
                displayOutput(msg);
            }, index * 1000);
        });
    }

    // Sound Effects (Optional)
    function playSound(type) {
        // Implement sound effects here if desired
        // const audio = new Audio(`/assets/sounds/${type}.mp3`);
        // audio.play();
    }

    // Konami Code Easter Egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateKonamiCode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateKonamiCode() {
        displayOutput('🎮 KONAMI CODE ACTIVATED! You unlocked the secret mode!');
        document.body.style.animation = 'rainbow 2s linear infinite';
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            style.remove();
        }, 10000);
    }

    // Blog Post Data
    const blogPosts = {
        'readable-code': {
            title: 'The Art of Readable Code',
            date: '2024.03.10',
            content: `
<span class="comment">// Writing code that humans can understand</span>

Code is read far more often than it's written. We spend 90% of our time reading code 
and only 10% writing it. Yet we optimize for the 10%.

<span class="keyword">Key Principles:</span>
• <span class="string">Naming:</span> Use clear, descriptive names that reveal intent
• <span class="string">Functions:</span> Each function should do one thing, do it well, and do it only
• <span class="string">Comments:</span> Explain WHY, not WHAT - the code should explain what
• <span class="string">Structure:</span> Use whitespace and organization to create visual hierarchy

<span class="keyword">Example:</span>
<span class="comment">// Bad - unclear naming, does too much</span>
function calc(x, y) {
    return x * 0.1 + y * 0.05;
}

<span class="comment">// Good - clear intent, single responsibility</span>
function calculateTotalTax(stateTax, federalTax) {
    const STATE_TAX_RATE = 0.1;
    const FEDERAL_TAX_RATE = 0.05;
    return stateTax * STATE_TAX_RATE + federalTax * FEDERAL_TAX_RATE;
}

Remember: Code is communication between developers across time.
Your future self is a different developer. Write for them.
            `.trim()
        },
        'performant-web': {
            title: 'Building Performant Web Applications',
            date: '2024.02.20',
            content: `
<span class="comment">// Performance as a foundation, not an afterthought</span>

Performance isn't a feature—it's the foundation upon which great user experiences are built.
A 100ms delay can reduce conversion rates by 7%.

<span class="keyword">Performance Budget:</span>
• Time to Interactive: < 3 seconds on 3G
• First Contentful Paint: < 1 second
• JavaScript bundle: < 100KB gzipped
• CSS: < 10KB
• Lighthouse score: > 95

<span class="keyword">Key Strategies:</span>
1. <span class="string">Start with HTML:</span> Semantic, minimal, no JS required
2. <span class="string">Progressive Enhancement:</span> Core functionality without JavaScript
3. <span class="string">Optimize Images:</span> WebP, lazy loading, responsive images
4. <span class="string">Cache First:</span> Service workers for instant repeat visits

<span class="keyword">Code Example:</span>
<span class="comment">// Lazy loading with Intersection Observer</span>
if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

Build fast by default. Optimize from the start. 
Treat performance as a feature—because to your users, it absolutely is.
            `.trim()
        },
        'simplicity-design': {
            title: 'On Simplicity in Design',
            date: '2024.01.15',
            content: `
<span class="comment">// The profound impact of simplicity in digital design</span>

In an era of endless complexity and feature creep, the pursuit of simplicity 
has become both a rebellion and a necessity.

<span class="keyword">Learning from Masters:</span>
• <span class="string">Scandinavian Design:</span> Functionality first, natural materials, light and space
• <span class="string">Swiss Typography:</span> Grid systems, sans-serif clarity, objective photography
• <span class="string">German Engineering:</span> Precision, reliability, documentation as design

<span class="keyword">The Cost of Complexity:</span>
Every additional feature increases cognitive load exponentially.
The best designs recognize this and make deliberate choices.

<span class="keyword">Practical Simplicity:</span>
1. Understanding the core problem
2. Progressive disclosure of complexity
3. Sensible defaults for common cases
4. Escape hatches for power users

<span class="keyword">The Courage to Say No:</span>
Perhaps the hardest part of pursuing simplicity is saying no.
• No to the feature that 5% of users might want
• No to the clever animation that adds 50KB
• No to the framework that adds complexity

Every "no" is actually a "yes" to focus, performance, and user experience.

<span class="comment">// Simplicity isn't minimalism for its own sake</span>
<span class="comment">// It's about respecting both the user's time and intelligence</span>
            `.trim()
        }
    };

    // Toggle Blog Post Function
    window.toggleBlogPost = function(postId) {
        const entry = document.querySelector(`[data-post="${postId}"]`);
        const content = entry.querySelector('.blog-content');
        const excerpt = entry.querySelector('.blog-excerpt');
        
        if (content.classList.contains('expanded')) {
            // Collapse
            entry.classList.remove('expanded');  // Remove expanded class from parent
            content.classList.remove('expanded');
            content.classList.add('collapsed');
            content.innerHTML = '';
            excerpt.style.display = 'block';
        } else {
            // Expand
            entry.classList.add('expanded');  // Add expanded class to parent
            content.classList.remove('collapsed');
            content.classList.add('expanded');
            content.innerHTML = `<pre class="blog-post-content">${blogPosts[postId].content}</pre>
                                <div class="blog-post-footer">
                                    <span class="blog-hint">[Click title to collapse]</span>
                                </div>`;
            excerpt.style.display = 'none';
            
            // Scroll to post
            entry.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();