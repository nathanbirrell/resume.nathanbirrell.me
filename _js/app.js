/**
 * TODO document me
 */
(function () {
  'use strict';

  function getNextImageFromUrlAnchor() {
    // get anchor tag frm url, get that photo el
    var url = window.location.href;
    var idx = url.indexOf('#');
    var hash = idx !== -1 ? url.substring(idx + 1) : '';
    return hash;
  }

  function getNextImageInGallery() {
    var hash = getNextImageFromUrlAnchor();
    var nextImage = document.getElementById(hash);

    // if no anchor or image for it, get first .photo el
    if (!nextImage) {
      nextImage = document.querySelectorAll('.photo')[0];
    }

    return nextImage;
  }

  function getCurrentImageElementAndRemoveClass() {
    var currentImage = document.querySelectorAll('.photo.current')[0];
    if (!currentImage) {
      currentImage = document.querySelectorAll('.photo')[0];
    }
    currentImage.className = currentImage.className.replace(new RegExp('(^|\\b)' + 'current'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    return currentImage;
  }

  function setCurrentImage() {
    console.debug('setCurrentImage'); // eslint-disable-line no-console
    // remove default .current class from current el
    getCurrentImageElementAndRemoveClass();
    var nextImageEl = getNextImageInGallery();
    // console.debug(nextImageEl); // eslint-disable-line no-console
    nextImageEl.className += ' current';
  }

  function nextImage() {
    event.preventDefault(); // for anchor link compatability

    // remove default .current class from current el
    var currentImage = document.querySelectorAll('.photo.current')[0];
    currentImage.className = currentImage.className.replace(new RegExp('(^|\\b)' + 'current'.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');

    var nextImageEl = currentImage.nextElementSibling;

    if (!nextImageEl) {
      nextImageEl = document.querySelectorAll('.photo')[0];
    }

    var nextImageId = nextImageEl.id;
    window.location.hash = nextImageId;

    nextImageEl.className += ' current';

    return false;
  }

  function identifyPortraitImages() {
    var photoBlocks = document.querySelectorAll('.photo-block');
    photoBlocks.forEach(function(photoBlock) { // eslint-disable-line
      var img = photoBlock.querySelector('.photo-mini');
      var isPortrait = img.clientWidth < img.clientHeight;
      var isSquare = img.clientWidth === img.clientHeight;
      if (isPortrait) {
        photoBlock.classList.add('is-portrait');
      }
      if (isSquare) {
        photoBlock.classList.add('is-square');
      }
    });
  }

  function loadImages() {
    var photoBlocks = document.querySelectorAll('.photo-block');

    photoBlocks.forEach(function(photoBlock) { // eslint-disable-line
      var mini = photoBlock.querySelector('.photo-mini');

      // 1: load mini image and show it
      var imgSmall = new Image();
      imgSmall.src = mini.src;
      function onloadSmall() {
        mini.classList.add('loaded');
      }
      imgSmall.onload = onloadSmall;

      // 2: load large image
      var imgLarge = new Image();
      imgLarge.src = photoBlock.dataset.large;
      function onloadLarge() {
        mini.classList.remove('loaded'); // hide mini
        imgLarge.classList.add('loaded');
      }
      imgLarge.classList.add('photo-large');
      photoBlock.appendChild(imgLarge);

      imgLarge.onload = onloadLarge;
    });
  }

  function init() {
    var galleryElement = document.getElementById('gallery');

    identifyPortraitImages();

    if (galleryElement) {
      setCurrentImage();
      loadImages();

      galleryElement.addEventListener('click', nextImage);
    }
  }

  window.onload = init;
})();
