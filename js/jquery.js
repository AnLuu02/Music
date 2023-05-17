
$(document).ready(function(){
      
    $("#btn-upload-avatar").click(function(e){
        e.preventDefault();
        let form_data = new FormData();
        let img = $("#fileUploadAvatar")[0].files;

      // Check image selected or not
      if(img.length > 0){
          form_data.append('my_image', img[0]);
          $.ajax({
              url: './controller/upload_img.php',
              type: 'post',
              data: form_data,
              contentType: false,
              processData: false,
              success: function(res){
                console.log(res);
                  const data = JSON.parse(res);
                  if (data.error != 1) {
                    let path ="../uploads/" + data.src;
                    $("#imgUser").attr("src", path);
                    $("#imgProfile").attr("src", path);

                    $('#form_upload_avatar.form_upload').removeClass('active');
                    $("#fileUploadAvatar").val('');
                  }else {
                      alert(data.em);
                  }
              }
          });
       
      }else {
        alert("Please select an image.");
      }
    });

    $("#btn-remove-avatar").click(function(e){
      e.preventDefault();
      let form_data = new FormData();
      form_data.append('status', "remove");
        $.ajax({
            url: './controller/upload_img.php',
            type: 'post',
            data: form_data,
            contentType: false,
            processData: false,
            success: function(res){
                  let path = "";
                  $("#imgUser").attr("src", path);
                  $("#imgProfile").attr("src", path);
                  $('#form_upload_avatar.form_upload').removeClass('active');
                  $("#fileUploadAvatar").val('');
            }
        });
     
  });

    // create playlist
    $("#btn-create-playlist").click(function(e){
      e.preventDefault();
      let form_data = new FormData();
      let img = $("#fileUploadPlaylist")[0].files;
      let namePlaylist = $("#name_playlist").val();
    // Check image selected or not
      if(img.length > 0){
          form_data.append('my_image', img[0]);
          form_data.append('my_name',namePlaylist);
          $.ajax({
              url: './controller/create_playlist.php',
              type: 'post',
              data: form_data,
              contentType: false,
              processData: false,
              success: function(res){
                const data = JSON.parse(res);
                  if (data.error === 0) {
                    $("#form_upload_playlist").removeClass('active');
                    let html = data.data.map((data,index)=>{
                      return `<li class="playlist_item" index="${index}" id_playlist="${data.pl_id}">
                              <div class="content">
                                  <img src="../uploads/${data.img}" alt="">
                                  <div class="hover_playlist">
                                      <ion-icon name="close-outline" id="delete_playlist"></ion-icon>
                                      <ion-icon name="play" id="run_playlist"></ion-icon>
                                      <ion-icon name="heart"></ion-icon>
                                  </div>
                              </div>
                              <div class="name_pl" style="margin: 4px 0 2px 0;">${data.name_playlist}</div>
                              <div class="author_pl">${data.name}</div>
                          </li>`;
                  })    
                  $('#list_playlist').html(html.join(""));
                  }else {
                      alert(data.message);
                  }
              }
          });
      
      }else {
        alert("Please select an image.");
      }
  });



     // // change name user
     $("#change_name, #save_name").on('click',function(e){

      if($(e.target).attr('id') == "change_name"){
        $('#name_user').attr('readonly',false);
        $('#name_user').css({"background":"white","color":"black"})
        $('#change_name').css("display", 'none');
        $('#save_name').css("display" , 'block');
      }
      if($(e.target).attr('id') == "save_name"){
          e.preventDefault();
          let form_data = new FormData();
          let new_name = $("#name_user").val();
          form_data.append('new_name',new_name);
          $.ajax({
              url: './controller/change_name_user.php',
              type: 'post',
              data: form_data,
              contentType: false,
              processData: false,
              success: function(res){
                let data = JSON.parse(res);
                if(data.error == 0){
                  $("#name_user").val(data.name)
                  $("#snackbar").addClass('show');
                  $("#snackbar ion-icon").attr('name','checkmark-done-circle-outline');
                  $("#snackbar .text p").html("<p style='color:green'>Thay đổi thành công!</p>");
                  setTimeout(()=>{
                    $("#snackbar").removeClass("show");
                  },1500)
                  
                  $('#name_user').attr('readonly',true).css({"background":"transparent","color":"white"})
                  $('#change_name').css("display", 'block');
                  $('#save_name').css("display" , 'none');
              }
                else{
                  $("#name_user").val(data.name)
                  $("#snackbar").addClass('show');
                  $("#snackbar ion-icon").attr('name','bug-outline');
                  $("#snackbar .text p").html("<p style='color:red'>Thay đổi tên không thành công.</p>");
                  setTimeout(()=>{
                    $("#snackbar").removeClass("show");
                  },1500)                   
                }
              }
          });
      }
  
  })





});