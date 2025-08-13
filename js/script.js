(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		setupNavbar();
		setupRevealOnScroll();
		setupTrustedByCarousel();
		setupTestimonials();
		setupCounters();
		setupContactForm();
		initProjects();
	});

	function setupNavbar() {
		const navbar = document.querySelector('.navbar');
		if (!navbar) return;
		const onScroll = () => {
			if (window.scrollY > 16) navbar.classList.add('scrolled');
			else navbar.classList.remove('scrolled');
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });

		// Smooth scroll for in-page anchors
		document.querySelectorAll('a[href^="#"]').forEach(link => {
			link.addEventListener('click', e => {
				const targetId = link.getAttribute('href');
				if (targetId.length > 1) {
					e.preventDefault();
					document.querySelector(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
				}
			});
		});
	}

	function setupRevealOnScroll() {
		const els = document.querySelectorAll('.reveal');
		if (!els.length) return;
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('in-view');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
		els.forEach(el => io.observe(el));
	}

	function setupTrustedByCarousel() {
		// Handled via CSS keyframes; duplicate the track content for seamless looping
		const track = document.querySelector('.logo-track');
		if (!track) return;
		track.innerHTML = track.innerHTML + track.innerHTML;
	}

	function setupTestimonials() {
		const track = document.querySelector('.testimonial-track');
		if (!track) return;
		const slides = Array.from(track.children);
		const dotsContainer = document.querySelector('.testi-nav');
		if (!slides.length || !dotsContainer) return;

		dotsContainer.innerHTML = '';
		slides.forEach((_, idx) => {
			const btn = document.createElement('button');
			btn.className = 'testi-btn' + (idx === 0 ? ' active' : '');
			btn.setAttribute('aria-label', 'Go to testimonial ' + (idx + 1));
			btn.addEventListener('click', () => goTo(idx));
			dotsContainer.appendChild(btn);
		});

		let index = 0;
		function goTo(i) {
			index = (i + slides.length) % slides.length;
			track.style.transform = `translateX(-${index * 100}%)`;
			dotsContainer.querySelectorAll('.testi-btn').forEach((b, bi) => b.classList.toggle('active', bi === index));
		}
		let timer = setInterval(() => goTo(index + 1), 5000);
		track.addEventListener('pointerdown', () => { clearInterval(timer); });
	}

	function setupCounters() {
		const counters = document.querySelectorAll('[data-counter]');
		if (!counters.length) return;
		const io = new IntersectionObserver((entries) => {
			entries.forEach(entry => {
				if (!entry.isIntersecting) return;
				const el = entry.target;
				const end = parseInt(el.getAttribute('data-counter') || '0', 10);
				const duration = 1400;
				const startTime = performance.now();
				function tick(now) {
					const p = Math.min(1, (now - startTime) / duration);
					const val = Math.floor(end * easeOutCubic(p));
					el.textContent = val.toString();
					if (p < 1) requestAnimationFrame(tick);
				}
				requestAnimationFrame(tick);
				io.unobserve(el);
			});
		}, { threshold: 0.4 });
		counters.forEach(c => io.observe(c));
	}

	function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

	const fallbackProjects = [
		{
			title: 'Retail Sales Performance Dashboard',
			slug: 'retail-sales-tableau',
			category: ['Tableau'],
			summary: 'Interactive Tableau workbook analyzing sales, customers, and profitability with drill-down views.',
			tech: ['Tableau'],
			image: '/assets/images/projects/sales-tableau.png',
			links: { github: 'https://github.com/Siddharthasrivastav/Sales-Data-Analysis-Tableau', tableau: 'REPLACE_WITH_TABLEAU_PUBLIC_URL_IF_AVAILABLE' }
		},
		{
			title: 'Pizza Sales Analytics (SQL + Power BI)',
			slug: 'pizza-sales-sql-powerbi',
			category: ['SQL', 'Power BI'],
			summary: 'End-to-end pipeline: SQL queries for KPIs + Power BI dashboard with visuals and measures.',
			tech: ['SQL','Power BI'],
			image: '/assets/images/projects/pizza-powerbi.png',
			links: { github: 'https://github.com/Siddharthasrivastav/Pizza-Sale-Data-Analysis-SQL', powerbi: 'REPLACE_WITH_POWER_BI_EMBED_URL' }
		},
		{
			title: 'Credit Card Transactions Analysis (Power BI)',
			slug: 'credit-card-transactions-powerbi',
			category: ['Power BI'],
			summary: 'Metrics on spend categories, customer segments, and trends with slicers and drillthrough.',
			tech: ['Power BI'],
			image: '/assets/images/projects/credit-card-powerbi.png',
			links: { github: 'https://github.com/Siddharthasrivastav/Credit-card-Transaction-Power-Bi-Project', powerbi: 'REPLACE_WITH_POWER_BI_EMBED_URL' }
		}
	];

	async function initProjects() {
		const featuredContainer = document.getElementById('featured-projects');
		const grid = document.getElementById('portfolio-grid');
		if (!featuredContainer && !grid) return;
		let projects = [];
		try {
			const res = await fetch('data/projects.json', { cache: 'no-store' });
			if (!res.ok) throw new Error('Failed to load projects.json');
			projects = await res.json();
		} catch (err) {
			console.warn('Using fallback projects due to fetch error:', err);
			projects = fallbackProjects;
		}

		if (featuredContainer) renderFeaturedProjects(projects.slice(0, 3), featuredContainer);
		if (grid) setupPortfolio(projects);
	}

	function renderFeaturedProjects(items, container) {
		container.innerHTML = items.map(projectCardHTML).join('');
	}

	function setupPortfolio(projects) {
		const grid = document.getElementById('portfolio-grid');
		const tabsContainer = document.getElementById('portfolio-filters');
		if (!grid || !tabsContainer) return;

		const categories = Array.from(new Set(projects.flatMap(p => p.category)));
		const tabs = ['All', ...categories];
		tabsContainer.innerHTML = tabs.map((t, i) => `<button class="tab${i===0?' active':''}" data-filter="${t}">${t}</button>`).join('');
		function applyFilter(cat) {
			const items = cat === 'All' ? projects : projects.filter(p => p.category.includes(cat));
			grid.innerHTML = items.map(projectCardHTML).join('');
			bindDetailButtons(items);
		}
		applyFilter('All');
		Array.from(tabsContainer.children).forEach(btn => {
			btn.addEventListener('click', () => {
				Array.from(tabsContainer.children).forEach(b => b.classList.remove('active'));
				btn.classList.add('active');
				applyFilter(btn.getAttribute('data-filter'));
			});
		});
	}

	function projectCardHTML(p) {
		const badges = (p.tech || []).map(t => `<span class="badge">${t}</span>`).join('');
		const gh = p.links?.github ? `<a class="btn btn-secondary" href="${p.links.github}" target="_blank" rel="noopener">GitHub</a>` : '';
		const extLink = p.links?.powerbi || p.links?.tableau || '';
		const extBtn = extLink ? `<a class="btn btn-primary" href="${extLink}" target="_blank" rel="noopener">Open</a>` : '';
		return `
			<article class="card reveal" aria-label="Project ${escapeHTML(p.title)}">
				<div class="thumb"><img src="${p.image}" alt="${escapeHTML(p.title)} thumbnail" loading="lazy"></div>
				<h3>${escapeHTML(p.title)}</h3>
				<p class="text-muted">${escapeHTML(p.summary)}</p>
				<div class="badge-row">${badges}</div>
				<div class="flex gap-2 mt-2">
					<button class="btn btn-primary" data-view="${p.slug}">View details</button>
					${gh}
					${extBtn}
				</div>
			</article>
		`;
	}

	function bindDetailButtons(projects) {
		const buttons = document.querySelectorAll('[data-view]');
		buttons.forEach(btn => {
			btn.addEventListener('click', () => {
				const slug = btn.getAttribute('data-view');
				const proj = projects.find(p => p.slug === slug) || fallbackProjects.find(p => p.slug === slug);
				if (proj) openProjectModal(proj);
			});
		});
	}

	function openProjectModal(project) {
		let modal = document.getElementById('project-modal');
		if (!modal) {
			modal = document.createElement('div');
			modal.id = 'project-modal';
			modal.className = 'modal';
			modal.innerHTML = `
				<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
					<div class="modal-header">
						<h3 id="modal-title"></h3>
						<button class="modal-close" aria-label="Close">×</button>
					</div>
					<div class="modal-body"></div>
				</div>
			`;
			document.body.appendChild(modal);
			modal.addEventListener('click', (e) => {
				if (e.target === modal) closeModal();
			});
			modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
		}
		const titleEl = modal.querySelector('#modal-title');
		const bodyEl = modal.querySelector('.modal-body');
		titleEl.textContent = project.title;

		let embedHTML = '';
		if (project.links?.powerbi) {
			embedHTML = `<div class="embed"><iframe src="${project.links.powerbi}" title="Power BI embed for ${escapeHTML(project.title)}" allowfullscreen loading="lazy"></iframe><span class="note">Replace with secure Power BI embed URL</span></div>`;
		} else if (project.links?.tableau) {
			embedHTML = `<div class="embed"><iframe src="${project.links.tableau}" title="Tableau Public embed for ${escapeHTML(project.title)}" allowfullscreen loading="lazy"></iframe><span class="note">Replace with Tableau Public URL</span></div>`;
		} else {
			embedHTML = `<p class="text-muted">No live embed available. See GitHub or screenshots above.</p>`;
		}

		bodyEl.innerHTML = `
			<p>${escapeHTML(project.summary)}</p>
			${embedHTML}
		`;

		modal.classList.add('open');
		document.body.style.overflow = 'hidden';
		function closeModal() {
			modal.classList.remove('open');
			document.body.style.overflow = '';
		}
	}

	function escapeHTML(str) {
		return (str||'').replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
	}

	function setupContactForm() {
		const form = document.getElementById('contact-form');
		if (!form) return;
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			const name = form.querySelector('input[name="name"]').value.trim();
			const email = form.querySelector('input[name="email"]').value.trim();
			const message = form.querySelector('textarea[name="message"]').value.trim();
			if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
				alert('Please fill out all fields with a valid email.');
				return;
			}
			const subject = encodeURIComponent('Inquiry from website');
			const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
			window.location.href = `mailto:letsmailsiddhartha@gmail.com?subject=${subject}&body=${body}`;
		});
	}

	(function setupImageFallbacks() {
		document.querySelectorAll('img').forEach(img => {
			img.addEventListener('error', function onErr() {
				img.removeEventListener('error', onErr);
				const w = img.getAttribute('width') || 800;
				const h = img.getAttribute('height') || 450;
				const svg = encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 800 450'><defs><linearGradient id='g' x1='0' x2='1'><stop offset='0' stop-color='%230B1F3B'/><stop offset='1' stop-color='%23112A4D'/></linearGradient></defs><rect width='800' height='450' fill='url(%23g)'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23F5B301' font-family='Montserrat, Arial' font-size='24'>Image coming soon</text></svg>`);
				img.src = `data:image/svg+xml;charset=utf8,${svg}`;
			});
		});
	})();
})();