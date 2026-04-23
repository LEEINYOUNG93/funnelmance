// ==============================
// Funnelmance - Main Script
// ==============================

document.addEventListener('DOMContentLoaded', function () {

    // ===== KV 인트로 애니메이션 =====
    initKvIntro();

    // ===== 스크롤 진입 애니메이션 =====
    initScrollAnimations();

    // ===== GNB 섹션 네비게이션 =====
    initGnbNav();

    // ===== Capabilities 클릭 인터랙션 =====
    var capItems = document.querySelectorAll('.cap_list > li');
    capItems.forEach(function (item) {
        var link = item.querySelector('.cap_link');
        if (!link) return;
        link.addEventListener('click', function (e) {
            e.preventDefault();
            capItems.forEach(function (el) {
                el.classList.remove('cap_active');
                var hover = el.querySelector('.hover');
                if (hover) hover.style.display = 'none';
            });
            item.classList.add('cap_active');
            var hover = item.querySelector('.hover');
            if (hover) hover.style.display = 'block';
        });
        var btnClose = item.querySelector('.btn_close');
        if (btnClose) {
            btnClose.addEventListener('click', function (e) { e.preventDefault(); });
        }
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

});


// ==============================
// KV 인트로 애니메이션
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

    if (window.innerWidth <= 768) {
        kvSection.classList.add('on', 'trans_off');
        header.classList.add('on');
        return;
    }

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
            // 2400ms가 아니라 조금 더 앞당겨서(약 2100ms) 이동을 시작하면 훨씬 매끄럽습니다.
            setTimeout(function () {
                // 스크롤 이동 실행
                performCustomScroll(aboutSection.offsetTop, 1000); // 1.5초 동안 아주 천천히 이동
                
                kvSection.classList.add('trans_off');
                history.replaceState(null, '', '#about');
            }, 2400); 
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
    if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.animate').forEach(function (el) {
            el.classList.add('animated');
        });
        var sf = document.querySelector('.s-focus');
        var sw = document.querySelector('.s-worldwide');
        if (sf) sf.classList.add('on');
        if (sw) sw.classList.add('on');
        return;
    }

    // 일반 .animate 요소: 15% 진입 시 animated 추가
    var animObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.animate').forEach(function (el) {
        animObserver.observe(el);
    });

    // s-focus / s-worldwide: 30% 진입 시 on 추가 (차트·지도 애니메이션)
    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    var focusEl = document.querySelector('.s-focus');
    var worldwideEl = document.querySelector('.s-worldwide');
    if (focusEl) sectionObserver.observe(focusEl);
    if (worldwideEl) sectionObserver.observe(worldwideEl);
}
