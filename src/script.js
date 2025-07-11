/**
 * @file This script manages the interactive 3D cube and its navigator.
 * @author Önder ALTINTAŞ
 * @version 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const cube = document.querySelector('.cube');
    const navigatorContainer = document.querySelector('.navigator-container');
    const navigatorCube = document.querySelector('.navigator-cube');

    let currentYRotation = 0;

    const navInitialXRotation = -15;
    const navInitialYRotation = -15;

    const prizmaWidthRatio = 0.8;
    const prizmaHeightRatio = 0.6;

    const perspectiveMultiplier = 2.5;

    /**
     * Adjusts the size of the main cube and its perspective based on viewport dimensions.
     * Also sets CSS custom properties for dynamic sizing and positioning.
     * @function
     * @returns {void}
     */
    function adjustCubeSizeAndPerspective() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const prizmaDynamicWidth = viewportWidth * prizmaWidthRatio;
        const prizmaDynamicHeight = viewportHeight * prizmaHeightRatio;

        container.style.width = `${prizmaDynamicWidth}px`;
        container.style.height = `${prizmaDynamicHeight}px`;

        const effectiveSizeForPerspective = Math.min(prizmaDynamicWidth, prizmaDynamicHeight);
        const calculatedPerspective = effectiveSizeForPerspective * perspectiveMultiplier;
        document.documentElement.style.setProperty('--perspective-value', `${calculatedPerspective}px`);

        const faceTranslateZ = prizmaDynamicWidth / 2;
        document.documentElement.style.setProperty('--face-translateZ', `translateZ(${faceTranslateZ}px)`);

        const fontSize = prizmaDynamicHeight * 0.3;
        document.documentElement.style.setProperty('--face-font-size', `${fontSize}px`);
    }

    adjustCubeSizeAndPerspective();
    window.addEventListener('resize', adjustCubeSizeAndPerspective);

    /**
     * Updates the CSS transform properties for both the main cube and the navigator cube
     * to reflect the current rotation.
     * @function
     * @returns {void}
     */
    function updateCubeRotations() {
        cube.style.transform = `rotateY(${currentYRotation}deg)`;
        navigatorCube.style.transform = `rotateX(${navInitialXRotation}deg) rotateY(${navInitialYRotation + currentYRotation}deg)`;
    }

    updateCubeRotations();

    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            currentYRotation -= 90;
            updateCubeRotations();
        } else if (event.key === 'ArrowLeft') {
            currentYRotation += 90;
            updateCubeRotations();
        }
    });

    let isDragging = false;
    let startX = 0;
    let currentRotationOnDragStart = 0;
    const rotationStep = 90;

    /**
     * Sets up mouse drag and touch swipe support for a given HTML element.
     * Allows rotating the cube by 90-degree steps based on swipe direction.
     * @function
     * @param {HTMLElement} element - The DOM element to make draggable/swipeable.
     * @returns {void}
     */
    function setupDraggableElement(element) {
        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            startX = event.clientX;
            currentRotationOnDragStart = currentYRotation;
            element.style.transition = 'none';
        });

        element.addEventListener('touchstart', (event) => {
            isDragging = true;
            startX = event.touches[0].clientX;
            currentRotationOnDragStart = currentYRotation;
            element.style.transition = 'none';
        });

        element.addEventListener('mousemove', (event) => {
            if (!isDragging) return;
        });

        element.addEventListener('touchmove', (event) => {
            if (!isDragging) return;
        });

        const handleEnd = (event) => {
            if (!isDragging) return;
            isDragging = false;
            element.style.transition = '';

            let endX;
            if (event.type.startsWith('mouse')) {
                endX = event.clientX;
            } else {
                endX = event.changedTouches[0].clientX;
            }

            const swipeDistance = endX - startX;
            const swipeThreshold = 50;

            if (swipeDistance > swipeThreshold) {
                currentYRotation += rotationStep;
            } else if (swipeDistance < -swipeThreshold) {
                currentYRotation -= rotationStep;
            }
            updateCubeRotations();
        };

        element.addEventListener('mouseup', handleEnd);
        element.addEventListener('mouseleave', handleEnd);
        element.addEventListener('touchend', handleEnd);
        element.addEventListener('touchcancel', handleEnd);
    }

    setupDraggableElement(container);
    setupDraggableElement(navigatorContainer);
});