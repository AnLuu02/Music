<?php
require("./connect.php");
session_start();
if (isset($_FILES['m_img']) && isset($_FILES['m_src'])) {
    $u_id = $_SESSION['id'];
    $name = $_POST['m_name'];
    $artist = $_POST['m_artist'];
    $date = date('Y-m-d');
    $time = $_POST['m_time'];
    $nation = $_POST['m_nation'];
    $category = $_POST['m_category'];

    $img = "";
    $src = "";

    $img_name = $_FILES['m_img']['name'];
    $img_size = $_FILES['m_img']['size'];
    $tmp_img_name = $_FILES['m_img']['tmp_name'];
    $error    = $_FILES['m_img']['error'];

    $src_name = $_FILES['m_src']['name'];
    $src_size = $_FILES['m_src']['size'];
    $tmp_src_name = $_FILES['m_src']['tmp_name'];
    $error    = $_FILES['m_src']['error'];

    # if there is not error occurred while uploading
    if ($error === 0) {
        if ($name == "" || $artist == "" || $nation == "" || $category == "") {
            # error message
            $message = "Xin lỗi, phải nhập đủ các thông tin upload.";
            # response array
            $error = array('error' => 1, 'message' => $message);
            echo json_encode($error);
            exit();
        } else {
            // kiem tra nhạc  da ton tai chua
            $result = $conn->query("SELECT * FROM upload_videos WHERE u_id = '$u_id'");
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                if ($row['name'] === $name && $row['artist'] === $artist) {
                    $message = "Xin lỗi, bài hát đã được upload.";

                    # response array
                    $error = array('error' => 1, 'message' => $message);
                    echo json_encode($error);
                    exit();
                }
            }
        }

        if ($src_size <= 0) {
            # error message
            $message = "Xin lỗi, đường dẫn bài hát không được để trống.";
            # response array
            $error = array('error' => 1, 'message' => $message);
            echo json_encode($error);
            exit();
        } else if ($img_size > 1000000) {
            # error message
            $message = "Xin lỗi, file ảnh của bạn quá lớn.";
            # response array
            $error = array('error' => 1, 'message' => $message);
            echo json_encode($error);
            exit();
        } else {

            # get image extension store it in var
            $img_ex = pathinfo($img_name, PATHINFO_EXTENSION);
            $src_ex = pathinfo($src_name, PATHINFO_EXTENSION);

            $img_ex_lc = strtolower($img_ex);
            $src_ex_lc = strtolower($src_ex);

            $allowed_exs_img = array("jpg", "jpeg", "png");
            $allowed_exs_src = array("mp4", "avi", "3gp", "mov", "mpeg", "mp3");

            if (in_array($img_ex_lc, $allowed_exs_img) && in_array($src_ex_lc, $allowed_exs_src)) {
                $new_img_name = uniqid("IMG-UPLOAD-IMG-", true) . '.' . $img_ex_lc;
                $new_src_name = uniqid("IMG-UPLOAD-VIDEO-", true) . '.' . $src_ex_lc;



                # crating upload path on root directory
                $img_upload_path = "../uploads/" . $new_img_name;
                $src_upload_path = "../videos/" . $new_src_name;

                $img = $img_upload_path;
                $src = $src_upload_path;


                # move uploaded image to 'uploads' folder
                move_uploaded_file($tmp_img_name, $img_upload_path);
                move_uploaded_file($tmp_src_name, $src_upload_path);


                # inserting imge name into database
                $sql = "INSERT INTO upload_videos (`name`,`artist`,`img`,`src`,`date`,`time`,`nation`,`category`,`u_id`) 
                    VALUES('$name','$artist','$img','$src','$date','$time','$nation','$category','$u_id')";
                mysqli_query($conn, $sql);

                // kiem tra xem bai hat da tồn tại hay 
                $exist = false;
                $result = $conn->query("SELECT * FROM musics");
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        if ($row['name'] === $name && $row['artist'] === $artist) {
                            $exist = true;
                        }
                    }
                }
                if ($exist === false) {
                    $sql1 = "INSERT INTO musics (`name`,`artist`,`img`,`src`,`date`,`time`,`nation`,`category`,`u_id_upload`) VALUES('$name','$artist','$img','$src','$date','$time','$nation','$category','$u_id')";
                    mysqli_query($conn, $sql1);
                }
                $result1 = $conn->query("SELECT * FROM upload_videos WHERE u_id = '$u_id'");
                if ($result1->num_rows > 0) {
                    while ($row = $result1->fetch_assoc()) {
                        $data[] = $row;
                    }
                }
                $res = array('error' => 0, 'data' => $data);
                echo json_encode($res);
                exit();
            } else {
                # error message
                $message = "Định dạng file không được cho phép.";

                # response array
                $error = array('error' => 1, 'message' => $message);


                echo json_encode($error);
                exit();
            }
        }
    } else {
        # error message
        $message = "Lỗi không xác định. Mời thử lại.";

        # response array
        $error = array('error' => 1, 'message' => $message);


        echo json_encode($error);
        exit();
    }
}


  // upload video
//   $("#btn-upload-music").click(function(e){
//     e.preventDefault();
//     let form_data = new FormData();
//     let img = $("#fileUploadIcon")[0].files;
//     let src = $("#fileUploadMusic")[0].files;
//     let name = $("#m_name_up").val();
//     let artist = $("#m_artist_up").val();
//     let time = $("#m_time_up").val();
//     let nation = $("#m_nation_up").val();
//     let category = $("#m_category_up").val();


//   // Check image selected or not
//   if(img.length > 0 && src.length > 0){
//       form_data.append('m_img', img[0]);
//       form_data.append('m_src', src[0]);
//       form_data.append('m_name', name);
//       form_data.append('m_artist', artist);
//       form_data.append('m_time', time);
//       form_data.append('m_nation', nation);
//       form_data.append('m_category', category);

//       $.ajax({
//           url: '../controller/upload_video.php',
//           type: 'post',
//           data: form_data,
//           contentType: false,
//           processData: false,
//           success: function(res){
//               const data = JSON.parse(res);
//               if (data.error != 1) {
//                 load_music(data.data,document.getElementById('data_library'),true);
//                 $('#form_upload_music').removeClass('active');
//               }else {
//                   alert(data.message);
//               }

//           }
//       });
  
//   }else {
//     alert("Hãy nhập đầy đủ cả ảnh bài hát và đường dẫn file bài hát.");
//   }
// });