// ==============================
// Funnelmance - Main Script
// ==============================

var globalChart = null;

document.addEventListener('DOMContentLoaded', function () {

    // ===== 인트로 애니메이션 =====
    initKvIntro();

    // ===== GNB 섹션 네비게이션 =====
    initGnbNav();

    // ===== organizational섹션 Hover =====
    organizationalHover();

    // ===== organizational섹션 스와이퍼 =====
    initFunnelSwiper();

    // ===== 세계 지도 초기화 =====
    // initScrollAnimations는 initGlobalMap 내에서 호출됨
    initGlobalMap();


    // ===== 클릭 인터랙션 - Capabilities =====
    const capItems = document.querySelectorAll('.cap_list > li');
    capItems.forEach((item) => {
        const link = item.querySelector('.cap_link');
        const btnClose = item.querySelector('.btn_close');

        link?.addEventListener('click', (e) => {
            e.preventDefault();
            capItems.forEach(el => el.classList.remove('cap_active'));
            item.classList.add('cap_active');
        });

        // 닫기 버튼을 눌렀을 때 닫히는 로직이 필요하다면 추가
        btnClose?.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 이벤트 전파 방지
            item.classList.remove('cap_active');
        });
    });

    // ===== 클릭 인터랙션 - Organizational =====
    var orgItems = document.querySelectorAll('.organizational-list > li');
    orgItems.forEach(function (item) {
        var topBox = item.querySelector('.top-bx');
        if (!topBox) return;
        topBox.addEventListener('click', function (e) {
            e.preventDefault();
            orgItems.forEach(function (el) {
                el.classList.remove('organizational_active');
            });
            item.classList.add('organizational_active');
        });
    });

    // ===== 파일 첨부 버튼 =====
    var fileInput = document.getElementById('file');
    var fileNameInput = document.getElementById('fileName');
    if (fileInput && fileNameInput) {
        fileInput.addEventListener('change', function () {
            if (this.files && this.files[0]) {
                fileNameInput.value = this.files[0].name;
            }
        });
    }

    // ===== 의뢰 유형 선택 시 필드셋 활성화 =====
    var reqType = document.getElementById('req_type');
    var advField = document.getElementById('adv_agency_field');
    if (reqType && advField) {
        reqType.addEventListener('change', function () {
            if (this.value !== '') {
                advField.removeAttribute('disabled');
            } else {
                advField.setAttribute('disabled', true);
            }
        });
    }

    // ===== Header 스크롤 숨김/보임 =====
    var header = document.querySelector('.header');
    var lastScrollTop = 0;
    var headerHidden = false;
    if (header) {
        window.addEventListener('scroll', function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 스크롤 내릴 때 header 숨기기
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                if (!headerHidden) {
                    header.style.transform = 'translateY(-100%)';
                    headerHidden = true;
                }
            }
            // 스크롤 올릴 때 header 보이기
            else {
                if (headerHidden) {
                    header.style.transform = 'translateY(0)';
                    headerHidden = false;
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        });
        header.style.transition = 'transform 0.3s ease';
    }

    // ===== 햄버거 메뉴 토글 =====
    var hamburgerBtn = document.querySelector('.header_burger');
    var headerGnb = document.querySelector('.header_gnb');
    if (hamburgerBtn && headerGnb) {
        // 햄버거 버튼 클릭 시 메뉴 토글
        hamburgerBtn.addEventListener('click', function () {
            hamburgerBtn.classList.toggle('active');
            headerGnb.classList.toggle('active');

            // 메뉴 열림/닫힘에 따라 스크롤 제어
            if (hamburgerBtn.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // GNB 메뉴 아이템 클릭 시 메뉴 닫기
        var gnbItems = document.querySelectorAll('.header_gnb .gnb_item');
        gnbItems.forEach(function (item) {
            item.addEventListener('click', function () {
                hamburgerBtn.classList.remove('active');
                headerGnb.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== TOP 버튼 =====
    var topBtn = document.querySelector('.top a');
    if (topBtn) {
        topBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    var topEl = document.querySelector('.top');
    if (topEl) {
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                topEl.style.opacity = '1';
                topEl.style.visibility = 'visible';
            } else {
                topEl.style.opacity = '0';
                topEl.style.visibility = 'hidden';
            }
        });
        topEl.style.opacity = '0';
        topEl.style.visibility = 'hidden';
        topEl.style.transition = 'opacity 0.3s, visibility 0.3s';
    }

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1500,
            easing: 'ease-out-back',
            once: true,
            offset: 100,
        });
    }
});


// ==============================
// 인트로 애니메이션
// ==============================
function initKvIntro() {
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    var kvSection = document.querySelector('.s-intro');
    var header = document.querySelector('.header');
    var aboutSection = document.getElementById('about');

    if (!kvSection || !header || !aboutSection) return;

    // 초기 상태 잠금
    document.body.style.overflow = 'hidden';

    var introStarted = false;

    // 인트로 시작 함수
    function startIntro() {
        if (introStarted) return;
        introStarted = true;

        setTimeout(function () {
            header.classList.add('on');
            kvSection.classList.add('on');

            // ── 핵심 포인트: 애니메이션과 이동을 완전히 겹치기
            setTimeout(function () {
                // 스크롤 이동 실행
                performCustomScroll(aboutSection.offsetTop, 1000);

                kvSection.classList.add('trans_off');
                history.replaceState(null, '', '#about');
            }, 2200);
        }, 500);
    }

    // 가속도 커스텀 함수 (Ease-Out 방식)
    function performCustomScroll(targetY, duration) {
        // overflow 해제를 먼저 해야 scrollTo가 실제로 적용됨
        document.body.style.overflow = '';
        // html scroll-behavior: smooth와 충돌하면 각 rAF 호출이 개별 smooth로 처리되어 끊김 발생 → 잠시 비활성화
        document.documentElement.style.scrollBehavior = 'auto';

        var startY = window.pageYOffset;
        var difference = targetY - startY;
        var startTime = performance.now();

        function step(currentTime) {
            var progress = Math.min((currentTime - startTime) / duration, 1);
            // Quintic Ease Out
            var ease = 1 - Math.pow(1 - progress, 5);
            window.scrollTo(0, startY + difference * ease);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                // 애니메이션 완료 후 smooth 복원
                document.documentElement.style.scrollBehavior = '';
            }
        }
        requestAnimationFrame(step);
    }

    // 이미지 로드 체크
    var kvImg = kvSection.querySelector('.layer02 img');
    if (kvImg && !kvImg.complete) {
        kvImg.addEventListener('load', startIntro);
    } else {
        startIntro();
    }
}


// ==============================
// GNB 섹션 네비게이션
// - 클릭 시 해당 섹션으로 스크롤 + URL 해시 업데이트
// - 스크롤 시 현재 섹션에 맞게 active 상태 + URL 해시 업데이트
// ==============================
function initGnbNav() {
    var gnbItems = document.querySelectorAll('.header_gnb .gnb_item');
    if (!gnbItems.length) return;

    // 각 gnb_item이 가리키는 섹션 요소 수집
    var sections = [];
    gnbItems.forEach(function (item) {
        var sectionId = item.getAttribute('data-section');
        var el = document.getElementById(sectionId);
        if (el) sections.push({ id: sectionId, el: el, navItem: item });
    });

    // ── 클릭: 해당 섹션으로 부드럽게 스크롤 (브라우저가 href 처리)
    //    href="#id" 링크이므로 브라우저가 scroll-behavior: smooth + URL 갱신 자동 처리
    //    → 별도 preventDefault 없이 기본 동작 활용

    // ── 스크롤: IntersectionObserver로 현재 섹션 감지 → active + URL 해시
    if (!('IntersectionObserver' in window)) return;

    // 인트로 완료 전에는 해시 업데이트 하지 않음
    var introComplete = false;
    setTimeout(function () { introComplete = true; }, 4000); // 인트로 종료(3.8s) + 여유

    var activeSection = sections[0] ? sections[0].id : null;

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;

                // active 클래스 갱신
                gnbItems.forEach(function (item) {
                    item.classList.toggle('active', item.getAttribute('data-section') === id);
                });

                // URL 해시 갱신 (인트로 완료 후에만)
                if (introComplete && id !== activeSection) {
                    activeSection = id;
                    history.replaceState(null, '', '#' + id);
                }
            }
        });
    }, {
        threshold: 0,
        rootMargin: '-40% 0px -50% 0px' // 뷰포트 중간 지점 기준으로 섹션 감지
    });

    sections.forEach(function (s) {
        sectionObserver.observe(s.el);
    });
}


// ==============================
// 스크롤 진입 애니메이션 (IntersectionObserver)
// ==============================
function initScrollAnimations() {
    console.log("🔍 initScrollAnimations called");

    // 1. 하위 호환성 체크 (브라우저가 IntersectionObserver를 지원하지 않을 때)
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animate').forEach(function (el) {
            el.classList.add('animated');
        });
        var sf = document.querySelector('.s-focus');
        var sw = document.querySelector('.s-global');
        if (sf) sf.classList.add('on');
        if (sw) {
            sw.classList.add('on');
            playMapAnimation(); // 하위 호환성용 실행
        }
        return;
    }

    // 2. 공통 옵션 설정: 섹션이 뷰포트 바닥에 '닿는 순간' 바로 실행
    var touchOption = {
        threshold: 0,      // 요소가 1픽셀이라도 보이면 바로 실행
        rootMargin: '0px'  // 여백 없이 정확히 뷰포트 경계선 기준
    };

    // 3. 일반 .animate 요소 관찰자
    var animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animObserver.unobserve(entry.target);
            }
        });
    }, touchOption);

    document.querySelectorAll('.animate').forEach(function (el) {
        animObserver.observe(el);
    });

    // 4. s-focus / s-global 섹션 관찰자
    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                console.log("📌 Section entered:", entry.target.className);
                entry.target.classList.add('on');

                // s-global은 별도의 Observer에서 처리하므로 여기서는 스킵
                if (!entry.target.classList.contains('s-global')) {
                    sectionObserver.unobserve(entry.target);
                }
            }
        });
    }, touchOption);

    // s-focus 관찰 (기존 방식)
    var focusEl = document.querySelector('.s-focus');
    if (focusEl) sectionObserver.observe(focusEl);

    // s-global 관찰 (섹션 중간에서 트리거)
    var globalMapAnimationTriggered = false;
    var globalObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !globalMapAnimationTriggered) {
                console.log("🌍 s-global section 50% visible, triggering animation");
                globalMapAnimationTriggered = true;
                entry.target.classList.add('on');
                playMapAnimation();
                globalObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5  // 섹션의 50%가 보일 때 트리거
    });

    var globalEl = document.querySelector('.s-global');
    if (globalEl) globalObserver.observe(globalEl);
}

function organizationalHover() {
    // 모바일(767px 이하)에서는 실행하지 않음
    if (window.innerWidth <= 767) {
        return;
    }

    const listItems = document.querySelectorAll('.organizational-list > li');
    let currentIndex = 0;
    let autoPlay = null;

    // 활성화 함수
    const activateItem = (index) => {
        listItems.forEach(li => li.classList.remove('organizational_active'));
        listItems[index].classList.add('organizational_active');
        currentIndex = index;
    };

    // 자동 재생 시작 함수 (3초 주기)
    const startAutoPlay = () => {
        if (autoPlay) return; // 이미 실행 중이면 중복 방지
        autoPlay = setInterval(() => {
            let nextIndex = (currentIndex + 1) % listItems.length;
            activateItem(nextIndex);
        }, 3000);
    };

    // 자동 재생 중지 함수
    const stopAutoPlay = () => {
        clearInterval(autoPlay);
        autoPlay = null;
    };

    // 초기 실행
    activateItem(0);
    startAutoPlay();

    // 이벤트 바인딩
    listItems.forEach((item, index) => {
        // 마우스 올리면 해당 아이템 활성화 + 자동 재생 정지
        item.addEventListener('mouseenter', () => {
            stopAutoPlay();
            activateItem(index);
        });

        // 마우스 떼면 자동 재생 다시 시작
        item.addEventListener('mouseleave', () => {
            startAutoPlay();
        });
    });
}

function initFunnelSwiper() {
    const el = document.querySelector('.funnel-company');
    if (!el) return;

    new Swiper(el, {
        slidesPerView: 2,
        spaceBetween: 10,
        loop: true,

        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },

        speed: 600,

        navigation: {
            nextEl: '.funnel-company .btn-next',
            prevEl: '.funnel-company .btn-prev',
        },

        breakpoints: {
            1024: {
                slidesPerView: 3,
            },
            1440: {
                slidesPerView: 4,
            }
        }
    });
}


// ==============================
// Helper: 요소가 뷰포트에 보이는지 확인
// ==============================
function isElementInViewport(el) {
    if (!el) return false;
    var rect = el.getBoundingClientRect();
    return (
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0
    );
}

// ==============================
// 세계 지도 - ECharts 초기화
// ==============================
function initGlobalMap() {
    var chartDom = document.getElementById('chartdiv');
    if (!chartDom) return;
    if (typeof echarts === 'undefined') return;

    globalChart = echarts.init(chartDom, null, { renderer: 'canvas' });

    // GeoJSON 데이터 로드
    fetch('https://fastly.jsdelivr.net/npm/echarts@4.9.0/map/json/world.json')
        .then(function (response) {
            return response.json();
        })
        .then(function (worldGeoJson) {
            echarts.registerMap('world', worldGeoJson);
            setupMapChart(globalChart);
            initScrollAnimations();
        })
        .catch(function (error) {
            console.error('Failed to load world map:', error);
        });
}

// ECharts 맵 설정 및 옵션 구성
function setupMapChart(myChart) {
    var isMobile = window.innerWidth <= 767;

    // 모바일/PC 분기 값
    var seoulSize    = isMobile ? 8  : 12;
    var citySize     = isMobile ? 6  : 4;
    var labelSize    = isMobile ? 10  : 8;
    var labelOffset  = isMobile ? [0, 8] : [0, 15];
    var rippleScale  = isMobile ? 2  : 3;
    var arrowSize    = isMobile ? 8  : 14;
    var lineWidth    = isMobile ? 1.5 : 2.5;

    // 모바일: center는 미국~아시아 중간 유지, zoom만 올려 도시 간 픽셀 거리 확보
    var geoCenter = isMobile ? [15, 28] : [20, 30];
    var geoZoom   = isMobile ? 1.5 : 1.2;

    var option = {
        backgroundColor: '#050c1a',
        geo: {
            map: 'world',
            roam: false,
            center: geoCenter,
            zoom: geoZoom,
            itemStyle: {
                areaColor: '#0d1b2e',
                borderColor: '#1a2a45',
                borderWidth: 0.5
            },
            emphasis: {
                disabled: true
            }
        },
        series: [
            // 포인트 (EffectScatter - 서울 포함)
            {
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: [
                    {
                        name: 'SEOUL', value: [126.97, 37.56],
                        // 조명효과: 강한 글로우 + 테두리
                        itemStyle: {
                            color: '#00e5ff',
                            borderColor: 'rgba(0, 229, 255, 0.55)',
                            borderWidth: isMobile ? 4 : 6,
                            shadowBlur: isMobile ? 30 : 50,
                            shadowColor: 'rgba(0, 229, 255, 0.9)'
                        },
                        label: {
                            position: 'top',
                            offset: [0, isMobile ? -6 : -10],
                            backgroundColor: 'rgba(0, 20, 40, 0.75)',
                            borderColor: 'rgba(0, 229, 255, 0.7)',
                            borderWidth: 1,
                            borderRadius: 3,
                            padding: isMobile ? [2, 5] : [3, 8],
                            shadowBlur: isMobile ? 6 : 10,
                            shadowColor: 'rgba(0, 229, 255, 0.6)'
                        }
                    },
                    {
                        name: 'U.S.A', value: [-95.71, 37.09], itemStyle: { color: '#00e5ff' },
                        label: { position: 'bottom', offset: [0, isMobile ? 4 : 6] }
                    },
                    {
                        // 베트남: 모바일=좌측, PC=왼쪽+아래
                        name: 'VIETNAM', value: [108.27, 14.05], itemStyle: { color: '#00e5ff' },
                        label: {
                            position: 'left',
                            offset: isMobile ? [-8, 0] : [-8, 18]
                        }
                    },
                    {
                        // 홍콩: 모바일=우측, PC=아래+왼쪽
                        name: 'HONG KONG', value: [114.17, 22.31], itemStyle: { color: '#00e5ff' },
                        label: {
                            position: isMobile ? 'right' : 'bottom',
                            offset: isMobile ? [8, 0] : [-38, 6]
                        }
                    },
                    {
                        // 대만: 모바일=위 오른쪽, PC=오른쪽 위
                        name: 'TAIWAN', value: [121.56, 25.03], itemStyle: { color: '#00e5ff' },
                        label: {
                            position: isMobile ? 'top' : 'top',
                            offset: isMobile ? [-20, 0] : [26, -6]
                        }
                    }
                ],
                symbolSize: function (val, params) {
                    return params.name === 'SEOUL' ? seoulSize : citySize;
                },
                itemStyle: {
                    color: '#00e5ff',
                    shadowBlur: 12,
                    shadowColor: 'rgba(0, 229, 255, 0.6)'
                },
                label: {
                    show: true,
                    fontSize: labelSize,
                    color: '#ffffff',
                    formatter: '{b}'
                },
                rippleEffect: {
                    brushType: 'stroke',
                    scale: rippleScale,
                    period: 4
                },
                hoverAnimation: true,
                zlevel: 1
            },
            // 라인 (Lines with effect - 애니메이션 화살표)
            {
                type: 'lines',
                coordinateSystem: 'geo',
                effect: {
                    show: false,
                    period: 4,
                    symbol: 'arrow',
                    symbolSize: arrowSize,
                    color: '#ff9a56',
                    trailLength: 0.4
                },
                lineStyle: {
                    color: '#ff6b35',
                    width: lineWidth,
                    opacity: 0.8
                },
                data: [
                    {
                        fromName: 'SEOUL',
                        toName: 'U.S.A',
                        coords: [[126.97, 37.56], [-95.71, 37.09]],
                        lineStyle: { curveness: 0.2, color: '#ff6b35', width: lineWidth, opacity: 0.8 }
                    },
                    {
                        fromName: 'SEOUL',
                        toName: 'VIETNAM',
                        coords: [[126.97, 37.56], [108.27, 14.05]],
                        lineStyle: { curveness: -0.3, color: '#ff3d77', width: lineWidth, opacity: 0.8 }
                    },
                    {
                        fromName: 'SEOUL',
                        toName: 'HONG KONG',
                        coords: [[126.97, 37.56], [114.17, 22.31]],
                        lineStyle: { curveness: 0.5, color: '#ff1e6c', width: lineWidth, opacity: 0.9 }
                    },
                    {
                        fromName: 'SEOUL',
                        toName: 'TAIWAN',
                        coords: [[126.97, 37.56], [121.56, 25.03]],
                        lineStyle: { curveness: -0.5, color: '#ff4e90', width: lineWidth, opacity: 0.9 }
                    }
                ],
                zlevel: 0
            }
        ]
    };

    myChart.setOption(option);

    // 화면 리사이즈 시 차트 다시 그리기
    window.addEventListener('resize', function () {
        myChart.resize();
    });
}

// 라인 애니메이션 함수 (진입 시 라인 애니메이션 활성화)
function playMapAnimation() {
    if (!globalChart) return;

    console.log("🔨 Starting map line animation...");

    var arrowSize = window.innerWidth <= 767 ? 8 : 14;

    // ECharts의 lines series effect 활성화
    var option = {
        series: [
            // index 0: effectScatter (포인트) - 변경 없음
            {},
            // index 1: lines (라인) - effect 활성화
            {
                type: 'lines',
                effect: {
                    show: true,
                    period: 4,
                    symbol: 'arrow',
                    symbolSize: arrowSize,
                    color: '#ff9a56',
                    trailLength: 0.4
                }
            }
        ]
    };

    // 약간의 지연 후 애니메이션 시작
    setTimeout(function () {
        globalChart.setOption(option, { lazyUpdate: true });
    }, 300);
}

