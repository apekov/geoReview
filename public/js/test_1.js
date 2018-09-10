let myMap;
let clusterer;
const nameFild = document.querySelector('#name');
const placeFild = document.querySelector('#place');
const reviewFild = document.querySelector('#review');
const obj = {
    placemark: [
        // {
        //     id: [55.650625, 37.62708],
        //     adress: 'Таганская улица, 22',
        //     reviews: [
        //         {
        //             name: 'alan',
        //             place: 'Chocolate room',
        //             review: 'this magazin, may very bed observe',
        //             date: ''
        //         },
        //         {
        //             name: 'alan',
        //             place: 'Chocolate room',
        //             review: 'this magazin, may very bed observe',
        //             date: ''
        //         }
        //       ]
        //     }
          ]
        };
ymaps.ready(() => {
  // Создаем карту
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 12
    }, { searchControlProvider: 'yandex#search' }),
    // Объявляем кластеризатор объектов
    // clusterer = new ymaps.Clusterer({
    //     // preset: 'islands#invertedVioletClusterIcons',
    //     clusterDisableClickZoom: true,
    //     clusterOpenBalloonOnClick: false,
    // });
    objectManager = new ymaps.ObjectManager({
    // Чтобы метки начали кластеризоваться, выставляем опцию.
    clusterize: true,
    // ObjectManager принимает те же опции, что и кластеризатор.
    // gridSize: 32,
    clusterHasBalloon: false,
    clusterHasHint: false,
    objectHasBalloon: false,
    objectHasHint: false,
    geoObjectOpenBalloonOnClick: false,
    clusterDisableClickZoom: true
    });

    // Получение данных по адресу после щелчка
    myMap.events.add('click', function (e) {
      let exam = e.get('coords');
      let geocoder = ymaps.geocode(exam, {results: 1});
      let name;
      // Получение координат
      geocoder.then(
          function (res) {
            let nearest = res.geoObjects.get(0);
            let name = nearest.properties.get('name');
            let closeButton, windowBlock, saveButton, fildName, fildPlace, fildReview;
            renderHtml('#with_review');
            // Получение элементов управления
            function getControl(){
                closeButton = document.querySelector('.close_window');
                windowBlock = document.querySelector('.review_block');
                saveButton = document.querySelector('#save');
                fildName = document.querySelector('#name');
                fildPlace = document.querySelector('#place');
                fildReview = document.querySelector('#review');
                closeButton.addEventListener('click', () => {
                    windowBlock.style.display = 'none';
                });
                saveButton.addEventListener('click', () => {
                    savePlace();
                    renderMap();
                    let array = obj.placemark;
                    for (let i = 0; i < array.length; i++) {
                        if(exam === array[i].id){
                          renderHtml('#with_review', array[i]);
                          getControl();
                        }
                    }
                })
            };
            getControl();
            objectManager.events.add('click', function (e) {
              let objectId = e.get('objectId'),
                object = objectManager.objects.getById(objectId);
                  if(object){
                    renderHtml('#with_review', object.properties.items);
                    getControl();
                  }
            });
            objectManager.clusters.events.add('click', function (e) {
                let clusterFeat = objectManager.clusters.getById(e.get('objectId')).features;
                 // console.log(cluster.features);
                 for (let i = 0; i < clusterFeat.length; i++) {
                   console.log(clusterFeat[i]);
                 }
            });
            // Сохранение координат и отзывов
            function savePlace(){
              let boof;
              // Надо сохранять точку или отзыв?
              if(!obj.placemark.length){boof = false;}
              else {
                let array = obj.placemark;
                for (let i = 0; i < array.length; i++) {
                  boof = (array[i].id === exam) ? array[i] : false;
                }
              }
              if(!boof){
                save();
              } else {
                saveReview(boof);
              }
              // Сохранение точки
              function save(){
                let info = {};
                info.id = exam;
                info.adress = name;
                info.reviews = [
                  {
                  name: fildName.value,
                  adress: fildPlace.value,
                  review: fildReview.value
                  }
                ];
                obj.placemark.push(info);
              }
              // Сохранение отзыва на точке
              function saveReview(boof){
                let info = {
                  name: fildName.value,
                  adress: fildPlace.value,
                  review: fildReview.value
                };
                boof.reviews.push(info);
              }
            };
            // Добавление точек на карту
            function renderMap() {
                let array = obj.placemark;
                objectManager.removeAll();
                let myPlacemarks = [];
                for (let i = 0; i < array.length; i++) {
                    let count = array[i].reviews.length
                    objectManager.add({
                        type: 'Feature',
                        id: i,
                        geometry: {
                            type: 'Point',
                            coordinates: array[i].id
                        },
                        properties: {
                            balloonContent: 'Содержимое балуна ' + i,
                            items: array[i]
                        }
                    });
                }
                myMap.geoObjects.add(objectManager);
            }
          },
          function (err) {
              alert('Ошибка');
          }
      )
    });
})
