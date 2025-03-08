class FireworkAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        document.body.appendChild(this.canvas);
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createFirework(x, y) {
        const colors = ['#ff0', '#f0f', '#0ff', '#0f0', '#f00', '#00f'];
        const particleCount = 100;
        const baseSize = Math.random() * 2 + 2;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Math.random() * 8 + 4;
            const size = baseSize * (Math.random() * 0.5 + 0.5);
            
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: 1,
                size: size,
                sparkle: Math.random() > 0.5,
                sparkleSpeed: Math.random() * 0.2 + 0.1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.15;
            particle.vx *= 0.99;
            particle.alpha -= 0.01;

            if (particle.sparkle) {
                particle.size = particle.size * (1 + Math.sin(Date.now() * particle.sparkleSpeed) * 0.1);
            }

            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            if (particle.sparkle) {
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }

            this.ctx.restore();

            if (particle.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length > 0) {
            requestAnimationFrame(() => this.animate());
        } else {
            this.canvas.remove();
        }
    }

    show(x, y) {
        document.body.appendChild(this.canvas);
        this.createFirework(x, y);
        this.animate();
    }
}

class TodoAnimations {
    static init() {
        this.initCardFlip();
        this.initTodoHover();
        this.initDeleteSwipe();
        this.initCompletionCelebration();
        this.initParallaxEffect();
        this.initMagneticEffect();
    }

    static initCardFlip() {
        const todoList = document.getElementById('todoList');
        todoList.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox') {
                const li = e.target.closest('.todo-item');
                if (li) {
                    li.style.transform = 'rotateX(180deg)';
                    setTimeout(() => {
                        li.style.transform = 'rotateX(360deg)';
                        if (e.target.checked) {
                            this.celebrateCompletion(li);
                        }
                    }, 300);
                }
            }
        });
    }

    static initTodoHover() {
        const todoList = document.getElementById('todoList');
        todoList.addEventListener('mouseover', (e) => {
            const li = e.target.closest('.todo-item');
            if (li) {
                li.style.transform = 'scale(1.05) translateY(-8px) rotate3d(1, 1, 0, 2deg)';
                li.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
                li.style.filter = 'brightness(1.1)';
            }
        });

        todoList.addEventListener('mouseout', (e) => {
            const li = e.target.closest('.todo-item');
            if (li) {
                li.style.transform = 'scale(1) translateY(0) rotate3d(0, 0, 0, 0)';
                li.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                li.style.filter = 'brightness(1)';
            }
        });
    }

    static initDeleteSwipe() {
        const todoList = document.getElementById('todoList');
        let startX, currentX, initialLeft;
        let activeItem = null;

        todoList.addEventListener('touchstart', (e) => {
            const li = e.target.closest('.todo-item');
            if (li) {
                activeItem = li;
                startX = e.touches[0].clientX;
                initialLeft = 0;
                li.style.transition = 'none';
            }
        });

        todoList.addEventListener('touchmove', (e) => {
            if (activeItem) {
                currentX = e.touches[0].clientX;
                const diff = currentX - startX;
                activeItem.style.transform = `translateX(${diff + initialLeft}px)`;
            }
        });

        todoList.addEventListener('touchend', () => {
            if (activeItem) {
                activeItem.style.transition = 'transform 0.3s ease';
                activeItem.style.transform = 'translateX(0)';
                activeItem = null;
            }
        });
    }

    static celebrateCompletion(element) {
        const rect = element.getBoundingClientRect();
        const firework = new FireworkAnimation();
        firework.show(rect.left + rect.width / 2, rect.top + rect.height / 2);
        
        // 添加完成时的缩放动画
        element.style.transition = 'transform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        element.style.transform = 'scale(1.1) rotate(2deg)';
        setTimeout(() => {
            element.style.transform = 'scale(1) rotate(0deg)';
        }, 500);
        
        // 添加彩色光晕效果
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        element.appendChild(glow);
        requestAnimationFrame(() => glow.style.opacity = '1');
        setTimeout(() => {
            glow.style.opacity = '0';
            setTimeout(() => glow.remove(), 300);
        }, 500);
    }

    static initCompletionCelebration() {
        document.addEventListener('todo-completed', (e) => {
            const { element } = e.detail;
            this.celebrateCompletion(element);
        });
    }

    static initParallaxEffect() {
        document.addEventListener('mousemove', (e) => {
            const items = document.querySelectorAll('.todo-item');
            const mouseX = e.clientX / window.innerWidth - 0.5;
            const mouseY = e.clientY / window.innerHeight - 0.5;

            items.forEach((item) => {
                const rect = item.getBoundingClientRect();
                const itemX = (rect.left + rect.width / 2) / window.innerWidth - 0.5;
                const itemY = (rect.top + rect.height / 2) / window.innerHeight - 0.5;
                const distance = Math.sqrt(Math.pow(mouseX - itemX, 2) + Math.pow(mouseY - itemY, 2));
                const intensity = Math.max(0, 1 - distance * 2);

                item.style.transform = `
                    translate3d(${mouseX * 20 * intensity}px, ${mouseY * 20 * intensity}px, 0)
                    rotate3d(${-mouseY * intensity}, ${mouseX * intensity}, 0, ${intensity * 5}deg)
                `;
            });
        });
    }

    static initMagneticEffect() {
        const buttons = document.querySelectorAll('button:not(.tab-btn)');
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = Math.max(rect.width, rect.height);
                const intensity = 1 - Math.min(distance / maxDistance, 1);

                button.style.transform = `
                    translate(${x * 0.3 * intensity}px, ${y * 0.3 * intensity}px)
                    scale(${1 + intensity * 0.1})
                `;
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = '';
            });
        });
    }
}

// 初始化动画
window.addEventListener('DOMContentLoaded', () => {
    TodoAnimations.init();
});