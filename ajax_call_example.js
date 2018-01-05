$('button').on('click', function(){ 
  $('.text').text('loading . . .');
  
  $.ajax({
    type:"GET",
    url:"https://aquarium-tracker-pwa-dannnb.c9users.io/products",
    success: function(data, req, res) {
      console.log(res.status);
      //$('.text').text(JSON.stringify(data));
      $.each( data.products, function( index, key, value ) {
        $('.text').append("<div></div>");
        $.each(data.products[index], function( key, value ) {
          if (key == "_id" || "request"){
            $('.text div').append(
              key + ": " + value + "</br>"
            );
          } else {
            $('.text div').append(
              key + ": " + value + "</br>"
            );
          }
        });
      });
    },
    // set headers if you want it to return 200 all the time and not 304 (not modified)
    headers: {
      'Content-Type': 'application/json'
    }
  });
});