var $drawing = $('#drawing'),
    $drawingSelect = $('#select-drawing'),
    $colorSelect = $('#select-color');

var color = $colorSelect[0].value;
console.log($colorSelect);

$drawingSelect.change(function(event) {  
  $drawing.load(event.target.value);
});

$colorSelect.change(function(event) {
  color = event.target.value;
});

$drawing.click(function(event) {
  event.target.style.fill = color;
});