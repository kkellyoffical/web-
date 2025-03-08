class ParticlesAnimation {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 150; // 进一步增加粒子数量
        this.hue = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.ripples = []; // 波纹数组
        this.trails = []; // 鼠标轨迹数组
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        this.gravitationalPoints = []; // 引力点数组
        this.init();
    }

    init() {
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1';
        document.body.appendChild(this.canvas);

        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('click', (e) => this.createRipple(e.clientX, e.clientY));
        window.addEventListener('dblclick', (e) => this.createGravitationalPoint(e.clientX, e.clientY));
        
        // 监听主题切换，添加特效
        document.getElementById('themeToggle').addEventListener('click', () => this.onThemeToggle());
        
        // 监听导航项点击，添加特效
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('mouseenter', () => this.createParticleExplosion(item));
        });
        
        this.resize();
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            alpha: 1,
            maxRadius: 100
        });
    }

    onMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseX = e.clientX - rect.left;
        this.mouseY = e.clientY - rect.top;

        // 创建鼠标轨迹
        if (Math.abs(this.mouseX - this.lastMouseX) > 5 || Math.abs(this.mouseY - this.lastMouseY) > 5) {
            this.trails.push({
                x: this.mouseX,
                y: this.mouseY,
                size: Math.random() * 3 + 2,
                color: `hsla(${this.hue}, 100%, 70%, 0.8)`,
                life: 20
            });
            this.lastMouseX = this.mouseX;
            this.lastMouseY = this.mouseY;
        }

        // 粒子受鼠标影响
        this.particles.forEach(particle => {
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 180) { // 进一步增加影响范围
                const force = (180 - distance) / 180;
                particle.vx += (dx / distance) * force * 2.5;
                particle.vy += (dy / distance) * force * 2.5;
                particle.color = `hsla(${this.hue}, 100%, 70%, ${0.3 + force * 0.7})`;
                particle.size = particle.originalSize * (1 + force * 0.5);
            }
        });
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 4 + 2,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1,
                color: `hsla(${Math.random() * 360}, 70%, 70%, 0.3)`,
                originalSize: Math.random() * 4 + 2
            });
        }
    }

    createGravitationalPoint(x, y) {
        this.gravitationalPoints.push({
            x: x,
            y: y,
            radius: 150,
            strength: Math.random() * 0.5 + 0.5,
            life: 200,
            hue: this.hue
        });
    }

    createParticleExplosion(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 1;
            const size = Math.random() * 4 + 2;
            const life = 30 + Math.random() * 20;
            
            this.particles.push({
                x: centerX,
                y: centerY,
                size: size,
                originalSize: size,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: `hsla(${this.hue + Math.random() * 60}, 100%, 70%, 0.8)`,
                life: life,
                maxLife: life
            });
        }
    }

    onThemeToggle() {
        // 主题切换时的全屏特效
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.createRipple(x, y);
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.hue = (this.hue + 0.5) % 360;

        // 更新波纹
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];
            ripple.radius += 3;
            ripple.alpha -= 0.01;

            this.ctx.beginPath();
            this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${ripple.alpha})`;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            if (ripple.alpha <= 0 || ripple.radius >= ripple.maxRadius) {
                this.ripples.splice(i, 1);
            }
        }
        
        // 更新鼠标轨迹
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const trail = this.trails[i];
            trail.life--;
            
            this.ctx.beginPath();
            this.ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
            this.ctx.fillStyle = trail.color.replace('0.8', 0.8 * (trail.life / 20));
            this.ctx.fill();
            
            if (trail.life <= 0) {
                this.trails.splice(i, 1);
            }
        }
        
        // 更新引力点
        for (let i = this.gravitationalPoints.length - 1; i >= 0; i--) {
            const point = this.gravitationalPoints[i];
            point.life--;
            
            this.ctx.beginPath();
            this.ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
            this.ctx.strokeStyle = `hsla(${point.hue}, 100%, 70%, ${point.life / 200 * 0.3})`;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // 粒子受引力点影响
            this.particles.forEach(particle => {
                const dx = particle.x - point.x;
                const dy = particle.y - point.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < point.radius) {
                    const force = (point.radius - distance) / point.radius * point.strength;
                    particle.vx -= (dx / distance) * force * 0.5;
                    particle.vy -= (dy / distance) * force * 0.5;
                }
            });
            
            if (point.life <= 0) {
                this.gravitationalPoints.splice(i, 1);
            }
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;

            // 添加鼠标悬停时的大小变化
            const dx = particle.x - this.mouseX;
            const dy = particle.y - this.mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 180) {
                const scale = 1 + (180 - distance) / 180;
                particle.size = particle.originalSize * scale;
            } else {
                particle.size = particle.originalSize;
            }

            // 添加粒子连线效果
            this.particles.forEach(otherParticle => {
                if (particle !== otherParticle) {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < 100) {
                        this.ctx.beginPath();
                        this.ctx.moveTo(particle.x, particle.y);
                        this.ctx.lineTo(otherParticle.x, otherParticle.y);
                        this.ctx.strokeStyle = `hsla(${this.hue}, 100%, 70%, ${(1 - distance / 100) * 0.2})`;
                        this.ctx.lineWidth = 0.5;
                        this.ctx.stroke();
                    }
                }
            });

            // 处理粒子生命周期
            if (particle.life !== undefined) {
                particle.life--;
                if (particle.life <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }
            }

            // 边界检查和反弹
            if (particle.x < 0) {
                particle.x = 0;
                particle.vx *= -1;
            }
            if (particle.x > this.canvas.width) {
                particle.x = this.canvas.width;
                particle.vx *= -1;
            }
            if (particle.y < 0) {
                particle.y = 0;
                particle.vy *= -1;
            }
            if (particle.y > this.canvas.height) {
                particle.y = this.canvas.height;
                particle.vy *= -1;
            }

            // 绘制粒子
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // 添加粒子光晕效果
            if (Math.random() > 0.97) {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size * 1.5, 0, Math.PI * 2);
                this.ctx.strokeStyle = `hsla(${this.hue + 30}, 100%, 70%, 0.3)`;
                this.ctx.lineWidth = 0.5;
                this.ctx.stroke();
            }
            
            // 缓慢减速
            particle.vx *= 0.99;
            particle.vy *= 0.99;
        }

        requestAnimationFrame(() => this.animate());
    }
}

// 初始化粒子动画
window.addEventListener('DOMContentLoaded', () => {
    new ParticlesAnimation();
});