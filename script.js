// 展示区域滚动功能
function scrollShowcase(rowIndex, scrollAmount) {
    const showcaseRows = document.querySelectorAll('.showcase-row');
    const currentRow = showcaseRows[rowIndex];
    currentRow.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

// 初始化AOS动画库
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        disable: window.innerWidth < 768
    });

    // 标语切换效果
    const slogans = document.querySelectorAll('.slogan-container .subtitle');
    let currentSlogan = 0;

    function switchSlogan() {
        slogans.forEach(slogan => slogan.classList.remove('current'));
        currentSlogan = (currentSlogan + 1) % slogans.length;
        slogans[currentSlogan].classList.add('current');
    }

    setInterval(switchSlogan, 3000);
});

// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;
let isScrollingUp = false;

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop) {
        if (!isScrollingUp) {
            navbar.style.transform = 'translateY(-100%)';
        }
        isScrollingUp = false;
    } else {
        navbar.style.transform = 'translateY(0)';
        isScrollingUp = true;
    }
    
    lastScrollTop = scrollTop;
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 优化图片加载
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.img-container img');
    
    images.forEach(img => {
        // 创建新的Image对象预加载图片
        const tempImage = new Image();
        tempImage.src = img.src;
        
        tempImage.onload = function() {
            img.style.opacity = '1';
        };
        
        // 如果图片加载失败，显示错误提示
        tempImage.onerror = function() {
            img.style.display = 'none';
            const errorText = document.createElement('div');
            errorText.className = 'image-error';
            errorText.textContent = '图片加载失败';
            img.parentNode.appendChild(errorText);
        };
    });
});

// 响应式导航菜单
const menuToggle = document.createElement('button');
menuToggle.classList.add('menu-toggle');
menuToggle.innerHTML = '<span></span><span></span><span></span>';
document.querySelector('.navbar .container').prepend(menuToggle);

menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 功能预览悬停效果
document.querySelectorAll('.feature-preview-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        const tooltip = this.querySelector('.feature-tooltip');
        if (tooltip) {
            const rect = tooltip.getBoundingClientRect();
            if (rect.left < 0) {
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateY(0)';
            } else if (rect.right > window.innerWidth) {
                tooltip.style.left = 'auto';
                tooltip.style.right = '0';
                tooltip.style.transform = 'translateY(0)';
            }
        }
    });
});

// 页面加载动画
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// 效果展示区滚动功能
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.showcase-slider');
    
    sliders.forEach(slider => {
        const track = slider.querySelector('.showcase-track');
        const items = track.querySelectorAll('.showcase-item');
        const prev = slider.querySelector('.prev');
        const next = slider.querySelector('.next');
        
        let currentPosition = 0;
        const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
        const visibleItems = Math.floor(slider.offsetWidth / itemWidth);
        
        // 动态复制元素用于无缝循环
        function cloneItems() {
            const neededClones = Math.min(items.length, visibleItems + 1);
            
            for (let i = 0; i < neededClones; i++) {
                const clone = items[i].cloneNode(true);
                track.appendChild(clone);
            }
        }
        
        // 初始化滚动
        function initScroll() {
            track.style.transform = 'translateX(0)';
            track.style.transition = 'transform 0.5s ease';
            currentPosition = 0;
        }
        
        // 处理翻页
        function handleScroll(direction) {
            // 暂停自动滚动动画
            track.style.animation = 'none';
            
            const maxScroll = -(items.length * itemWidth);
            const scrollAmount = direction === 'next' ? -itemWidth * visibleItems : itemWidth * visibleItems;
            
            currentPosition += scrollAmount;
            
            // 处理循环
            if (direction === 'next' && currentPosition <= maxScroll) {
                currentPosition = 0;
                track.style.transition = 'none';
                track.style.transform = `translateX(0)`;
                // 触发重排以确保过渡效果正常
                track.offsetHeight;
            } else if (direction === 'prev' && currentPosition > 0) {
                currentPosition = maxScroll + itemWidth * visibleItems;
                track.style.transition = 'none';
                track.style.transform = `translateX(${currentPosition}px)`;
                track.offsetHeight;
            }
            
            track.style.transition = 'transform 0.5s ease';
            track.style.transform = `translateX(${currentPosition}px)`;
            
            // 翻页完成后恢复自动滚动
            setTimeout(() => {
                const isMobile = window.innerWidth <= 768;
                const scrollDuration = isMobile ? '60s' : '120s';
                track.style.animation = `autoScroll ${scrollDuration} linear infinite`;
                track.style.animationDelay = `${-currentPosition / maxScroll * parseFloat(scrollDuration)}s`;
            }, 500);
        }
        
        // 处理图片懒加载
        function handleLazyLoad() {
            const options = {
                root: null,
                rootMargin: '50px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, options);
            
            track.querySelectorAll('img[loading="lazy"]').forEach(img => {
                observer.observe(img);
            });
        }
        
        // 绑定翻页事件
        prev.addEventListener('click', () => handleScroll('prev'));
        next.addEventListener('click', () => handleScroll('next'));
        
        // 鼠标悬停控制
        track.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        
        track.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
        
        // 初始化
        if ('IntersectionObserver' in window) {
            handleLazyLoad();
        }
        cloneItems();
        initScroll();
        
        // 响应式处理
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // 重新计算尺寸
                const newItemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight);
                const newVisibleItems = Math.floor(slider.offsetWidth / newItemWidth);
                
                // 重置滚动条
                track.innerHTML = '';
                items.forEach(item => track.appendChild(item.cloneNode(true)));
                cloneItems();
                initScroll();
                
                if ('IntersectionObserver' in window) {
                    handleLazyLoad();
                }
            }, 250);
        });
    });
}); 