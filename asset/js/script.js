// ==============================
// Funnelmance - Main Script
// ==============================

var globalMapLines = [];
var globalLineSeries = null;
var globalPointSeries = null;

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
    console.log("🔍 initScrollAnimations called, globalMapLines count:", globalMapLines.length);

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
// 세계 지도 - AmCharts 초기화
// ==============================
function initGlobalMap() {
    if (typeof am5 === 'undefined') return;

    am5.ready(function () {
        var root = am5.Root.new("chartdiv");
        root.setThemes([am5themes_Animated.new(root)]);

        var chart = root.container.children.push(am5map.MapChart.new(root, {
            panX: "none", panY: "none", wheelX: "none", wheelY: "none",
            projection: am5map.geoMercator()
        }));

        var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {
            geoJSON: am5geodata_worldLow,
            exclude: ["AQ"]
        }));

        polygonSeries.mapPolygons.template.setAll({
            fill: am5.color(0x1a2233),
            stroke: am5.color(0x2a334d),
            strokeWidth: 0.5
        });

        var pointSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));
        pointSeries.bullets.push(function (root, series, dataItem) {
            var container = am5.Container.new(root, {});
            var dataContext = dataItem.dataContext;

            // 모바일 여부 확인
            var isMobile = window.innerWidth <= 767;
            var dotRadius = isMobile ? 3 : 5; // 모바일: 3, 데스크톱: 5

            // --- 1. 서울 전용 2색 파동 효과 (Pulsing Effect) ---
            if (dataContext.id === "seoul") {
                // 첫 번째 색상 (내부 - 밝은 하늘색)
                createPulsingCircle(root, container, 0x00e5ff, 2000, 0);
                // 두 번째 색상 (외부 - 보라색으로 구별되게)
                createPulsingCircle(root, container, 0xaa00ff, 2500, 500); // 0.5초 뒤에 시작
            }

            // --- 2. 기본 도트 (중앙점) ---
            var mainCircle = container.children.push(am5.Circle.new(root, {
                radius: dotRadius,
                fill: am5.color(0x00e5ff),
                stroke: am5.color(0xffffff),
                strokeWidth: isMobile ? 1 : 2,
                shadowColor: am5.color(0x00e5ff),
                shadowBlur: isMobile ? 5 : 10
            }));

            // --- 3. 레이블 가독성 최적화 ---
            var label = container.children.push(am5.Label.new(root, {
                text: dataContext.id === "seoul" ? "[bold]{title}[/]\n[fontSize:10][/]" : "{title}",
                fill: am5.color(0xffffff),
                fontSize: 11,
                centerY: am5.p50,
                centerX: getLabelCenterX(dataContext.id), // 도시별 좌우 정렬 최적화
                x: getLabelXOffset(dataContext.id),       // 도시별 가로 위치 조정
                y: dataContext.dy || 0,
                populateText: true
            }));

            return am5.Bullet.new(root, { sprite: container });
        });

        // 파동 생성 헬퍼 함수
        function createPulsingCircle(root, container, color, duration, delay) {
            var circle = container.children.push(am5.Circle.new(root, {
                radius: 12,
                fill: am5.color(color),
                fillOpacity: 0.4,
                strokeOpacity: 0
            }));

            setTimeout(() => {
                circle.animate({ key: "scale", from: 1, to: 4, duration: duration, loops: Infinity, easing: am5.ease.out(am5.ease.quad) });
                circle.animate({ key: "opacity", from: 0.4, to: 0, duration: duration, loops: Infinity, easing: am5.ease.out(am5.ease.quad) });
            }, delay);
        }

        // 가독성을 위한 레이블 위치 제어 함수
        function getLabelCenterX(id) {
            if (id === "hongkong" || id === "vietnam") return am5.p100; // 왼쪽으로 정렬 (텍스트가 점의 왼쪽에 위치)
            if (id === "taiwan") return am5.p0; // 오른쪽으로 정렬
            return am5.p50; // 중앙
        }

        function getLabelXOffset(id) {
            if (id === "hongkong" || id === "vietnam") return -12; // 점의 왼쪽으로 밀기
            if (id === "taiwan") return 12; // 점의 오른쪽으로 밀기
            return 0;
        }
        var cities = [
            { id: "seoul", title: "SEOUL", dx: 0, dy: -35, geometry: { type: "Point", coordinates: [126.97, 37.56] } },
            { id: "usa", title: "USA", dx: 0, dy: 35, geometry: { type: "Point", coordinates: [-95.71, 37.09] } },
            { id: "vietnam", title: "VIETNAM", dx: -60, dy: 20, geometry: { type: "Point", coordinates: [108.27, 14.05] } },
            { id: "hongkong", title: "HONGKONG", dx: -60, dy: -15, geometry: { type: "Point", coordinates: [114.16, 22.31] } },
            { id: "taiwan", title: "TAIWAN", dx: 60, dy: 10, geometry: { type: "Point", coordinates: [121.96, 23.69] } }
        ];

        var lineSeries = chart.series.push(am5map.MapLineSeries.new(root, {}));
        lineSeries.mapLines.template.setAll({
            stroke: am5.color(0x00e5ff),
            strokeWidth: 1.5,
            strokeOpacity: 0
        });

        // 전역 변수에 할당 (playMapAnimation에서 사용)
        globalPointSeries = pointSeries;
        globalLineSeries = lineSeries;

        function createLine(fromId, toId) {
            var fromDataItem = pointSeries.getDataItemById(fromId);
            var toDataItem = pointSeries.getDataItemById(toId);

            if (!fromDataItem || !toDataItem) return;

            var lineDataItem = lineSeries.pushDataItem({ pointsToConnect: [fromDataItem, toDataItem] });
            var mapLine = lineDataItem.get("mapLine");

            mapLine.set("lineType", "arc");

            // 핵심 설정: 초기에는 투명도를 1로 두되, 점선(dash)을 길게 설정해서 숨깁니다.
            mapLine.setAll({
                strokeOpacity: 0, // 처음엔 아예 안 보이게
                strokeDasharray: [1000, 1000], // 아주 긴 점선
                strokeDashoffset: 1000 // 점선의 시작점을 뒤로 밀어서 안 보이게 함
            });

            globalMapLines.push(mapLine);
        }

        // datavalidated 이벤트: 라인은 나중에 생성, 차트만 초기화
        pointSeries.events.on("datavalidated", function () {
            console.log("📍 pointSeries datavalidated event fired");

            // 차트 나타나기
            chart.appear(1000, 100);

            // 스크롤 애니메이션 초기화 (IntersectionObserver attach)
            initScrollAnimations();

            // 라인은 여기서 생성하지 않음 - playMapAnimation에서만 생성
        });

        // 데이터 설정 (이벤트 리스너 이후)
        pointSeries.data.setAll(cities);
    });
}

// 라인 애니메이션 함수 (진입 시 라인 생성 + 애니메이션)
function playMapAnimation() {
    // 라인이 아직 생성되지 않았으면 생성
    if (globalMapLines.length === 0) {
        console.log("🔨 Creating lines on section entry...");

        // createLine 함수 재정의 (전역 series 사용)
        function createLine(fromId, toId) {
            var fromDataItem = globalPointSeries.getDataItemById(fromId);
            var toDataItem = globalPointSeries.getDataItemById(toId);

            if (!fromDataItem || !toDataItem) return;

            var lineDataItem = globalLineSeries.pushDataItem({ pointsToConnect: [fromDataItem, toDataItem] });
            var mapLine = lineDataItem.get("mapLine");

            mapLine.set("lineType", "arc");
            mapLine.setAll({
                strokeOpacity: 0,
                strokeDasharray: [1000, 1000],
                strokeDashoffset: 1000
            });

            globalMapLines.push(mapLine);
        }

        // 라인 생성 (서울은 출발점이므로 포함하지 않음)
        createLine("seoul", "usa");
        createLine("seoul", "vietnam");
        createLine("seoul", "hongkong");
        createLine("seoul", "taiwan");
        console.log("✅ Lines created on entry, count:", globalMapLines.length);
    }

    // 라인 애니메이션 실행
    globalMapLines.forEach(function (line, index) {
        var delay = index * 300; // 각 라인 간 300ms 간격 (200ms → 300ms)

        setTimeout(function () {
            // 1. 투명도 애니메이션
            line.animate({
                key: "strokeOpacity",
                from: 0,
                to: 0.7,
                duration: 1000,
                easing: am5.ease.out(am5.ease.quad)
            });

            // 2. 그려지는 애니메이션 (DashOffset을 0으로)
            line.animate({
                key: "strokeDashoffset",
                from: 1000,
                to: 0,
                duration: 2500, // 1800ms → 2500ms (더 천천히)
                easing: am5.ease.out(am5.ease.cubic)
            });
        }, delay);
    });
}

