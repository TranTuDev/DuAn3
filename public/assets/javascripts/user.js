



(function ($) {

	var $window = $(window),
		$body = $('body');

	// Breakpoints
	breakpoints({
		xlarge: ['1281px', '1680px'],
		large: ['981px', '1280px'],
		medium: ['737px', '980px'],
		small: ['481px', '736px'],
		xsmall: [null, '480px']
	});

	// Remove preload class on load
	$window.on('load', function () {
		setTimeout(() => $body.removeClass('is-preload'), 100);
	});

	// Mobile detection (fallback)
	if (/Mobi|Android/i.test(navigator.userAgent))
		$body.addClass('is-touch');

	// Smooth scroll
	$('.scrolly').scrolly({ speed: 2000 });

	// Dropdown menu
	$('#nav > ul').dropotron({
		alignment: 'right',
		hideDelay: 350
	});

	// Mobile nav panel
	$('<div id="titleBar">' +
		'<a href="#navPanel" class="toggle"></a>' +
		'<span class="title">' + $('#logo').html() + '</span>' +
		'</div>').appendTo($body);

	$('<div id="navPanel">' +
		'<nav>' + $('#nav').navList() + '</nav>' +
		'</div>').appendTo($body)
		.panel({
			delay: 500,
			hideOnClick: true,
			hideOnSwipe: true,
			resetScroll: true,
			resetForms: true,
			side: 'left',
			target: $body,
			visibleClass: 'navPanel-visible'
		});

	// Parallax helper
	$.fn._parallax = function () {
		if (navigator.userAgent.indexOf('Trident') !== -1 || /Mobi|Android/i.test(navigator.userAgent))
			return this; // IE or Mobile

		return this.each(function () {
			const $el = $(this);
			function updatePos() {
				let pos = $window.scrollTop() - $el.position().top;
				$el.css('background-position', 'center ' + (pos * -0.15) + 'px');
			}
			$el.css('background-position', 'center 0px');
			$window.on('scroll._parallax', updatePos);
		});
	};

	// Spotlights
	$('.spotlight')
		._parallax()
		.each(function () {
			const $this = $(this);
			const imgSrc = $this.find('.image.main > img').attr('src');
			if (imgSrc) $this.css('background-image', 'url("' + imgSrc + '")');

			let mode = 'middle', top = 0, bottom = 0;
			if ($this.hasClass('top')) { mode = 'top'; top = '-20%'; }
			else if ($this.hasClass('bottom')) { mode = 'bottom-only'; bottom = '20%'; }

			$this.scrollex({
				mode, top, bottom,
				initialize: () => $this.addClass('inactive'),
				terminate: () => $this.removeClass('inactive'),
				enter: () => $this.removeClass('inactive')
				// leave: () => $this.addClass('inactive')
			});
		});

	// Wrappers
	$('.wrapper').each(function () {
		const $this = $(this);
		$this.scrollex({
			top: 250,
			bottom: 0,
			initialize: () => $this.addClass('inactive'),
			terminate: () => $this.removeClass('inactive'),
			enter: () => $this.removeClass('inactive')
		});
	});

	// Banner parallax
	$('#banner')._parallax();

})(jQuery);








