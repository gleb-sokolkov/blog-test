ymaps.ready(init);
function init() {
    var myMap = new ymaps.Map("map", {
        center: [54.9492196,73.3387021],
        zoom: 15
    }, {
        searchControlProvider: 'yandex#search'
    });

    myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
        balloonContent: 'CoreDataNet'
    }, {
        // Опции.
        // Необходимо указать данный тип макета.
        iconLayout: 'default#image',
        // Своё изображение иконки метки.
        iconImageHref: '/favicon.ico',
        // Размеры метки.
        iconImageSize: [40, 40],
    }),

    myMap.geoObjects.add(myPlacemark);
    myMap.behaviors.disable('scrollZoom');
    myMap.behaviors.disable('drag');
}