const main = document.querySelector('#main');

const CONFIG = {
	point: {
		width: 2,
		height: 30,
	}
}

function mousePointerInteraction() {
	window.addEventListener('mousemove', (e) => {
		const points = document.querySelectorAll('.point');
		
		points.forEach((point, index) => {
			const x = (point.offsetLeft) + (point.clientWidth / 2);
			const y = (point.offsetTop) + (point.clientHeight / 2);
			const rad = Math.atan2((e.pageX - main.offsetLeft) - x, (e.pageY - main.offsetTop) - y);
			const rot = (rad * (180 / Math.PI) * -1) + 180;

			const maxRad = 80;
			const positionLeft = e.pageX - main.offsetLeft;
			const positionTop = e.pageY - main.offsetTop;
			const match1 = positionLeft < point.offsetLeft + maxRad && positionLeft > point.offsetLeft - maxRad;
			const match2 = positionTop < point.offsetTop + maxRad && positionTop > point.offsetTop - maxRad;
			
			setStyle(point, {
				transform: `rotate(${rot}deg)`,
				background: match1 && match2 ? 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.8))' : 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.4))'
			})
		});
	});
	
	main.append(createPoints());
}

function setStyle(element, styles) {
	Object.keys(styles).forEach(key => {
		element.style[key] = styles[key];
	});
}

function createPoint({width, ...otherProps}) {
	const point = document.createElement('div');
	point.classList.add('point');
	
	setStyle(point, {
		borderRadius: width,
		width,
		...otherProps,
	});
	
	return point;
}

function createPoints() {
	const viewPort = {
		width: main.clientWidth,
		height: main.clientHeight
	};
	
	const gap = 20;
	const totalWidth = (viewPort.width / (CONFIG.point.width + gap));
	const totalHeight = (viewPort.height / (CONFIG.point.height + gap))

	for (let j = 0; j < totalHeight; j++) {
		for(let i = 0; i < totalWidth; i++) {
			const point = createPoint({
				top: `${j * (gap + CONFIG.point.height)}px`,
				left: `${i * (gap + CONFIG.point.width)}px`,
				width: `${CONFIG.point.width}px`,
				height: `${CONFIG.point.height}px`,
			});

			main.appendChild(point);
		}
	}
}

mousePointerInteraction();