<?php
require('./connect.php');
$messege = "";
if (!empty($_GET['u_id']) && !empty($_GET['btn_uploaded_id'])) {
    $u_id = $_GET['u_id'];
    if ($_GET['btn_uploaded_id'] === "upLoaded" || $_GET['btn_uploaded_id'] === "imgUser") {
        $result = $conn->query("SELECT musics.m_id, musics.name, musics.artist,
         musics.img, musics.src, musics.date, musics.time FROM musics
          INNER JOIN uploads ON musics.m_id = uploads.m_id AND uploads.u_id = '$u_id'");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_upload";
        }
    }
    if ($_GET['btn_uploaded_id'] === "liked" || $_GET['btn_uploaded_id'] === "defaultLoad") {
        $result = $conn->query("SELECT * FROM musics INNER JOIN library ON musics.m_id = library.m_id AND library.u_id = '$u_id'");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_like";
        }
    }
} else if (!empty($_GET['u_id']) && !empty($_GET['getPlaylist']) && $_GET['getPlaylist'] === "getPlaylist") {
    $u_id = $_GET['u_id'];
    $result = $conn->query("SELECT playlist.pl_id,playlist.img,playlist.name_playlist,playlist.date,users.name FROM playlist INNER JOIN users ON playlist.u_id = users.u_id AND playlist.u_id = '$u_id'");
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $json = json_encode($data);
        echo $json;
        $conn->close();
    } else {
        $messege =  "empty_data_playlist";
    }
} else
    // select music load disvoer
    if (!empty($_GET['key']) && $_GET['key'] === "discover") {
        $result = $conn->query("SELECT * FROM musics WHERE m_id BETWEEN 1 AND 9 ");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_music";
        }
    } else if (!empty($_GET['key']) && $_GET['key'] === "getAllData") {
        $result = $conn->query("SELECT * FROM musics");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_music";
        }
    } else if (!empty($_GET['u_id']) && !empty($_GET['key']) && $_GET['key'] === "getPlaylistData") {
        $u_id = $_GET['u_id'];
        $result = $conn->query("SELECT * FROM playlist");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_playlist";
        }
    } else if (!empty($_GET['u_id']) && !empty($_GET['dataHint'])) {
        $u_id = $_GET['u_id'];
        $dataHint = $_GET['dataHint'];
        $data = array();
        $result = $conn->query("SELECT * FROM musics");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                if (strpos(strtolower($row['name']), strtolower($dataHint))) {
                    $data[] = $row;
                }
            }
            if (count($data) > 0) {
                $json = json_encode($data);
                echo $json;
            } else {
                $messege = "empty_data_hint";
            }
            $conn->close();
        } else {
            $messege =  "empty_data_hint";
        }
    } else if (!empty($_GET['u_id']) && !empty($_GET['pl_id']) && !empty($_GET['action']) && $_GET['action'] == "getPlaylistItem") {
        $u_id = $_GET['u_id'];
        $pl_id = $_GET['pl_id'];
        $result = $conn->query("SELECT musics.m_id, musics.name, musics.artist, musics.img, musics.src, musics.time FROM musics 
                                INNER JOIN playlist_item ON musics.m_id = playlist_item.m_id 
                                INNER JOIN playlist ON playlist.pl_id = playlist_item.pl_id AND playlist.pl_id = '$pl_id'
                                INNER JOIN users ON users.u_id = playlist.u_id AND users.u_id = '$u_id'");
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $json = json_encode($data);
            echo $json;
            $conn->close();
        } else {
            $messege =  "empty_data_playlistItem";
        }
    } else if (!empty($_GET['song_id'])) {
        $song_id = $_GET['song_id'];
        $result = $conn->query("SELECT * FROM musics WHERE m_id = $song_id");
        if ($result->num_rows > 0) {
            $row = $result->fetch_assoc();
            echo json_encode($row);
            $conn->close();
        } else {
            echo 'empty';
        }
    } else if (!empty($_POST['song_id']) && !empty($_POST['updateListen'])) {
        if ($_POST['updateListen'] === "updateListen") {
            $song_id = $_POST['song_id'];
            $result = $conn->query("SELECT * FROM musics WHERE m_id = $song_id");
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $count = $row['quatityLis'] + 1;
                $result1 = $conn->query("UPDATE musics SET quatityLis = '$count' WHERE m_id = $song_id");
                $conn->close();
            }
        }
    }

echo $messege;
